package com.pasantia.pasantia.mappers

import com.pasantia.pasantia.dto.company.companyadmin.CompanyAdminDTO
import com.pasantia.pasantia.entities.CompanyAdmin


object CompanyAdminMapper {

    fun toDTO(admin: CompanyAdmin) = CompanyAdminDTO(
        id = admin.id,
        companyId = admin.company.id,
        userId = admin.user.id!!,
        fullName = admin.user.fullName,
        email = admin.user.email,
        active = admin.active,
        deletedAt = admin.deletedAt,
        createdAt = admin.createdAt,
        updatedAt = admin.updatedAt
    )
}
