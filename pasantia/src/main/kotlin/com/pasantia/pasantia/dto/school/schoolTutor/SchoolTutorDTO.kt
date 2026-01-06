package com.pasantia.pasantia.dto.school.schoolTutor

import java.time.LocalDateTime
import java.util.UUID

data class SchoolTutorDTO(
    val id: UUID,
    val schoolId: UUID,
    val userId: UUID,
    val fullName: String,
    val email: String,
    val photoUrl: String?,
    val phone: String?,
    val active: Boolean,
    val deletedAt: LocalDateTime?,
    val createdAt: LocalDateTime?,
    val updatedAt: LocalDateTime?
)
