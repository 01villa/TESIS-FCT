package com.pasantia.pasantia.config

import com.pasantia.pasantia.entities.Role
import com.pasantia.pasantia.entities.User
import com.pasantia.pasantia.entities.UserRole
import com.pasantia.pasantia.entities.UserRoleId
import com.pasantia.pasantia.repositories.RoleRepository
import com.pasantia.pasantia.repositories.UserRepository
import com.pasantia.pasantia.repositories.UserRoleRepository
import org.springframework.boot.CommandLineRunner
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.crypto.password.PasswordEncoder
import java.util.*

@Configuration
class DataInitializer {

    @Bean
    fun seedDatabase(
        roleRepository: RoleRepository,
        userRepository: UserRepository,
        userRoleRepository: UserRoleRepository,
        passwordEncoder: PasswordEncoder
    ) = CommandLineRunner {

        // =============================
        // 1. CREAR ROLES SI NO EXISTEN
        // =============================
        val roles = listOf(
            "ADMIN",
            "SCHOOL_ADMIN",
            "SCHOOL_TUTOR",
            "COMPANY_ADMIN",
            "COMPANY_TUTOR",
            "STUDENT",
        )

        roles.forEach { roleName ->
            if (roleRepository.findByName(roleName) == null) {
                roleRepository.save(Role(name = roleName))
                println("➡ Rol creado: $roleName")
            }
        }

        // =============================
        // 2. CREAR SUPER ADMIN
        // =============================
        val adminEmail = "admin@fctcuenca.edu.ec"

        if (userRepository.findByEmail(adminEmail) == null) {
            val admin = User(
                email = adminEmail,
                fullName = "Super Administrador",
                passwordHash = passwordEncoder.encode("admin123"),
                active = true,
                deletedAt = null
            )

            val saved = userRepository.save(admin)

            val adminRole = roleRepository.findByName("ADMIN")!!

            userRoleRepository.save(
                UserRole(
                    id = UserRoleId(saved.id!!, adminRole.id),
                    user = saved,
                    role = adminRole
                )
            )

            println("⭐ Usuario administrador creado: $adminEmail / admin123")
        } else {
            println("✔ El usuario administrador ya existe.")
        }
    }
}
