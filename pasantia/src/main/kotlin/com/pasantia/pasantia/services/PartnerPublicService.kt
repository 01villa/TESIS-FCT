package com.pasantia.pasantia.services

import com.pasantia.pasantia.dto.public.PartnerPublicDTO
import com.pasantia.pasantia.repositories.CompanyRepository
import com.pasantia.pasantia.repositories.SchoolRepository
import org.springframework.stereotype.Service

@Service
class PartnerPublicService(
    private val schoolRepository: SchoolRepository,
    private val companyRepository: CompanyRepository
) {

    fun getAllActivePartners(): List<PartnerPublicDTO> {

        val schools = schoolRepository.findAllByActiveTrue().map {
            PartnerPublicDTO(
                id = it.id,
                name = it.name,
                type = "SCHOOL",
                logoUrl = it.logoUrl,
                publicUrl = it.publicUrl      // ✅ NUEVO
            )
        }

        val companies = companyRepository.findAllByActiveTrue().map {
            PartnerPublicDTO(
                id = it.id,
                name = it.name,
                type = "COMPANY",
                logoUrl = it.logoUrl,
                publicUrl = it.publicUrl      // ✅ NUEVO
            )
        }

        return schools + companies
    }
}
