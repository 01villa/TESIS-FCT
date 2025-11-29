package com.pasantia.pasantia.controllers

import com.pasantia.pasantia.dto.vacancy.VacancyDTO
import com.pasantia.pasantia.services.VacancyService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/student/vacancies")
class StudentVacancyController(
    private val vacancyService: VacancyService
) {

    @GetMapping
    fun listAvailable(): ResponseEntity<List<VacancyDTO>> {
        val vacancies = vacancyService.listAvailableForStudents()
        return ResponseEntity.ok(vacancies)
    }
}
