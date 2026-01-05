package com.pasantia.pasantia.controllers

import com.pasantia.pasantia.services.SchoolAdminService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.*
@RestController
@RequestMapping("/admin/school-admins")
class SchoolAdminController(
    private val service: SchoolAdminService
) {

    // =========================
    // LIST
    // GET /admin/school-admins
    // =========================
    @GetMapping
    fun list() = ResponseEntity.ok(service.list())

    @GetMapping("/school/{schoolId}")
    fun listBySchool(@PathVariable schoolId: UUID) =
        ResponseEntity.ok(service.listBySchool(schoolId))

    // =========================
    // GET ONE
    // GET /admin/school-admins/{id}
    // =========================
    @GetMapping("/{id}")
    fun get(@PathVariable id: UUID) =
        ResponseEntity.ok(service.get(id))

    // =========================
    // DELETE (SOFT DELETE REAL)
    // DELETE /admin/school-admins/{id}
    // =========================
    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: UUID): ResponseEntity<Void> {
        service.delete(id)
        return ResponseEntity.noContent().build()
    }

    // =========================
    // RESTORE
    // PATCH /admin/school-admins/{id}/restore
    // =========================
    @PatchMapping("/{id}/restore")
    fun restore(@PathVariable id: UUID): ResponseEntity<Void> {
        service.restore(id)
        return ResponseEntity.noContent().build()
    }
}
