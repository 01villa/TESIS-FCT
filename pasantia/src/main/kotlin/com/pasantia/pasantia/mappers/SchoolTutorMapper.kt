package com.pasantia.pasantia.mappers

import com.pasantia.pasantia.dto.SchoolTutorDTO
import com.pasantia.pasantia.entities.SchoolTutor

object SchoolTutorMapper {
    fun toDTO(entity: SchoolTutor) = SchoolTutorDTO(
        id = entity.id,
        schoolId = entity.school.id!!,
        schoolName = entity.school.name,
        fullName = entity.user.fullName,
        email = entity.user.email,
        phone = entity.phone
    )
}
