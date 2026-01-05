package com.pasantia.pasantia.controllers

import com.pasantia.pasantia.dto.application.CreateAssignmentDTO
import com.pasantia.pasantia.services.ApplicationService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.security.Principal
import java.util.*

@RestController
@RequestMapping("/applications")
class ApplicationController(
    private val applicationService: ApplicationService
) {

    // ======================================================
    // 1) Tutor escolar → asignar estudiante a vacante
    // ======================================================
    @PostMapping("/assign")
    fun assignStudent(
        principal: Principal,
        @RequestBody dto: CreateAssignmentDTO
    ) = ResponseEntity.ok(
        applicationService.assignStudentToVacancy(principal.name, dto)
    )

    // ======================================================
    // 2) Tutor escolar → ver todas sus asignaciones
    // ======================================================
    @GetMapping("/school-tutor")
    fun listForSchoolTutor(principal: Principal) =
        ResponseEntity.ok(
            applicationService.listForSchoolTutor(principal.name)
        )

    // ======================================================
    // 3) Tutor empresa → ver todas las asignaciones de SU empresa
    // ======================================================
    @GetMapping("/company-tutor")
    fun listForCompanyTutor(principal: Principal) =
        ResponseEntity.ok(
            applicationService.listForCompanyTutor(principal.name)
        )

    // ======================================================
    // 4) Tutor empresa → aprobar
    // ======================================================
    @PostMapping("/{id}/approve")
    fun approve(
        principal: Principal,
        @PathVariable id: UUID
    ) = ResponseEntity.ok(
        applicationService.approveByCompanyTutor(id, principal.name)
    )

    // ======================================================
    // 5) Tutor empresa → rechazar
    // ======================================================
    @PostMapping("/{id}/reject")
    fun reject(
        principal: Principal,
        @PathVariable id: UUID,
        @RequestBody(required = false) body: Map<String, String>?
    ): ResponseEntity<Any> {

        val notes = body?.get("notes")
        val result = applicationService.rejectByCompanyTutor(id, principal.name, notes)

        return ResponseEntity.ok(result)
    }

    // ======================================================
    // 6) Estudiante → ver sus asignaciones
    // ======================================================
    @GetMapping("/student/{studentId}")
    fun listForStudent(
        @PathVariable studentId: UUID
    ) = ResponseEntity.ok(
        applicationService.listForStudent(studentId)
    )

    // ======================================================
    // 7) Soft delete (ADMIN / cualquier rol autorizado)
    // ======================================================
    @DeleteMapping("/{id}")
    fun softDelete(@PathVariable id: UUID): ResponseEntity<Void> {
        applicationService.softDelete(id)
        return ResponseEntity.noContent().build()
    }

    // ======================================================
    // 8) Restore (ADMIN)
    // ======================================================
    @PatchMapping("/{id}/restore")
    fun restore(@PathVariable id: UUID): ResponseEntity<Void> {
        applicationService.restore(id)
        return ResponseEntity.noContent().build()
    }
}
