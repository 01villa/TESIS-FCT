package com.pasantia.pasantia.controllers

import com.pasantia.pasantia.dto.school.schoolTutor.CreateSchoolTutorDTO
import com.pasantia.pasantia.dto.school.schoolTutor.UpdateSchoolTutorDTO
import com.pasantia.pasantia.services.SchoolTutorService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("/admin/school-tutors")
class SchoolTutorController(
    private val service: SchoolTutorService
) {

    // =========================
    // CREATE
    // POST /admin/school-tutors/{schoolId}
    // =========================
    @PostMapping("/{schoolId}")
    fun create(
        @PathVariable schoolId: UUID,
        @RequestBody dto: CreateSchoolTutorDTO
    ) = ResponseEntity.ok(service.create(schoolId, dto))

    // =========================
    // LIST
    // GET /admin/school-tutors
    // =========================
    @GetMapping
    fun list() = ResponseEntity.ok(service.list())

    @GetMapping("/school/{schoolId}")
    fun listBySchool(@PathVariable schoolId: UUID) =
        ResponseEntity.ok(service.listBySchool(schoolId))

    // =========================
    // GET ONE
    // GET /admin/school-tutors/{id}
    // =========================
    @GetMapping("/{id}")
    fun get(@PathVariable id: UUID) =
        ResponseEntity.ok(service.get(id))

    // =========================
    // UPDATE
    // PUT /admin/school-tutors/{id}
    // =========================
    @PutMapping("/{id}")
    fun update(
        @PathVariable id: UUID,
        @RequestBody dto: UpdateSchoolTutorDTO
    ) = ResponseEntity.ok(service.update(id, dto))

    // =========================
    // DELETE (SOFT DELETE REAL)
    // DELETE /admin/school-tutors/{id}
    // =========================
    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: UUID): ResponseEntity<Void> {
        service.delete(id)
        return ResponseEntity.noContent().build()
    }

    // =========================
    // RESTORE
    // PATCH /admin/school-tutors/{id}/restore
    // =========================
    @PatchMapping("/{id}/restore")
    fun restore(@PathVariable id: UUID): ResponseEntity<Void> {
        service.restore(id)
        return ResponseEntity.noContent().build()
    }
}
