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

    // =========================
    // CREATE
    // POST /admin/company-tutors/{companyId}
    // =========================
    @PostMapping("/{companyId}")
    fun create(
        @PathVariable companyId: UUID,
        @RequestBody dto: CreateCompanyTutorDTO
    ) = ResponseEntity.ok(service.create(companyId, dto))

    // =========================
    // LIST
    // GET /admin/company-tutors
    // =========================
    @GetMapping
    fun list() = ResponseEntity.ok(service.list())

    @GetMapping("/company/{companyId}")
    fun listByCompany(@PathVariable companyId: UUID) =
        ResponseEntity.ok(service.listByCompany(companyId))

    // =========================
    // GET ONE
    // GET /admin/company-tutors/{id}
    // =========================
    @GetMapping("/{id}")
    fun get(@PathVariable id: UUID) =
        ResponseEntity.ok(service.get(id))

    // =========================
    // UPDATE
    // PUT /admin/company-tutors/{id}
    // =========================
    @PutMapping("/{id}")
    fun update(
        @PathVariable id: UUID,
        @RequestBody dto: UpdateCompanyTutorDTO
    ) = ResponseEntity.ok(service.update(id, dto))

    // =========================
    // DELETE (SOFT DELETE REAL)
    // DELETE /admin/company-tutors/{id}
    // =========================
    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: UUID): ResponseEntity<Void> {
        service.delete(id)
        return ResponseEntity.noContent().build()
    }

    // =========================
    // RESTORE
    // PATCH /admin/company-tutors/{id}/restore
    // =========================
    @PatchMapping("/{id}/restore")
    fun restore(@PathVariable id: UUID): ResponseEntity<Void> {
        service.restore(id)
        return ResponseEntity.noContent().build()
    }
}
