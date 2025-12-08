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

    /** CREATE */
    @PostMapping("/{schoolId}")
    fun create(
        @PathVariable schoolId: UUID,
        @RequestBody dto: CreateSchoolTutorDTO
    ) = ResponseEntity.ok(service.create(schoolId, dto))

    /** LIST */
    @GetMapping
    fun list() = ResponseEntity.ok(service.list())

    @GetMapping("/school/{schoolId}")
    fun listBySchool(@PathVariable schoolId: UUID) =
        ResponseEntity.ok(service.listBySchool(schoolId))

    /** GET ONE */
    @GetMapping("/{id}")
    fun get(@PathVariable id: UUID) =
        ResponseEntity.ok(service.get(id))

    /** UPDATE */
    @PutMapping("/{id}")
    fun update(
        @PathVariable id: UUID,
        @RequestBody dto: UpdateSchoolTutorDTO
    ) = ResponseEntity.ok(service.update(id, dto))

    /** DELETE (soft) */
    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: UUID): ResponseEntity<Void> {
        service.softDelete(id)
        return ResponseEntity.noContent().build()
    }

    /** RESTORE */
    @PatchMapping("/{id}/restore")
    fun restore(@PathVariable id: UUID) =
        ResponseEntity.ok(service.restore(id))


}
