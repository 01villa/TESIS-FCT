package com.pasantia.pasantia.services

import com.pasantia.pasantia.dto.CreateUserDTO
import com.pasantia.pasantia.dto.company.companytutor.CompanyTutorDTO
import com.pasantia.pasantia.dto.company.companytutor.CreateCompanyTutorDTO
import com.pasantia.pasantia.dto.company.companytutor.UpdateCompanyTutorDTO
import com.pasantia.pasantia.entities.CompanyTutor
import com.pasantia.pasantia.entities.User
import com.pasantia.pasantia.entities.UserRole
import com.pasantia.pasantia.entities.UserRoleId
import com.pasantia.pasantia.mappers.CompanyTutorMapper
import com.pasantia.pasantia.repositories.*
import org.springframework.transaction.annotation.Transactional
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.util.*

@Service
class CompanyTutorService(
    private val companyTutorRepository: CompanyTutorRepository,
    private val companyRepository: CompanyRepository,
    private val userService: UserService,
    private val userRepository: UserRepository
) {

    @Transactional
    fun create(companyId: UUID, dto: CreateCompanyTutorDTO): CompanyTutorDTO {

        val company = companyRepository.findByIdAndActiveTrue(companyId)
            ?: throw IllegalArgumentException("Company not found or inactive")

        val userDTO = userService.createUser(
            CreateUserDTO(
                email = dto.email,
                fullName = dto.fullName,
                password = dto.password,
                roles = listOf("COMPANY_TUTOR")
            )
        )

        val user = userRepository.findById(userDTO.id)
            .orElseThrow { IllegalArgumentException("User not found after creation") }

        val tutor = CompanyTutor(
            company = company,
            user = user,
            phone = dto.phone,
            active = true,
            deletedAt = null
        )

        return CompanyTutorMapper.toDTO(companyTutorRepository.save(tutor))
    }

    fun list(): List<CompanyTutorDTO> =
        companyTutorRepository.findAllByActiveTrue()
            .map { CompanyTutorMapper.toDTO(it) }

    fun listByCompany(companyId: UUID): List<CompanyTutorDTO> =
        companyTutorRepository.findAllByCompanyIdAndActiveTrue(companyId)
            .map { CompanyTutorMapper.toDTO(it) }

    fun get(id: UUID): CompanyTutorDTO {
        val tutor = companyTutorRepository.findByIdAndActiveTrue(id)
            ?: throw IllegalArgumentException("CompanyTutor not found or inactive")

        return CompanyTutorMapper.toDTO(tutor)
    }

    @Transactional
    fun update(id: UUID, dto: UpdateCompanyTutorDTO): CompanyTutorDTO {
        val tutor = companyTutorRepository.findByIdAndActiveTrue(id)
            ?: throw IllegalArgumentException("CompanyTutor not found or inactive")

        dto.phone?.let { tutor.phone = it }
        tutor.updatedAt = LocalDateTime.now()

        companyTutorRepository.save(tutor)
        return CompanyTutorMapper.toDTO(tutor)
    }

    fun softDelete(id: UUID) {
        val tutor = companyTutorRepository.findByIdAndActiveTrue(id)
            ?: throw IllegalArgumentException("CompanyTutor not found or already inactive")

        tutor.active = false
        tutor.deletedAt = LocalDateTime.now()
        companyTutorRepository.save(tutor)
    }

    fun restore(id: UUID) {
        val tutor = companyTutorRepository.findById(id)
            .orElseThrow { IllegalArgumentException("CompanyTutor not found") }

        tutor.active = true
        tutor.deletedAt = null
        companyTutorRepository.save(tutor)
    }
}
