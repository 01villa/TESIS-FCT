package com.pasantia.pasantia.dto.company

import java.time.LocalDateTime
import java.util.*

data class CompanyDTO(
    val id: UUID,
    val name: String,
    val address: String?,
    val active: Boolean,
    val deletedAt: LocalDateTime?,
    val createdAt: LocalDateTime?,
    val updatedAt: LocalDateTime?,
    val photoUrl: String?

)
