package com.pasantia.pasantia.controllers

import com.pasantia.pasantia.dto.student.CreateStudentDTO
import com.pasantia.pasantia.dto.student.UpdateStudentDTO
import com.pasantia.pasantia.services.StudentService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.security.Principal
import java.util.UUID

@RestController
@RequestMapping("/school-tutor/students")
class StudentController(
    private val studentService: StudentService
) {

    @PostMapping
    fun create(
        principal: Principal,
        @RequestBody dto: CreateStudentDTO
    ): ResponseEntity<Any> =
        ResponseEntity.ok(studentService.createStudent(principal.name, dto))

    @GetMapping
    fun list(principal: Principal): ResponseEntity<Any> =
        ResponseEntity.ok(studentService.listStudents(principal.name))

    @PutMapping("/{id}")
    fun update(
        principal: Principal,
        @PathVariable id: UUID,
        @RequestBody dto: UpdateStudentDTO
    ): ResponseEntity<Any> =
        ResponseEntity.ok(studentService.updateStudent(principal.name, id, dto))

    @DeleteMapping("/{id}")
    fun delete(
        principal: Principal,
        @PathVariable id: UUID
    ): ResponseEntity<Any> {
        studentService.deleteStudent(principal.name, id)
        return ResponseEntity.noContent().build()
    }
}
