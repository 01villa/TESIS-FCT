package com.pasantia.pasantia.dto.school

import java.time.LocalDateTime
import java.util.UUID

data class SchoolDTO(
    val id: UUID,
    val name: String,
    val address: String?,
    val active: Boolean,
    val deletedAt: LocalDateTime?,
    val createdAt: LocalDateTime?,
    val updatedAt: LocalDateTime?,
    val photoUrl: String?

)
