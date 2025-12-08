package com.pasantia.pasantia.dto.application

import java.time.LocalDateTime
import java.util.UUID

data class ApplicationDTO(
    val id: UUID,
    val vacancyId: UUID,
    val vacancyTitle: String,
    val companyId: UUID,
    val companyName: String,

    val studentId: UUID,
    val studentFullName: String,

    // ⭐ NUEVOS CAMPOS
    val studentCi: String?,
    val studentPhone: String?,
    val studentEmail: String?,

    val schoolTutorId: UUID,
    val schoolTutorName: String,

    val companyTutorId: UUID?,
    val companyTutorName: String?,

    val status: Short,
    val notes: String?,
    val active: Boolean,
    val appliedAt: LocalDateTime?,
    val updatedAt: LocalDateTime?
)
