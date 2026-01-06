package com.pasantia.pasantia.dto.school.schoolAdmin

import java.time.LocalDateTime
import java.util.UUID

data class SchoolAdminDTO(
    val id: UUID,
    val userId: UUID,
    val schoolId: UUID,
    val fullName: String,
    val email: String,
    val photoUrl: String?,
    val active: Boolean,
    val deletedAt: LocalDateTime?,
    val createdAt: LocalDateTime?,
    val updatedAt: LocalDateTime?
)
