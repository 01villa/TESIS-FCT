package com.pasantia.pasantia.services

import com.pasantia.pasantia.dto.CreateVacancyDTO
import com.pasantia.pasantia.dto.VacancyDTO
import com.pasantia.pasantia.entities.Vacancy
import com.pasantia.pasantia.mappers.VacancyMapper
import com.pasantia.pasantia.repositories.CompanyAdminRepository
import com.pasantia.pasantia.repositories.UserRepository
import com.pasantia.pasantia.repositories.VacancyRepository
import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.stereotype.Service
import java.time.LocalDateTime

@Service
class VacancyService(
    private val vacancyRepository: VacancyRepository,
    private val userRepository: UserRepository,
    private val companyAdminRepository: CompanyAdminRepository,
    private val objectMapper: ObjectMapper
) {

    /**
     * Crea una vacante usando SOLO el email del usuario logueado (del token).
     */
    fun createVacancyForCompanyAdmin(
        currentUserEmail: String,
        dto: CreateVacancyDTO
    ): VacancyDTO {

        val user = userRepository.findByEmail(currentUserEmail)
            ?: throw RuntimeException("Usuario no encontrado")

        val companyAdmin = companyAdminRepository.findByUser(user)
            ?: throw RuntimeException("El usuario no es administrador de empresa")

        val company = companyAdmin.company

        // Convertir cualquier cosa enviada en el DTO a JSON String válido
        val jsonRequirements: String? = dto.requirements?.let {
            objectMapper.writeValueAsString(it)
        }

        val vacancy = Vacancy(
            company = company,
            createdBy = user,
            title = dto.title,
            description = dto.description,
            requirements = dto.requirements,
            capacity = dto.capacity,
            startDate = dto.startDate,
            endDate = dto.endDate,
            status = 1, // abierta
            createdAt = LocalDateTime.now()
        )

        val saved = vacancyRepository.save(vacancy)
        return VacancyMapper.toDTO(saved)
    }

    /**
     * Lista las vacantes de la empresa del admin logueado.
     */
    fun listVacanciesForCompanyAdmin(
        currentUserEmail: String
    ): List<VacancyDTO> {

        val user = userRepository.findByEmail(currentUserEmail)
            ?: throw RuntimeException("Usuario no encontrado")

        val companyAdmin = companyAdminRepository.findByUser(user)
            ?: throw RuntimeException("El usuario no es administrador de empresa")

        val companyId = companyAdmin.company.id
            ?: throw RuntimeException("Empresa sin ID")

        val vacancies = vacancyRepository.findByCompanyId(companyId)
        return vacancies.map { VacancyMapper.toDTO(it) }
    }
}
