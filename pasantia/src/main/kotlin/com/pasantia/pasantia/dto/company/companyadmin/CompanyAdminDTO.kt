package com.pasantia.pasantia.dto.company.companyadmin

import java.time.LocalDateTime
import java.util.*

data class CompanyAdminDTO(
    val id: UUID,
    val companyId: UUID,
    val userId: UUID,
    val fullName: String,
    val email: String,
    val active: Boolean,
    val deletedAt: LocalDateTime?,
    val createdAt: LocalDateTime?,
    val updatedAt: LocalDateTime?
)
