package com.pasantia.pasantia.services

import com.pasantia.pasantia.dto.UpdateUserBasicDTO
import com.pasantia.pasantia.dto.admin.CreateAdminForEntityDTO
import com.pasantia.pasantia.dto.company.companyadmin.CompanyAdminDTO
import com.pasantia.pasantia.entities.CompanyAdmin
import com.pasantia.pasantia.entities.User
import com.pasantia.pasantia.entities.UserRole
import com.pasantia.pasantia.entities.UserRoleId
import com.pasantia.pasantia.mappers.CompanyAdminMapper
import com.pasantia.pasantia.repositories.*
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime
import java.util.*

@Service
class CompanyAdminService(
    private val companyAdminRepository: CompanyAdminRepository,
    private val companyRepository: CompanyRepository,
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val roleRepository: RoleRepository,
    private val userRoleRepository: UserRoleRepository,
    private val userService: UserService
) {

    // ============================================================
    // READ
    // ============================================================
    fun list(): List<CompanyAdminDTO> =
        companyAdminRepository.findAllByActiveTrue()
            .map { CompanyAdminMapper.toDTO(it) }

    fun listByCompany(companyId: UUID): List<CompanyAdminDTO> =
        companyAdminRepository.findAllByCompanyIdAndActiveTrue(companyId)
            .map { CompanyAdminMapper.toDTO(it) }

    fun get(id: UUID): CompanyAdminDTO {
        val admin = companyAdminRepository.findByIdAndActiveTrue(id)
            ?: throw IllegalArgumentException("CompanyAdmin not found or inactive")

        return CompanyAdminMapper.toDTO(admin)
    }

    // ============================================================
    // CREATE
    // ============================================================
    @Transactional
    fun createCompanyAdmin(companyId: UUID, dto: CreateAdminForEntityDTO): CompanyAdminDTO {

        val company = companyRepository.findById(companyId)
            .orElseThrow { IllegalArgumentException("Company not found: $companyId") }

        if (userRepository.findByEmail(dto.email) != null)
            throw IllegalArgumentException("Email already exists: ${dto.email}")

        val user = User(
            email = dto.email,
            fullName = dto.fullName,
            passwordHash = passwordEncoder.encode(dto.password),
            active = true
        )
        userRepository.save(user)

        val role = roleRepository.findByName("COMPANY_ADMIN")
            ?: throw IllegalArgumentException("Role COMPANY_ADMIN not found")

        userRoleRepository.save(
            UserRole(
                id = UserRoleId(user.id!!, role.id!!),
                user = user,
                role = role
            )
        )

        val companyAdmin = CompanyAdmin(
            user = user,
            company = company,
            active = true,
            deletedAt = null
        )

        companyAdminRepository.save(companyAdmin)

        return CompanyAdminMapper.toDTO(companyAdmin)
    }

    // ============================================================
    // DELETE (CORRECTO)
    // ============================================================
    @Transactional
    fun delete(id: UUID) {
        val admin = companyAdminRepository.findByIdAndActiveTrue(id)
            ?: throw IllegalArgumentException("CompanyAdmin not found or already inactive")

        // 🔥 fuente de verdad
        userService.softDeleteUser(admin.user.id!!)

        // estado informativo
        admin.active = false
        admin.deletedAt = LocalDateTime.now()
    }


    @Transactional
    fun update(id: UUID, dto: UpdateUserBasicDTO): CompanyAdminDTO {

        val admin = companyAdminRepository.findByIdAndActiveTrue(id)
            ?: throw IllegalArgumentException("CompanyAdmin not found or inactive")

        val user = admin.user

        // Email con validación
        val newEmail = dto.email.trim().lowercase()
        if (newEmail != user.email.lowercase()) {
            val existing = userRepository.findByEmail(newEmail)
            if (existing != null && existing.id != user.id) {
                throw IllegalArgumentException("Email already exists: $newEmail")
            }
            user.email = newEmail
        }

        // Nombre
        user.fullName = dto.fullName.trim()

        // Password opcional
        val newPass = dto.password?.trim()
        if (!newPass.isNullOrBlank()) {
            user.passwordHash = passwordEncoder.encode(newPass)
        }

        userRepository.save(user)

        return CompanyAdminMapper.toDTO(admin)
    }
    // ============================================================
    // RESTORE
    // ============================================================
    @Transactional
    fun restore(id: UUID) {
        val admin = companyAdminRepository.findById(id)
            .orElseThrow { IllegalArgumentException("CompanyAdmin not found") }

        userService.restoreUser(admin.user.id!!)

        admin.active = true
        admin.deletedAt = null
    }

}
