package com.pasantia.pasantia.dto.student

import java.util.UUID

data class CreateStudentDTO(
    val firstName: String,
    val lastName: String,
    val ci: String,
    val email: String,
    val password: String,
    val phone: String?,
    val specialtyId: UUID
)
