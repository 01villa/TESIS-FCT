package com.pasantia.pasantia.controllers

import com.pasantia.pasantia.dto.CreateCompanyTutorDTO
import com.pasantia.pasantia.dto.CreateVacancyDTO
import com.pasantia.pasantia.dto.application.ApplicationDTO
import com.pasantia.pasantia.dto.application.UpdateApplicationStatusDTO
import com.pasantia.pasantia.services.ApplicationService
import com.pasantia.pasantia.services.CompanyTutorService
import com.pasantia.pasantia.services.VacancyService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.security.Principal
import java.util.*

@RestController
@RequestMapping("/company-admin")
class CompanyAdminController(
    private val vacancyService: VacancyService,
    private val companyTutorService: CompanyTutorService,
    private val applicationService: ApplicationService

) {

    // =============================
    //        VACANTES
    // =============================

    @PostMapping("/vacancies")
    fun createVacancy(
        @RequestBody dto: CreateVacancyDTO,
        principal: Principal
    ): ResponseEntity<Any> {
        val result = vacancyService.createVacancyForCompanyAdmin(
            currentUserEmail = principal.name,
            dto = dto
        )
        return ResponseEntity.ok(result)
    }

    @GetMapping("/vacancies")
    fun listMyVacancies(
        principal: Principal
    ): ResponseEntity<Any> {
        val result = vacancyService.listVacanciesForCompanyAdmin(principal.name)
        return ResponseEntity.ok(result)
    }

    // =============================
    //  TUTORES DE EMPRESA
    // =============================

    @PostMapping("/tutors")
    fun createCompanyTutor(
        @RequestBody dto: CreateCompanyTutorDTO,
        principal: Principal
    ): ResponseEntity<Any> {
        val result = companyTutorService.createTutorForCompanyAdmin(
            currentUserEmail = principal.name,
            dto = dto
        )
        return ResponseEntity.ok(result)
    }

    @GetMapping("/tutors")
    fun listCompanyTutors(
        principal: Principal
    ): ResponseEntity<Any> {
        val result = companyTutorService.listTutorsForCompanyAdmin(
            currentUserEmail = principal.name
        )
        return ResponseEntity.ok(result)
    }

    @GetMapping("/assignments")
    fun listAssignments(
        principal: Principal
    ): ResponseEntity<List<ApplicationDTO>> {
        val result = applicationService.listForCompanyAdmin(principal.name)
        return ResponseEntity.ok(result)
    }

    @GetMapping("/assignments/{id}")
    fun getAssignment(
        @PathVariable id: UUID,
        principal: Principal
    ): ResponseEntity<ApplicationDTO> {
        val result = applicationService.getForCompanyAdmin(principal.name, id)
        return ResponseEntity.ok(result)
    }

    @PostMapping("/assignments/{id}/approve")
    fun approveAssignment(
        @PathVariable id: UUID,
        @RequestBody(required = false) dto: UpdateApplicationStatusDTO?,
        principal: Principal
    ): ResponseEntity<ApplicationDTO> {
        val result = applicationService.approveApplication(principal.name, id, dto)
        return ResponseEntity.ok(result)
    }

    @PostMapping("/assignments/{id}/reject")
    fun rejectAssignment(
        @PathVariable id: UUID,
        @RequestBody(required = false) dto: UpdateApplicationStatusDTO?,
        principal: Principal
    ): ResponseEntity<ApplicationDTO> {
        val result = applicationService.rejectApplication(principal.name, id, dto)
        return ResponseEntity.ok(result)
    }
}
