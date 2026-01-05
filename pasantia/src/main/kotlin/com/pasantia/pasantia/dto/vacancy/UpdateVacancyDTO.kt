package com.pasantia.pasantia.dto.vacancy

import java.time.LocalDate
import java.util.UUID

data class UpdateVacancyDTO(
    val title: String?,
    val description: String?,
    val requirements: List<String>?,
    val capacity: Int?,
    val startDate: LocalDate?,
    val endDate: LocalDate?,
    val status: Short?,
    val specialtyId: UUID?   // 👈 NUEVO
)
