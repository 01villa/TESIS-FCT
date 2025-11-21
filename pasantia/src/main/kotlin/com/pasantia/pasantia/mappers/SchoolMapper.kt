package com.pasantia.pasantia.mappers

import com.pasantia.pasantia.dto.SchoolDTO
import com.pasantia.pasantia.entities.School

object SchoolMapper {

    fun toDTO(entity: School) = SchoolDTO(
        id = entity.id,
        name = entity.name,
        address = entity.address,
        createdBy = entity.createdBy,
        createdAt = entity.createdAt
    )
}
