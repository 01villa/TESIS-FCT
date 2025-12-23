package com.pasantia.pasantia.dto.vacancy

import java.time.LocalDate
import java.util.UUID

data class CreateVacancyDTO(
    val title: String,
    val description: String?,
    val requirements: List<String>?,
    val capacity: Int,
    val startDate: LocalDate,
    val endDate: LocalDate,
    val specialtyId: UUID,   // 👈 NUEVO
    val status: Short = 1    // 1 = abierta
)
