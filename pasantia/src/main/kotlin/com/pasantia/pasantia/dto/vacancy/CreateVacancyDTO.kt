package com.pasantia.pasantia.dto.vacancy

import java.time.LocalDate

data class CreateVacancyDTO(
    val title: String,
    val description: String?,
    val requirements: List<String>?,
    val capacity: Int,
    val startDate: LocalDate,
    val endDate: LocalDate,
    val status: Short = 1 // 1 = abierta
)
