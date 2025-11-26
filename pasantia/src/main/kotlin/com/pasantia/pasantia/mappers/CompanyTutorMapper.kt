package com.pasantia.pasantia.mappers

import com.pasantia.pasantia.dto.CompanyTutorDTO
import com.pasantia.pasantia.entities.CompanyTutor

object CompanyTutorMapper {

    fun toDTO(entity: CompanyTutor): CompanyTutorDTO =
        CompanyTutorDTO(
            id = entity.id.toString(),
            fullName = entity.user.fullName,
            email = entity.user.email,
            phone = entity.phone,
            companyId = entity.company.id.toString(),
            userId = entity.user.id.toString()
        )
}
