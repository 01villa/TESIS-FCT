package com.pasantia.pasantia.dto.student

import java.util.UUID

data class StudentBasicDTO(
    val id: UUID,
    val fullName: String,
    val ci: String,
    val phone: String?,
    val userId: UUID,
    val specialtyId: UUID,
    val specialtyName: String
)
