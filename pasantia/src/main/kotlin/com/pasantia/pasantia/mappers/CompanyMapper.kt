package com.pasantia.pasantia.mappers

import com.pasantia.pasantia.dto.company.CompanyDTO
import com.pasantia.pasantia.entities.Company

object CompanyMapper {
    fun toDTO(company: Company) = CompanyDTO(
        id = company.id,
        name = company.name,
        address = company.address,
        active = company.active,
        deletedAt = company.deletedAt,
        createdAt = company.createdAt,
        updatedAt = company.updatedAt,
        photoUrl = company.logoUrl,
        publicUrl = company.publicUrl

    )
}
