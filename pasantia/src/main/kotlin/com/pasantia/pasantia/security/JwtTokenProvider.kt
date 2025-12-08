package com.pasantia.pasantia.security

import com.pasantia.pasantia.repositories.SchoolAdminRepository
import com.pasantia.pasantia.repositories.SchoolTutorRepository
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import java.util.*
import javax.crypto.SecretKey

@Component
class JwtTokenProvider(

    @Value("\${jwt.secret}")
    private val secret: String,

    @Value("\${jwt.expiration}")
    private val expirationMs: Long,

    private val schoolAdminRepository: SchoolAdminRepository,
    private val schoolTutorRepository: SchoolTutorRepository

) {

    private val secretKey: SecretKey = Keys.hmacShaKeyFor(secret.toByteArray(Charsets.UTF_8))

    fun generateToken(email: String, roles: List<String>, userId: UUID): String {
        val now = Date()
        val expiry = Date(now.time + expirationMs)

        // 🔥 Buscar escuela asignada al usuario (admin escolar o tutor escolar)
        val schoolId =
            schoolAdminRepository.findByUserId(userId)?.school?.id
                ?: schoolTutorRepository.findByUserId(userId)?.school?.id

        // 🔥 Transformar roles a ROLE_XYZ para que Spring los entienda
        val springRoles = roles.map { role ->
            if (role.startsWith("ROLE_")) role else "ROLE_$role"
        }

        return Jwts.builder()
            .setSubject(email)
            .claim("roles", springRoles)   // ⬅️ AQUÍ ESTÁ EL FIX
            .claim("userId", userId.toString())
            .claim("schoolId", schoolId?.toString())
            .setIssuedAt(now)
            .setExpiration(expiry)
            .signWith(secretKey, SignatureAlgorithm.HS256)
            .compact()
    }

    fun validateToken(token: String): Boolean {
        return try {
            Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
            true
        } catch (e: Exception) {
            false
        }
    }

    fun getEmailFromToken(token: String): String =
        Jwts.parserBuilder()
            .setSigningKey(secretKey)
            .build()
            .parseClaimsJws(token)
            .body.subject

    fun getRolesFromToken(token: String): List<String> =
        Jwts.parserBuilder()
            .setSigningKey(secretKey)
            .build()
            .parseClaimsJws(token)
            .body["roles"] as List<String>

    fun getUserIdFromToken(token: String): UUID =
        UUID.fromString(
            Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .body["userId"] as String
        )
}
