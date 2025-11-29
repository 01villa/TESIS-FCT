package com.pasantia.pasantia.mappers

import com.pasantia.pasantia.dto.student.StudentDTO
import com.pasantia.pasantia.entities.Student

object StudentMapper {
    fun toDTO(s: Student) = StudentDTO(
        id = s.id,
        schoolId = s.school.id,
        userId = s.user.id!!,
        fullName = s.fullName,
        ci = s.ci,
        phone = s.phone,
        active = s.active,
        deletedAt = s.deletedAt,
        createdAt = s.createdAt,
        updatedAt = s.updatedAt
    )
}
