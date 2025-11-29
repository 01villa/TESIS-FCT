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

    @GetMapping
    fun list() = ResponseEntity.ok(service.list())

    @GetMapping("/school/{schoolId}")
    fun listBySchool(@PathVariable schoolId: UUID) =
        ResponseEntity.ok(service.listBySchool(schoolId))

    @GetMapping("/{id}")
    fun get(@PathVariable id: UUID) =
        ResponseEntity.ok(service.get(id))

    @DeleteMapping("/{id}")
    fun softDelete(@PathVariable id: UUID): ResponseEntity<Void> {
        service.softDelete(id)
        return ResponseEntity.noContent().build()
    }

    @PatchMapping("/{id}/restore")
    fun restore(@PathVariable id: UUID) =
        ResponseEntity.ok(service.restore(id))
}
