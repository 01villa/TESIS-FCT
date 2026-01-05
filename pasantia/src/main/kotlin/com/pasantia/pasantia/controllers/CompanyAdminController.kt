package com.pasantia.pasantia.controllers


import com.pasantia.pasantia.services.CompanyAdminService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("/admin/company-admins")
class CompanyAdminController(
    private val service: CompanyAdminService
) {

    // =========================
    // LIST
    // GET /admin/company-admins
    // =========================
    @GetMapping
    fun list() = ResponseEntity.ok(service.list())

    @GetMapping("/company/{companyId}")
    fun listByCompany(@PathVariable companyId: UUID) =
        ResponseEntity.ok(service.listByCompany(companyId))

    // =========================
    // GET ONE
    // GET /admin/company-admins/{id}
    // =========================
    @GetMapping("/{id}")
    fun get(@PathVariable id: UUID) =
        ResponseEntity.ok(service.get(id))

    // =========================
    // DELETE (SOFT DELETE REAL)
    // DELETE /admin/company-admins/{id}
    // =========================
    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: UUID): ResponseEntity<Void> {
        service.delete(id)
        return ResponseEntity.noContent().build()
    }

    // =========================
    // RESTORE
    // PATCH /admin/company-admins/{id}/restore
    // =========================
    @PatchMapping("/{id}/restore")
    fun restore(@PathVariable id: UUID): ResponseEntity<Void> {
        service.restore(id)
        return ResponseEntity.noContent().build()
    }
}
