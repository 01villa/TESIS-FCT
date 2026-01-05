package com.pasantia.pasantia.services

import com.pasantia.pasantia.dto.school.SchoolDTO
import com.pasantia.pasantia.dto.admin.CreateSchoolDTO
import com.pasantia.pasantia.dto.school.UpdateSchoolDTO
import com.pasantia.pasantia.entities.School
import com.pasantia.pasantia.mappers.SchoolMapper
import com.pasantia.pasantia.repositories.SchoolRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.multipart.MultipartFile
import java.time.LocalDateTime
import java.util.*

@Service
class SchoolService(
    private val schoolRepository: SchoolRepository,
    private val fileStorageService: FileStorageService

) {

    /** ============================
     * CREATE SCHOOL
     * ============================ */
    fun create(dto: CreateSchoolDTO): SchoolDTO {
        val school = School(
            name = dto.name,
            address = dto.address,
            active = true,
            deletedAt = null
        )
        return SchoolMapper.toDTO(schoolRepository.save(school))
    }

    /** ============================
     * LIST ACTIVE SCHOOLS
     * ============================ */
    fun list(): List<SchoolDTO> =
        schoolRepository.findAllByActiveTrue()
            .map { SchoolMapper.toDTO(it) }

    /** ============================
     * GET SCHOOL BY ID
     * ============================ */
    fun get(id: UUID): SchoolDTO {
        val school = schoolRepository.findByIdAndActiveTrue(id)
            ?: throw IllegalArgumentException("School not found or inactive")

        return SchoolMapper.toDTO(school)
    }

    /** ============================
     * UPDATE SCHOOL
     * ============================ */
    @Transactional
    fun update(id: UUID, dto: UpdateSchoolDTO): SchoolDTO {

        val school = schoolRepository.findByIdAndActiveTrue(id)
            ?: throw IllegalArgumentException("School not found or inactive")

        dto.name?.let { school.name = it }
        dto.address?.let { school.address = it }

        school.updatedAt = LocalDateTime.now()

        schoolRepository.save(school)

        return SchoolMapper.toDTO(school)
    }

    /** ============================
     * SOFT DELETE SCHOOL
     * ============================ */
    fun softDelete(id: UUID) {
        val school = schoolRepository.findByIdAndActiveTrue(id)
            ?: throw IllegalArgumentException("School not found or already inactive")

        school.active = false
        school.deletedAt = LocalDateTime.now()

        schoolRepository.save(school)
    }

    /** ============================
     * RESTORE SCHOOL
     * ============================ */
    fun restore(id: UUID) {
        val school = schoolRepository.findById(id)
            .orElseThrow { IllegalArgumentException("School not found") }

        school.active = true
        school.deletedAt = null

        schoolRepository.save(school)
    }

    @Transactional
    fun updateLogo(schoolId: UUID, file: MultipartFile) {
        val school = schoolRepository.findByIdAndActiveTrue(schoolId)
            ?: throw IllegalArgumentException("School not found or inactive")

        val contentType = file.contentType ?: ""
        if (!contentType.startsWith("image/")) {
            throw IllegalArgumentException("Only image files are allowed")
        }

        val url = fileStorageService.store(file, "schools")
        school.logoUrl = url
    }


    @Transactional
    fun removeLogo(schoolId: UUID) {
        val school = schoolRepository.findByIdAndActiveTrue(schoolId)
            ?: throw IllegalArgumentException("School not found or inactive")

        school.logoUrl = null
        school.updatedAt = LocalDateTime.now()

        schoolRepository.save(school)
    }

}
