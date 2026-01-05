package com.pasantia.pasantia.mappers

import com.pasantia.pasantia.dto.school.schoolTutor.SchoolTutorDTO
import com.pasantia.pasantia.entities.SchoolTutor

object SchoolTutorMapper {

    fun toDTO(tutor: SchoolTutor) = SchoolTutorDTO(
        id = tutor.id,
        schoolId = tutor.school.id,
        userId = tutor.user.id!!,
        fullName = tutor.user.fullName,
        email = tutor.user.email,
        phone = tutor.phone,
        active = tutor.active,
        deletedAt = tutor.deletedAt,
        createdAt = tutor.createdAt,
        updatedAt = tutor.updatedAt
    )
}
