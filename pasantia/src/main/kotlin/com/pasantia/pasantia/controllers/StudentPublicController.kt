package com.pasantia.pasantia.controllers

import com.pasantia.pasantia.dto.student.StudentBasicDTO
import com.pasantia.pasantia.repositories.StudentRepository
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/students")
class StudentPublicController(
    private val studentRepository: StudentRepository
) {

    @GetMapping
    fun listAll(): List<StudentBasicDTO> =
        studentRepository.findAllByActiveTrue().map {
            StudentBasicDTO(
                id = it.id!!,
                fullName = it.fullName,
                ci = it.ci,
                phone = it.phone,
                userId = it.user!!.id!!
            )
        }
}