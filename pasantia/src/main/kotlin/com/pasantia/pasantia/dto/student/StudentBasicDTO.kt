package com.pasantia.pasantia.dto.student

import java.util.*

data class StudentBasicDTO(
    val id: UUID,
    val fullName: String,
    val ci: String,
    val phone: String?,
    val userId: UUID
)