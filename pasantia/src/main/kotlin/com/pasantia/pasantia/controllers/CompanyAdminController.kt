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

    @GetMapping
    fun list() = ResponseEntity.ok(service.list())

    @GetMapping("/company/{companyId}")
    fun listByCompany(@PathVariable companyId: UUID) =
        ResponseEntity.ok(service.listByCompany(companyId))

    @GetMapping("/{id}")
    fun get(@PathVariable id: UUID) =
        ResponseEntity.ok(service.get(id))

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: UUID): ResponseEntity<Void> {
        service.softDelete(id)
        return ResponseEntity.noContent().build()
    }

    @PatchMapping("/{id}/restore")
    fun restore(@PathVariable id: UUID) =
        ResponseEntity.ok(service.restore(id))
}
