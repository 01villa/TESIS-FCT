package com.pasantia.pasantia.controllers

import com.pasantia.pasantia.dto.specialty.SpecialtyRequest
import com.pasantia.pasantia.dto.specialty.SpecialtyResponse
import com.pasantia.pasantia.services.SpecialtyService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/specialties")
class SpecialtyController(
    private val specialtyService: SpecialtyService
) {

    @GetMapping
    fun getAll(): List<SpecialtyResponse> =
        specialtyService.getAllActive()

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(
        @Valid @RequestBody request: SpecialtyRequest
    ): SpecialtyResponse =
        specialtyService.create(request)

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deactivate(
        @PathVariable id: UUID
    ) {
        specialtyService.deactivate(id)
    }
}
