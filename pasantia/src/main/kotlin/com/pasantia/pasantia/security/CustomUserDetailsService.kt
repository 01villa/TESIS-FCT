package com.pasantia.pasantia.security

import com.pasantia.pasantia.repositories.UserRepository
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

@Service
class CustomUserDetailsService(
    private val userRepository: UserRepository
) : UserDetailsService {

    override fun loadUserByUsername(email: String): UserDetails {
        val user = userRepository.findByEmail(email)
            ?: throw UsernameNotFoundException("User not found: $email")

        val authorities = listOf(SimpleGrantedAuthority("USER")) // se reemplaza luego al traer roles

        return org.springframework.security.core.userdetails.User(
            user.email,
            user.passwordHash,
            authorities
        )
    }
}
