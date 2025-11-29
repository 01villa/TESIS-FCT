package com.pasantia.pasantia.services

import com.pasantia.pasantia.dto.CreateUserDTO
import com.pasantia.pasantia.dto.UpdateUserDTO
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
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime
import java.util.*

@Service
class UserService(
    private val userRepository: UserRepository,
    private val roleRepository: RoleRepository,
    private val userRoleRepository: UserRoleRepository,
    private val passwordEncoder: PasswordEncoder
) {

    fun createUser(dto: CreateUserDTO): UserDTO {

        if (userRepository.existsByEmail(dto.email))
            throw IllegalArgumentException("Email already registered")

        val user = User(
            email = dto.email,
            passwordHash = passwordEncoder.encode(dto.password),
            fullName = dto.fullName,
            active = true,
            deletedAt = null
        )

        val saved = userRepository.save(user)

        dto.roles.forEach { roleName ->
            val role = roleRepository.findByName(roleName)
                ?: throw IllegalArgumentException("Role $roleName not found")

            userRoleRepository.save(
                UserRole(
                    id = UserRoleId(saved.id!!, role.id),
                    user = saved,
                    role = role
                )
            )
        }

        return getUserDTOWithRoles(saved)
    }

    fun listActiveUsers(): List<UserDTO> =
        userRepository.findAllByActiveTrue()
            .map { getUserDTOWithRoles(it) }

    fun getUser(id: UUID): UserDTO {
        val user = userRepository.findByIdAndActiveTrue(id)
            ?: throw IllegalArgumentException("User not found or inactive")

        return getUserDTOWithRoles(user)
    }

    @Transactional
    fun updateUser(id: UUID, dto: UpdateUserDTO): UserDTO {
        val user = userRepository.findByIdAndActiveTrue(id)
            ?: throw IllegalArgumentException("User not found or inactive")

        dto.fullName?.let { user.fullName = it }
        dto.password?.let { user.passwordHash = passwordEncoder.encode(it) }

        userRepository.save(user)

        if (dto.roles != null) {
            userRoleRepository.deleteRolesByUserId(user.id!!)

            dto.roles.forEach { roleName ->
                val role = roleRepository.findByName(roleName)
                    ?: throw IllegalArgumentException("Role $roleName not found")

                userRoleRepository.save(
                    UserRole(
                        id = UserRoleId(user.id!!, role.id),
                        user = user,
                        role = role
                    )
                )
            }
        }

        return getUserDTOWithRoles(user)
    }

    fun softDeleteUser(id: UUID) {
        val user = userRepository.findByIdAndActiveTrue(id)
            ?: throw IllegalArgumentException("User not found or already inactive")

        user.active = false
        user.deletedAt = LocalDateTime.now()

        userRepository.save(user)
    }

    fun restoreUser(id: UUID) {
        val user = userRepository.findById(id)
            .orElseThrow { IllegalArgumentException("User not found") }

        user.active = true
        user.deletedAt = null

        userRepository.save(user)
    }

    fun getUserDTOWithRoles(user: User): UserDTO {
        val roles = userRoleRepository.findByUserId(user.id!!)
            .map { it.role.name }

        return UserMapper.toDTO(user, roles)
    }
    fun findByEmail(email: String): User? {
        return userRepository.findByEmailAndActiveTrue(email)
    }

}
