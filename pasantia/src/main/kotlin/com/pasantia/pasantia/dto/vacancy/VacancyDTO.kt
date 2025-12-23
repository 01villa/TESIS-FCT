package com.pasantia.pasantia.dto.vacancy

import java.time.LocalDate
import java.time.LocalDateTime
import java.util.UUID

data class VacancyDTO(
    val id: UUID,
    val companyId: UUID,
    val specialtyId: UUID,        // 👈 NUEVO
    val specialtyName: String,    // 👈 NUEVO
    val title: String,
    val description: String?,
    val requirements: List<String>?,
    val capacity: Int,
    val startDate: LocalDate,
    val endDate: LocalDate,
    val status: Short,
    val active: Boolean,
    val deletedAt: LocalDateTime?,
    val createdAt: LocalDateTime?,
    val updatedAt: LocalDateTime?
)
