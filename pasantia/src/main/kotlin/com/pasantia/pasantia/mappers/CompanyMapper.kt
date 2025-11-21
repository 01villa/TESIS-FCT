package com.pasantia.pasantia.mappers

import com.pasantia.pasantia.dto.CompanyDTO
import com.pasantia.pasantia.entities.Company

object CompanyMapper {

    fun toDTO(entity: Company) = CompanyDTO(
        id = entity.id,
        name = entity.name,
        address = entity.address,
        createdBy = entity.createdBy,
        createdAt = entity.createdAt
    )
}
