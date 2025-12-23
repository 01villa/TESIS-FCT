package com.pasantia.pasantia.controllers

import com.pasantia.pasantia.dto.student.CreateStudentDTO
import com.pasantia.pasantia.dto.student.UpdateStudentDTO
import com.pasantia.pasantia.services.StudentService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("/admin/students")
class StudentController(
    private val studentService: StudentService
) {

    // ========================================================
    // CREATE STUDENT
    // POST /admin/students/school/{schoolId}
    // ========================================================
    @PostMapping("/school/{schoolId}")
    fun createStudent(
        @PathVariable schoolId: UUID,
        @RequestBody dto: CreateStudentDTO
    ) = ResponseEntity.ok(studentService.createStudent(schoolId, dto))

    // ========================================================
    // LIST ALL ACTIVE STUDENTS
    // GET /admin/students
    // ========================================================
    @GetMapping
    fun listStudents() =
        ResponseEntity.ok(studentService.listStudents())

    // ========================================================
    // LIST STUDENTS BY SCHOOL
    // GET /admin/students/school/{schoolId}
    // ========================================================
    @GetMapping("/school/{schoolId}")
    fun listBySchool(
        @PathVariable schoolId: UUID
    ) = ResponseEntity.ok(studentService.listBySchool(schoolId))

    // ========================================================
    // GET ONE STUDENT
    // GET /admin/students/{id}
    // ========================================================
    @GetMapping("/{id}")
    fun getStudent(
        @PathVariable id: UUID
    ) = ResponseEntity.ok(studentService.getStudent(id))

    // ========================================================
    // UPDATE STUDENT
    // PUT /admin/students/{id}
    // ========================================================
    @PutMapping("/{id}")
    fun updateStudent(
        @PathVariable id: UUID,
        @RequestBody dto: UpdateStudentDTO
    ) = ResponseEntity.ok(studentService.updateStudent(id, dto))

    // ========================================================
    // DELETE STUDENT (SOFT DELETE REAL)
    // DELETE /admin/students/{id}
    // ========================================================
    @DeleteMapping("/{id}")
    fun deleteStudent(
        @PathVariable id: UUID
    ): ResponseEntity<Void> {
        studentService.deleteStudent(id)
        return ResponseEntity.noContent().build()
    }

    // ========================================================
    // RESTORE STUDENT
    // PATCH /admin/students/{id}/restore
    // ========================================================
    @PatchMapping("/{id}/restore")
    fun restoreStudent(
        @PathVariable id: UUID
    ): ResponseEntity<Void> {
        studentService.restore(id)
        return ResponseEntity.noContent().build()
    }
}
