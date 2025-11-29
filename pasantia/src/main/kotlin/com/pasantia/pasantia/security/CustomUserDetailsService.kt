package com.pasantia.pasantia.security

import com.pasantia.pasantia.repositories.UserRepository
import com.pasantia.pasantia.repositories.UserRoleRepository
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

@Service
class CustomUserDetailsService(
    private val userRepository: UserRepository,
    private val userRoleRepository: UserRoleRepository
) : UserDetailsService {

    override fun loadUserByUsername(email: String): UserDetails {

        val user = userRepository.findByEmailAndActiveTrue(email)
            ?: throw UsernameNotFoundException("User not found or inactive: $email")

        // Traemos los roles reales del usuario
        val roles = userRoleRepository.findRolesWithRoleLoaded(user.id!!)
            .map { SimpleGrantedAuthority("ROLE_${it.role.name}") }

        if (roles.isEmpty()) {
            throw UsernameNotFoundException("User has no roles assigned: $email")
        }

        return org.springframework.security.core.userdetails.User(
            user.email,
            user.passwordHash,
            roles
        )
    }
}
