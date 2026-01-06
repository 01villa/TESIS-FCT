package com.pasantia.pasantia.mappers

import com.pasantia.pasantia.dto.company.companytutor.CompanyTutorDTO
import com.pasantia.pasantia.entities.CompanyTutor

object CompanyTutorMapper {

    fun toDTO(tutor: CompanyTutor) = CompanyTutorDTO(
        id = tutor.id,
        companyId = tutor.company.id,
        userId = tutor.user.id!!,
        fullName = tutor.user.fullName,
        email = tutor.user.email,
        photoUrl = tutor.user.photoUrl,
        phone = tutor.phone,
        active = tutor.active,
        deletedAt = tutor.deletedAt,
        createdAt = tutor.createdAt,
        updatedAt = tutor.updatedAt
    )
}

