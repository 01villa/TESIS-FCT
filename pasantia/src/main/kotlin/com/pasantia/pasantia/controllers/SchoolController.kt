package com.pasantia.pasantia.controllers

import com.pasantia.pasantia.dto.admin.CreateAdminForEntityDTO
import com.pasantia.pasantia.dto.admin.CreateSchoolDTO
import com.pasantia.pasantia.dto.school.UpdateSchoolDTO
import com.pasantia.pasantia.dto.school.schoolAdmin.SchoolAdminDTO
import com.pasantia.pasantia.services.SchoolAdminService
import com.pasantia.pasantia.services.SchoolService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import java.util.*

@RestController
@RequestMapping("/admin/schools")
class SchoolController(
    private val schoolService: SchoolService,

    private val schoolAdminService: SchoolAdminService

) {

    /** =======================================
     * CREATE
     * ======================================= */
    @PostMapping
    fun create(@RequestBody dto: CreateSchoolDTO) =
        ResponseEntity.ok(schoolService.create(dto))

    /** =======================================
     * LIST (ONLY ACTIVE)
     * ======================================= */
    @GetMapping
    fun list() =
        ResponseEntity.ok(schoolService.list())

    /** =======================================
     * GET BY ID
     * ======================================= */
    @GetMapping("/{id}")
    fun get(@PathVariable id: UUID) =
        ResponseEntity.ok(schoolService.get(id))

    /** =======================================
     * UPDATE
     * ======================================= */
    @PutMapping("/{id}")
    fun update(
        @PathVariable id: UUID,
        @RequestBody dto: UpdateSchoolDTO
    ) = ResponseEntity.ok(schoolService.update(id, dto))

    /** =======================================
     * SOFT DELETE
     * ======================================= */
    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: UUID): ResponseEntity<Void> {
        schoolService.softDelete(id)
        return ResponseEntity.noContent().build()
    }

    /** =======================================
     * RESTORE
     * ======================================= */
    @PatchMapping("/{id}/restore")
    fun restore(@PathVariable id: UUID) =
        ResponseEntity.ok(schoolService.restore(id))


    @PostMapping("/{id}/admin")
    fun createSchoolAdmin(
        @PathVariable id: UUID,
        @RequestBody dto: CreateAdminForEntityDTO
    ): ResponseEntity<SchoolAdminDTO> {
        val result = schoolAdminService.createSchoolAdmin(id, dto)
        return ResponseEntity.ok(result)
    }

    @PatchMapping("/{id}/logo")
    fun uploadSchoolLogo(
        @PathVariable id: UUID,
        @RequestParam("file") file: MultipartFile
    ): ResponseEntity<Void> {
        schoolService.updateLogo(id, file)
        return ResponseEntity.noContent().build()
    }

    @PatchMapping("/{id}/logo/remove")
    fun removeLogo(@PathVariable id: UUID): ResponseEntity<Void> {
        schoolService.removeLogo(id)
        return ResponseEntity.noContent().build()
    }
}
