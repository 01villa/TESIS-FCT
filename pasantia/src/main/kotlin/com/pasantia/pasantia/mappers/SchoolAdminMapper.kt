package com.pasantia.pasantia.mappers

import com.pasantia.pasantia.dto.school.schoolAdmin.SchoolAdminDTO
import com.pasantia.pasantia.entities.SchoolAdmin

object SchoolAdminMapper {

    fun toDTO(admin: SchoolAdmin) = SchoolAdminDTO(
        id = admin.id,
        userId = admin.user.id!!,
        schoolId = admin.school.id,
        fullName = admin.user.fullName,
        email = admin.user.email,
        photoUrl = admin.user.photoUrl,
        active = admin.active,
        deletedAt = admin.deletedAt,
        createdAt = admin.createdAt,
        updatedAt = admin.updatedAt
    )
}
