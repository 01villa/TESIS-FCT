package com.pasantia.pasantia.mappers

import com.pasantia.pasantia.dto.student.StudentDTO
import com.pasantia.pasantia.entities.Student

object StudentMapper {

    fun toDTO(student: Student): StudentDTO =
        StudentDTO(
            id = student.id,
            firstName = student.firstName,
            lastName = student.lastName,
            fullName = student.fullName,
            ci = student.ci,
            email = student.email,
            phone = student.phone,
            status = student.status,
            schoolId = student.school.id!!
        )
}
