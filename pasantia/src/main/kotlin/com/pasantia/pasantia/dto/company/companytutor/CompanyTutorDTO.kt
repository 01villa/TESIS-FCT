package com.pasantia.pasantia.dto.company.companytutor

import java.time.LocalDateTime
import java.util.*

data class CompanyTutorDTO(
    val id: UUID,
    val companyId: UUID,
    val userId: UUID,
    val fullName: String,
    val email: String,
    val phone: String?,
    val active: Boolean,
    val deletedAt: LocalDateTime?,
    val createdAt: LocalDateTime?,
    val updatedAt: LocalDateTime?
)
