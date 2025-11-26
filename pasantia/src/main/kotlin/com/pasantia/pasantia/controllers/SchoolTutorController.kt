package com.pasantia.pasantia.controllers

import com.pasantia.pasantia.dto.CreateSchoolTutorDTO
import com.pasantia.pasantia.services.SchoolTutorService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.security.Principal

@RestController
@RequestMapping("/school-admin/tutors")
class   SchoolTutorController(
    private val schoolTutorService: SchoolTutorService
) {

    @PostMapping
    fun createTutor(
        principal: Principal,
        @RequestBody dto: CreateSchoolTutorDTO
    ): ResponseEntity<Any> {
        val result = schoolTutorService.createTutor(principal.name, dto)
        return ResponseEntity.ok(result)
    }

    @GetMapping
    fun listTutors(
        principal: Principal
    ): ResponseEntity<Any> {
        val result = schoolTutorService.listTutors(principal.name)
        return ResponseEntity.ok(result)
    }
}
