package com.pasantia.pasantia.mappers

import com.pasantia.pasantia.dto.school.SchoolDTO
import com.pasantia.pasantia.entities.School

object SchoolMapper {

    fun toDTO(school: School) = SchoolDTO(
        id = school.id,
        name = school.name,
        address = school.address,
        active = school.active,
        deletedAt = school.deletedAt,
        createdAt = school.createdAt,
        updatedAt = school.updatedAt,
        photoUrl = school.logoUrl,
        publicUrl = school.publicUrl
    )
}
