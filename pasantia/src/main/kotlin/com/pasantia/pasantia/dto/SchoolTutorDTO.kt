package com.pasantia.pasantia.dto

import java.util.UUID

data class SchoolTutorDTO(
    val id: UUID,
    val schoolId: UUID,
    val schoolName: String,
    val fullName: String,
    val email: String,
    val phone: String?
)
