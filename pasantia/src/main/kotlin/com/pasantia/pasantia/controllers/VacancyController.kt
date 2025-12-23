package com.pasantia.pasantia.controllers

import com.pasantia.pasantia.dto.student.StudentBasicDTO
import com.pasantia.pasantia.dto.vacancy.CreateVacancyDTO
import com.pasantia.pasantia.dto.vacancy.UpdateVacancyDTO
import com.pasantia.pasantia.dto.vacancy.VacancyDTO
import com.pasantia.pasantia.mappers.StudentMapper
import com.pasantia.pasantia.mappers.VacancyMapper
import com.pasantia.pasantia.repositories.StudentRepository
import com.pasantia.pasantia.repositories.VacancyRepository
import com.pasantia.pasantia.services.VacancyService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/vacancies")
class VacancyController(
    private val vacancyService: VacancyService,
    private val vacancyRepository: VacancyRepository,
    private val studentRepository: StudentRepository
) {

    // Crear vacante asociada a una empresa
    @PostMapping("/company/{companyId}")
    fun createVacancy(
        @PathVariable companyId: UUID,
        @RequestBody dto: CreateVacancyDTO
    ) = ResponseEntity.ok(vacancyService.create(companyId, dto))

    // Listar todas las vacantes activas
    @GetMapping
    fun listActiveVacancies() = ResponseEntity.ok(vacancyService.listActive())

    // Listar vacantes activas de una empresa específica
    @GetMapping("/company/{companyId}")
    fun listVacanciesByCompany(@PathVariable companyId: UUID) =
        ResponseEntity.ok(vacancyService.listByCompany(companyId))

    // Obtener una vacante específica
    @GetMapping("/{id}")
    fun getVacancy(@PathVariable id: UUID) =
        ResponseEntity.ok(vacancyService.get(id))

    // Actualizar vacante (solo campos editables)
    @PutMapping("/{id}")
    fun updateVacancy(
        @PathVariable id: UUID,
        @RequestBody dto: UpdateVacancyDTO
    ) = ResponseEntity.ok(vacancyService.update(id, dto))

    // Cerrar vacante
    @PatchMapping("/{id}/close")
    fun closeVacancy(@PathVariable id: UUID) =
        ResponseEntity.ok(vacancyService.close(id))

    // Reabrir vacante
    @PatchMapping("/{id}/open")
    fun openVacancy(@PathVariable id: UUID) =
        ResponseEntity.ok(vacancyService.open(id))

    // Eliminar vacante de forma lógica (soft delete)
    @DeleteMapping("/{id}")
    fun deleteVacancy(@PathVariable id: UUID): ResponseEntity<Void> {
        vacancyService.softDelete(id)
        return ResponseEntity.noContent().build()
    }

    // Restaurar una vacante eliminada
    @PatchMapping("/{id}/restore")
    fun restoreVacancy(@PathVariable id: UUID) =
        ResponseEntity.ok(vacancyService.restore(id))

    @GetMapping("/by-specialty/{specialtyId}")
    fun listBySpecialty(
        @PathVariable specialtyId: UUID
    ): List<VacancyDTO> =
        vacancyRepository.findAllBySpecialtyIdAndActiveTrue(specialtyId)
            .map { VacancyMapper.toDTO(it) }

    // OPCIONAL: solo abiertas y con cupo
    @GetMapping("/by-specialty/{specialtyId}/available")
    fun listAvailableBySpecialty(
        @PathVariable specialtyId: UUID
    ): List<VacancyDTO> =
        vacancyRepository
            .findAllBySpecialtyIdAndActiveTrueAndStatusAndCapacityGreaterThan(
                specialtyId,
                1, // abiertas
                0  // con cupo
            )
            .map { VacancyMapper.toDTO(it) }

    @GetMapping("/{vacancyId}/eligible-students")
    fun listEligibleStudents(
        @PathVariable vacancyId: UUID
    ): List<StudentBasicDTO> {

        val vacancy = vacancyRepository.findByIdAndActiveTrue(vacancyId)
            ?: throw IllegalArgumentException("Vacancy not found or inactive")

        return studentRepository
            .findAllBySpecialtyIdAndActiveTrue(vacancy.specialty.id)
            .map { StudentMapper.toBasicDTO(it) }
    }
}
