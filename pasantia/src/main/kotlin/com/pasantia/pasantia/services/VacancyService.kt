package com.pasantia.pasantia.services

import com.pasantia.pasantia.dto.vacancy.CreateVacancyDTO
import com.pasantia.pasantia.dto.vacancy.UpdateVacancyDTO
import com.pasantia.pasantia.dto.vacancy.VacancyDTO
import com.pasantia.pasantia.entities.Company
import com.pasantia.pasantia.entities.Vacancy
import com.pasantia.pasantia.mappers.VacancyMapper
import com.pasantia.pasantia.repositories.CompanyRepository
import com.pasantia.pasantia.repositories.SpecialtyRepository
import com.pasantia.pasantia.repositories.VacancyRepository
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.util.UUID

@Service
class VacancyService(
    private val vacancyRepository: VacancyRepository,
    private val companyRepository: CompanyRepository,
    private val specialtyRepository: SpecialtyRepository // 👈 NUEVO
) {

    // ======================================================
    // CREATE
    // ======================================================
    @Transactional
    fun create(companyId: UUID, dto: CreateVacancyDTO): VacancyDTO {

        val company: Company = companyRepository.findByIdAndActiveTrue(companyId)
            ?: throw IllegalArgumentException("Company not found or inactive")

        val specialty = specialtyRepository.findById(dto.specialtyId)
            .orElseThrow { IllegalArgumentException("Specialty not found") }

        validateDates(dto.startDate, dto.endDate)
        validateCapacity(dto.capacity)

        val vacancy = Vacancy(
            company = company,
            specialty = specialty, // 👈 CLAVE
            title = dto.title,
            description = dto.description,
            requirements = dto.requirements,
            capacity = dto.capacity,
            startDate = dto.startDate,
            endDate = dto.endDate,
            status = dto.status,
            active = true,
            deletedAt = null
        )

        return VacancyMapper.toDTO(vacancyRepository.save(vacancy))
    }

    // ======================================================
    // LIST
    // ======================================================
    fun listActive(): List<VacancyDTO> =
        vacancyRepository.findAllByActiveTrue()
            .map { VacancyMapper.toDTO(it) }

    fun listByCompany(companyId: UUID): List<VacancyDTO> =
        vacancyRepository.findAllByCompanyIdAndActiveTrue(companyId)
            .map { VacancyMapper.toDTO(it) }

    // ======================================================
    // GET ONE
    // ======================================================
    fun get(id: UUID): VacancyDTO {
        val vacancy = vacancyRepository.findByIdAndActiveTrue(id)
            ?: throw IllegalArgumentException("Vacancy not found or inactive")

        return VacancyMapper.toDTO(vacancy)
    }

    // ======================================================
    // UPDATE
    // ======================================================
    @Transactional
    fun update(id: UUID, dto: UpdateVacancyDTO): VacancyDTO {

        val v = vacancyRepository.findByIdAndActiveTrue(id)
            ?: throw IllegalArgumentException("Vacancy not found or inactive")

        dto.title?.let { v.title = it }
        dto.description?.let { v.description = it }
        dto.requirements?.let { v.requirements = it }
        dto.capacity?.let {
            validateCapacity(it)
            v.capacity = it
        }

        dto.specialtyId?.let {
            val specialty = specialtyRepository.findById(it)
                .orElseThrow { IllegalArgumentException("Specialty not found") }
            v.specialty = specialty
        }

        if (dto.startDate != null && dto.endDate != null) {
            validateDates(dto.startDate, dto.endDate)
            v.startDate = dto.startDate
            v.endDate = dto.endDate
        } else {
            dto.startDate?.let {
                validateDates(it, v.endDate)
                v.startDate = it
            }
            dto.endDate?.let {
                validateDates(v.startDate, it)
                v.endDate = it
            }
        }

        dto.status?.let { v.status = it }

        v.updatedAt = LocalDateTime.now()

        return VacancyMapper.toDTO(vacancyRepository.save(v))
    }

    // ======================================================
    // STATUS CHANGE
    // ======================================================
    fun close(id: UUID): VacancyDTO {
        val v = vacancyRepository.findByIdAndActiveTrue(id)
            ?: throw IllegalArgumentException("Vacancy not found")

        v.status = 2.toShort()
        v.updatedAt = LocalDateTime.now()

        return VacancyMapper.toDTO(vacancyRepository.save(v))
    }

    fun open(id: UUID): VacancyDTO {
        val v = vacancyRepository.findByIdAndActiveTrue(id)
            ?: throw IllegalArgumentException("Vacancy not found")

        v.status = 1.toShort()
        v.updatedAt = LocalDateTime.now()

        return VacancyMapper.toDTO(vacancyRepository.save(v))
    }

    // ======================================================
    // SOFT DELETE / RESTORE
    // ======================================================
    fun softDelete(id: UUID) {
        val v = vacancyRepository.findByIdAndActiveTrue(id)
            ?: throw IllegalArgumentException("Vacancy not found or already inactive")

        v.active = false
        v.deletedAt = LocalDateTime.now()
        vacancyRepository.save(v)
    }

    fun restore(id: UUID) {
        val v = vacancyRepository.findById(id)
            .orElseThrow { IllegalArgumentException("Vacancy not found") }

        v.active = true
        v.deletedAt = null
        vacancyRepository.save(v)
    }

    // ======================================================
    // LIST AVAILABLE
    // ======================================================
    fun listAvailableForStudents(): List<VacancyDTO> =
        vacancyRepository.findAllByActiveTrue()
            .filter { it.status == 1.toShort() && it.capacity > 0 }
            .map { VacancyMapper.toDTO(it) }

    // ======================================================
    // VALIDATIONS
    // ======================================================
    private fun validateDates(start: java.time.LocalDate, end: java.time.LocalDate) {
        if (end.isBefore(start))
            throw IllegalArgumentException("End date cannot be before start date")
    }

    private fun validateCapacity(capacity: Int) {
        if (capacity <= 0)
            throw IllegalArgumentException("Capacity must be greater than 0")
    }
}
