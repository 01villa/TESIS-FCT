package com.pasantia.pasantia.controllers

import com.pasantia.pasantia.dto.admin.CreateAdminForEntityDTO
import com.pasantia.pasantia.dto.company.UpdateCompanyDTO
import com.pasantia.pasantia.dto.admin.CreateCompanyDTO
import com.pasantia.pasantia.dto.company.companyadmin.CompanyAdminDTO
import com.pasantia.pasantia.services.CompanyAdminService
import com.pasantia.pasantia.services.CompanyService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import java.util.*

@RestController
@RequestMapping("/admin/companies")
class CompanyController(
    private val companyService: CompanyService,
    private val companyAdminService: CompanyAdminService
) {

    /** =======================================
     * CREATE
     * ======================================= */
    @PostMapping
    fun create(@RequestBody dto: CreateCompanyDTO) =
        ResponseEntity.ok(companyService.create(dto))

    /** =======================================
     * LIST (ONLY ACTIVE)
     * ======================================= */
    @GetMapping
    fun list() =
        ResponseEntity.ok(companyService.list())

    /** =======================================
     * GET BY ID
     * ======================================= */
    @GetMapping("/{id}")
    fun get(@PathVariable id: UUID) =
        ResponseEntity.ok(companyService.get(id))

    /** =======================================
     * UPDATE
     * ======================================= */
    @PutMapping("/{id}")
    fun update(
        @PathVariable id: UUID,
        @RequestBody dto: UpdateCompanyDTO
    ) = ResponseEntity.ok(companyService.update(id, dto))

    /** =======================================
     * SOFT DELETE
     * ======================================= */
    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: UUID): ResponseEntity<Void> {
        companyService.softDelete(id)
        return ResponseEntity.noContent().build()
    }

    /** =======================================
     * RESTORE
     * ======================================= */
    @PatchMapping("/{id}/restore")
    fun restore(@PathVariable id: UUID) =
        ResponseEntity.ok(companyService.restore(id))
    @PostMapping("/{id}/admin")
    fun createCompanyAdmin(
        @PathVariable id: UUID,
        @RequestBody dto: CreateAdminForEntityDTO
    ): ResponseEntity<CompanyAdminDTO> {
        val result = companyAdminService.createCompanyAdmin(id, dto)
        return ResponseEntity.ok(result)
    }

    @PatchMapping("/{id}/logo")
    fun uploadCompanyLogo(
        @PathVariable id: UUID,
        @RequestParam("file") file: MultipartFile
    ): ResponseEntity<Void> {
        companyService.updateLogo(id, file)
        return ResponseEntity.noContent().build()
    }

    @PatchMapping("/{id}/logo/remove")
    fun removeLogo(@PathVariable id: UUID) {
        companyService.removeLogo(id)
    }


}
