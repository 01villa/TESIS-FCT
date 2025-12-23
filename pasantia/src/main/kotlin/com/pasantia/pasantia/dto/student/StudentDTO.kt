package com.pasantia.pasantia.dto.student

import java.time.LocalDateTime
import java.util.UUID

data class StudentDTO(
    val id: UUID,
    val schoolId: UUID,
    val userId: UUID,
    val specialtyId: UUID,
    val specialtyName: String,
    val fullName: String,
    val ci: String,
    val phone: String?,
    val active: Boolean,
    val deletedAt: LocalDateTime?,
    val createdAt: LocalDateTime?,
    val updatedAt: LocalDateTime?
)
