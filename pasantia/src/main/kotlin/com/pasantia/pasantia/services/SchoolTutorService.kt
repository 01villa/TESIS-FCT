package com.pasantia.pasantia.services

import com.pasantia.pasantia.dto.CreateUserDTO
import com.pasantia.pasantia.dto.school.schoolTutor.CreateSchoolTutorDTO
import com.pasantia.pasantia.dto.school.schoolTutor.SchoolTutorDTO
import com.pasantia.pasantia.dto.school.schoolTutor.UpdateSchoolTutorDTO
import com.pasantia.pasantia.entities.SchoolTutor
import com.pasantia.pasantia.mappers.SchoolTutorMapper
import com.pasantia.pasantia.repositories.*
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime
import java.util.*

@Service
class SchoolTutorService(
    private val schoolTutorRepository: SchoolTutorRepository,
    private val schoolRepository: SchoolRepository,
    private val userService: UserService,
    private val userRepository: UserRepository
) {

    // ============================================================
    // CREATE
    // ============================================================
    @Transactional
    fun create(schoolId: UUID, dto: CreateSchoolTutorDTO): SchoolTutorDTO {

        val school = schoolRepository.findByIdAndActiveTrue(schoolId)
            ?: throw IllegalArgumentException("School not found or inactive")

        val userDTO = userService.createUser(
            CreateUserDTO(
                email = dto.email,
                fullName = dto.fullName,
                password = dto.password,
                roles = listOf("SCHOOL_TUTOR")
            )
        )

        val user = userRepository.findById(userDTO.id)
            .orElseThrow { IllegalArgumentException("User not found after creation") }

        val tutor = SchoolTutor(
            school = school,
            user = user,
            phone = dto.phone,
            active = true,
            deletedAt = null
        )

        schoolTutorRepository.save(tutor)

        return SchoolTutorMapper.toDTO(tutor)
    }

    // ============================================================
    // READ
    // ============================================================
    fun list(): List<SchoolTutorDTO> =
        schoolTutorRepository.findAllByActiveTrue()
            .map { SchoolTutorMapper.toDTO(it) }

    fun listBySchool(schoolId: UUID): List<SchoolTutorDTO> =
        schoolTutorRepository.findAllBySchoolIdAndActiveTrue(schoolId)
            .map { SchoolTutorMapper.toDTO(it) }

    fun get(id: UUID): SchoolTutorDTO {
        val tutor = schoolTutorRepository.findByIdAndActiveTrue(id)
            ?: throw IllegalArgumentException("SchoolTutor not found or inactive")

        return SchoolTutorMapper.toDTO(tutor)
    }

    // ============================================================
    // UPDATE
    // ============================================================
    @Transactional
    fun update(id: UUID, dto: UpdateSchoolTutorDTO): SchoolTutorDTO {
        val tutor = schoolTutorRepository.findByIdAndActiveTrue(id)
            ?: throw IllegalArgumentException("SchoolTutor not found or inactive")

        dto.phone?.let { tutor.phone = it }
        tutor.updatedAt = LocalDateTime.now()

        return SchoolTutorMapper.toDTO(tutor)
    }

    // ============================================================
    // DELETE (CORRECTO)
    // ============================================================
    @Transactional
    fun delete(id: UUID) {
        val tutor = schoolTutorRepository.findByIdAndActiveTrue(id)
            ?: throw IllegalArgumentException("SchoolTutor not found or already inactive")

        // 🔥 fuente de verdad
        userService.softDeleteUser(tutor.user.id!!)

        // estado informativo
        tutor.active = false
        tutor.deletedAt = LocalDateTime.now()
    }

    // ============================================================
    // RESTORE
    // ============================================================
    @Transactional
    fun restore(id: UUID) {
        val tutor = schoolTutorRepository.findById(id)
            .orElseThrow { IllegalArgumentException("SchoolTutor not found") }

        userService.restoreUser(tutor.user.id!!)

        tutor.active = true
        tutor.deletedAt = null
    }
}
