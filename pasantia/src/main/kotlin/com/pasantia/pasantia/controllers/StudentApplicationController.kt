package com.pasantia.pasantia.controllers

import com.pasantia.pasantia.dto.application.ApplicationDTO
import com.pasantia.pasantia.services.ApplicationService
import com.pasantia.pasantia.repositories.StudentRepository
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.security.Principal
import java.util.*

@RestController
@RequestMapping("/student/applications")
class StudentApplicationController(
    private val applicationService: ApplicationService,
    private val studentRepository: StudentRepository
) {

    @GetMapping
    fun listStudentApplications(principal: Principal): ResponseEntity<List<ApplicationDTO>> {

        // obtener student por usuario autenticado
        val student = studentRepository.findByUserEmailAndActiveTrue(principal.name)
            ?: throw IllegalArgumentException("Student not found")

        val apps = applicationService.listForStudent(student.id)

        return ResponseEntity.ok(apps)
    }
}
