package com.pasantia.pasantia.services

import com.pasantia.pasantia.dto.auth.AuthRequest
import com.pasantia.pasantia.dto.auth.AuthResponse
import com.pasantia.pasantia.security.JwtTokenProvider
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.stereotype.Service

@Service
class AuthService(
    private val authenticationManager: AuthenticationManager,
    private val userService: UserService,
    private val jwtTokenProvider: JwtTokenProvider
) {

    fun login(request: AuthRequest): AuthResponse {

        val authenticationToken =
            UsernamePasswordAuthenticationToken(request.email, request.password)

        authenticationManager.authenticate(authenticationToken)

        val user = userService.findByEmail(request.email)
            ?: throw IllegalArgumentException("User not found")

        val dto = userService.getUserDTOWithRoles(user)

        val token = jwtTokenProvider.generateToken(
            email = dto.email,
            roles = dto.roles,
            userId = dto.id
        )

        return AuthResponse(
            token = token,
            user = dto
        )
    }

}
