package com.pasantia.pasantia.services

import com.pasantia.pasantia.dto.admin.CreateAdminForEntityDTO
import com.pasantia.pasantia.dto.school.schoolAdmin.SchoolAdminDTO
import com.pasantia.pasantia.entities.SchoolAdmin
import com.pasantia.pasantia.entities.User
import com.pasantia.pasantia.entities.UserRole
import com.pasantia.pasantia.entities.UserRoleId
import com.pasantia.pasantia.mappers.SchoolAdminMapper
import com.pasantia.pasantia.repositories.*
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime
import java.util.*

@Service
class SchoolAdminService(
    private val schoolAdminRepository: SchoolAdminRepository,
    private val schoolRepository: SchoolRepository,
    private val userRepository: UserRepository,
    private val roleRepository: RoleRepository,
    private val userRoleRepository: UserRoleRepository,
    private val passwordEncoder: PasswordEncoder,
    private val userService: UserService
) {

    // ============================================================
    // READ
    // ============================================================
    fun list(): List<SchoolAdminDTO> =
        schoolAdminRepository.findAllByActiveTrue()
            .map { SchoolAdminMapper.toDTO(it) }

    fun listBySchool(schoolId: UUID): List<SchoolAdminDTO> =
        schoolAdminRepository.findAllBySchoolIdAndActiveTrue(schoolId)
            .map { SchoolAdminMapper.toDTO(it) }

    fun get(id: UUID): SchoolAdminDTO {
        val admin = schoolAdminRepository.findByIdAndActiveTrue(id)
            ?: throw IllegalArgumentException("SchoolAdmin not found or inactive")

        return SchoolAdminMapper.toDTO(admin)
    }

    // ============================================================
    // CREATE
    // ============================================================
    @Transactional
    fun createSchoolAdmin(schoolId: UUID, dto: CreateAdminForEntityDTO): SchoolAdminDTO {

        val school = schoolRepository.findById(schoolId)
            .orElseThrow { IllegalArgumentException("School not found: $schoolId") }

        if (userRepository.findByEmail(dto.email) != null)
            throw IllegalArgumentException("Email exists")

        val user = User(
            email = dto.email,
            fullName = dto.fullName,
            passwordHash = passwordEncoder.encode(dto.password),
            active = true
        )
        userRepository.save(user)

        val role = roleRepository.findByName("SCHOOL_ADMIN")
            ?: throw IllegalArgumentException("Role SCHOOL_ADMIN not found")

        userRoleRepository.save(
            UserRole(
                id = UserRoleId(user.id!!, role.id!!),
                user = user,
                role = role
            )
        )

        val admin = SchoolAdmin(
            user = user,
            school = school,
            active = true,
            deletedAt = null
        )

        schoolAdminRepository.save(admin)

        return SchoolAdminMapper.toDTO(admin)
    }

    // ============================================================
    // DELETE (CORRECTO)
    // ============================================================
    @Transactional
    fun delete(id: UUID) {
        val admin = schoolAdminRepository.findByIdAndActiveTrue(id)
            ?: throw IllegalArgumentException("SchoolAdmin not found or already inactive")

        // 🔥 fuente de verdad
        userService.softDeleteUser(admin.user.id!!)

        // estado informativo
        admin.active = false
        admin.deletedAt = LocalDateTime.now()
    }

    // ============================================================
    // RESTORE
    // ============================================================
    @Transactional
    fun restore(id: UUID) {
        val admin = schoolAdminRepository.findById(id)
            .orElseThrow { IllegalArgumentException("SchoolAdmin not found") }

        userService.restoreUser(admin.user.id!!)

        admin.active = true
        admin.deletedAt = null
    }
}
