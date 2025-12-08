package com.pasantia.pasantia.security

import com.pasantia.pasantia.repositories.SchoolAdminRepository
import com.pasantia.pasantia.repositories.SchoolTutorRepository
import com.pasantia.pasantia.repositories.CompanyAdminRepository
import com.pasantia.pasantia.repositories.CompanyTutorRepository
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
    private val schoolTutorRepository: SchoolTutorRepository,
    private val companyAdminRepository: CompanyAdminRepository,
    private val companyTutorRepository: CompanyTutorRepository
) {

    private val secretKey: SecretKey = Keys.hmacShaKeyFor(secret.toByteArray(Charsets.UTF_8))

    fun generateToken(email: String, roles: List<String>, userId: UUID): String {
        val now = Date()
        val expiry = Date(now.time + expirationMs)

        // Normalizar roles -> siempre ROLE_X
        val springRoles = roles.map { role ->
            if (role.startsWith("ROLE_")) role else "ROLE_$role"
        }

        var schoolId: UUID? = null
        var companyId: UUID? = null

        // ============================================
        // 🔵 SCHOOL_ADMIN / SCHOOL_TUTOR → schoolId
        // ============================================
        if (springRoles.contains("ROLE_SCHOOL_ADMIN") ||
            springRoles.contains("ROLE_SCHOOL_TUTOR")
        ) {
            schoolId =
                schoolAdminRepository.findByUserId(userId)?.school?.id
                    ?: schoolTutorRepository.findByUserId(userId)?.school?.id
        }

        // ============================================
        // 🔵 COMPANY_ADMIN / COMPANY_TUTOR → companyId
        // ============================================
        if (springRoles.contains("ROLE_COMPANY_ADMIN") ||
            springRoles.contains("ROLE_COMPANY_TUTOR")
        ) {
            companyId =
                companyAdminRepository.findByUserId(userId)?.company?.id
                    ?: companyTutorRepository.findByUserId(userId)?.company?.id
        }

        return Jwts.builder()
            .setSubject(email)
            .claim("roles", springRoles)
            .claim("userId", userId.toString())
            .claim("schoolId", schoolId?.toString())
            .claim("companyId", companyId?.toString())
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
            .body
            .subject

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
