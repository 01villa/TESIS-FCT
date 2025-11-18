package com.pasantia.pasantia.mappers

import com.pasantia.pasantia.dto.SchoolDTO
import com.pasantia.pasantia.entities.School

fun School.toDTO(): SchoolDTO =
    SchoolDTO(
        id = id,
        name = name,
        address = address,
        createdBy = createdBy.id!!,
        createdAt = createdAt
    )
