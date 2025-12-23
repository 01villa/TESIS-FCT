package com.pasantia.pasantia.services

import com.pasantia.pasantia.dto.company.CompanyDTO
import com.pasantia.pasantia.dto.admin.CreateCompanyDTO
import com.pasantia.pasantia.dto.company.UpdateCompanyDTO
import com.pasantia.pasantia.entities.Company
import com.pasantia.pasantia.mappers.CompanyMapper
import com.pasantia.pasantia.repositories.CompanyRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.multipart.MultipartFile
import java.time.LocalDateTime
import java.util.*

@Service
class CompanyService(
    private val companyRepository: CompanyRepository,
    private val fileStorageService: FileStorageService,


) {


    /** ============================
     * CREATE COMPANY
     * ============================ */
    fun create(dto: CreateCompanyDTO): CompanyDTO {
        val company = Company(
            name = dto.name,
            address = dto.address,
            active = true,
            deletedAt = null
        )
        return CompanyMapper.toDTO(companyRepository.save(company))
    }

    /** ============================
     * LIST ACTIVE COMPANIES
     * ============================ */
    fun list(): List<CompanyDTO> =
        companyRepository.findAllByActiveTrue()
            .map { CompanyMapper.toDTO(it) }

    /** ============================
     * GET COMPANY BY ID
     * ============================ */
    fun get(id: UUID): CompanyDTO {
        val company = companyRepository.findByIdAndActiveTrue(id)
            ?: throw IllegalArgumentException("Company not found or inactive")

        return CompanyMapper.toDTO(company)
    }

    /** ============================
     * UPDATE COMPANY
     * ============================ */
    @Transactional
    fun update(id: UUID, dto: UpdateCompanyDTO): CompanyDTO {
        val company = companyRepository.findByIdAndActiveTrue(id)
            ?: throw IllegalArgumentException("Company not found or inactive")

        dto.name?.let { company.name = it }
        dto.address?.let { company.address = it }

        company.updatedAt = LocalDateTime.now()

        companyRepository.save(company)

        return CompanyMapper.toDTO(company)
    }

    /** ============================
     * SOFT DELETE
     * ============================ */
    fun softDelete(id: UUID) {
        val company = companyRepository.findByIdAndActiveTrue(id)
            ?: throw IllegalArgumentException("Company not found or already inactive")

        company.active = false
        company.deletedAt = LocalDateTime.now()

        companyRepository.save(company)
    }

    /** ============================
     * RESTORE COMPANY
     * ============================ */
    fun restore(id: UUID) {
        val company = companyRepository.findById(id)
            .orElseThrow { IllegalArgumentException("Company not found") }

        company.active = true
        company.deletedAt = null

        companyRepository.save(company)
    }


    @Transactional
    fun updateLogo(companyId: UUID, file: MultipartFile) {
        val company = companyRepository.findByIdAndActiveTrue(companyId)
            ?: throw IllegalArgumentException("Company not found or inactive")

        val contentType = file.contentType ?: ""
        if (!contentType.startsWith("image/")) {
            throw IllegalArgumentException("Only image files are allowed")
        }

        val url = fileStorageService.store(file, "companies")
        company.logoUrl = url
    }

    @Transactional
    fun removeLogo(companyId: UUID) {
        val company = companyRepository.findByIdAndActiveTrue(companyId)
            ?: throw IllegalArgumentException("Company not found or inactive")

        company.logoUrl = null
        company.updatedAt = LocalDateTime.now()

        companyRepository.save(company)
    }


}
