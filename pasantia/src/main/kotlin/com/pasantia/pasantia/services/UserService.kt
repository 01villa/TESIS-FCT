package com.pasantia.pasantia.services

import com.pasantia.pasantia.dto.CreateUserDTO
import com.pasantia.pasantia.dto.UserDTO
import com.pasantia.pasantia.entities.User
import com.pasantia.pasantia.entities.UserRole
import com.pasantia.pasantia.entities.UserRoleId
import com.pasantia.pasantia.mappers.UserMapper
import com.pasantia.pasantia.repositories.RoleRepository
import com.pasantia.pasantia.repositories.UserRepository
import com.pasantia.pasantia.repositories.UserRoleRepository
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import java.util.*

@Service
class UserService(
    private val userRepository: UserRepository,
    private val roleRepository: RoleRepository,
    private val userRoleRepository: UserRoleRepository,
    private val passwordEncoder: PasswordEncoder
) {

    fun createUser(dto: CreateUserDTO): User {
        if (userRepository.existsByEmail(dto.email)) {
            throw IllegalArgumentException("Email already registered")
        }

        val user = User(
            email = dto.email,
            passwordHash = passwordEncoder.encode(dto.password),
            fullName = dto.fullName
        )

        val saved = userRepository.save(user)

        // Rol por defecto
        val defaultRole = roleRepository.findByName("USER")
            ?: throw IllegalStateException("Role USER not found")

        userRoleRepository.save(
            UserRole(
                id = UserRoleId(saved.id!!, defaultRole.id),
                user = saved,
                role = defaultRole
            )
        )

        return saved
    }

    fun findByEmail(email: String): User? {
        return userRepository.findByEmail(email)
    }

    fun getUserDTOWithRoles(user: User): UserDTO {
        val roles = userRoleRepository.findByUserId(user.id!!)
            .map { it.role.name }

        return UserMapper.toDTO(user, roles)
    }

}
