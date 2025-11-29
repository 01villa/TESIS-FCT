package com.pasantia.pasantia.controllers

import com.pasantia.pasantia.dto.company.companytutor.CreateCompanyTutorDTO
import com.pasantia.pasantia.dto.company.companytutor.UpdateCompanyTutorDTO
import com.pasantia.pasantia.services.CompanyTutorService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("/admin/company-tutors")
class CompanyTutorController(
    private val service: CompanyTutorService
) {

    @PostMapping("/{companyId}")
    fun create(
        @PathVariable companyId: UUID,
        @RequestBody dto: CreateCompanyTutorDTO
    ) = ResponseEntity.ok(service.create(companyId, dto))

    @GetMapping
    fun list() = ResponseEntity.ok(service.list())

    @GetMapping("/company/{companyId}")
    fun listByCompany(@PathVariable companyId: UUID) =
        ResponseEntity.ok(service.listByCompany(companyId))

    @GetMapping("/{id}")
    fun get(@PathVariable id: UUID) =
        ResponseEntity.ok(service.get(id))

    @PutMapping("/{id}")
    fun update(
        @PathVariable id: UUID,
        @RequestBody dto: UpdateCompanyTutorDTO
    ) = ResponseEntity.ok(service.update(id, dto))

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: UUID): ResponseEntity<Void> {
        service.softDelete(id)
        return ResponseEntity.noContent().build()
    }

    @PatchMapping("/{id}/restore")
    fun restore(@PathVariable id: UUID) =
        ResponseEntity.ok(service.restore(id))
}
