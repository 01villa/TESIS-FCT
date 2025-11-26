package com.pasantia.pasantia.dto.student

import java.util.UUID

data class StudentDTO(
    val id: UUID,
    val firstName: String,
    val lastName: String,
    val fullName: String,
    val ci: String,
    val email: String,
    val phone: String?,
    val status: Short,
    val schoolId: UUID
)
