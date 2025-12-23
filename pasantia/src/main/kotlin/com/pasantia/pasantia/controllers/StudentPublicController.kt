package com.pasantia.pasantia.controllers

import com.pasantia.pasantia.dto.student.StudentBasicDTO
import com.pasantia.pasantia.mappers.StudentMapper
import com.pasantia.pasantia.repositories.StudentRepository
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.*

@RestController
@RequestMapping("/students")
class StudentPublicController(
    private val studentRepository: StudentRepository
) {

    @GetMapping
    fun listAll(): List<StudentBasicDTO> =
        studentRepository.findAllByActiveTrue()
            .map { StudentMapper.toBasicDTO(it) }

    @GetMapping("/by-specialty/{specialtyId}")
    fun listBySpecialty(
        @PathVariable specialtyId: UUID
    ): List<StudentBasicDTO> =
        studentRepository.findAllBySpecialtyIdAndActiveTrue(specialtyId)
            .map { StudentMapper.toBasicDTO(it) }

}
