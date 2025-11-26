package com.pasantia.pasantia.controllers

import com.pasantia.pasantia.dto.application.ApplicationDTO
import com.pasantia.pasantia.dto.application.CreateAssignmentDTO
import com.pasantia.pasantia.services.ApplicationService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.security.Principal

@RestController
@RequestMapping("/school-tutor")
class SchoolTutorAssignmentsController(
    private val applicationService: ApplicationService
) {

    @PostMapping("/assignments")
    fun assignStudent(
        @RequestBody dto: CreateAssignmentDTO,
        principal: Principal
    ): ResponseEntity<ApplicationDTO> {
        println("🔥 Controller: llegó la solicitud de asignación del tutor ${principal.name}")

        val result = applicationService.assignStudentToVacancy(principal.name, dto)
        return ResponseEntity.ok(result)
    }

    @GetMapping("/assignments")
    fun listAssignments(
        principal: Principal
    ): ResponseEntity<List<ApplicationDTO>> {
        val result = applicationService.listForSchoolTutor(principal.name)
        return ResponseEntity.ok(result)
    }
}
