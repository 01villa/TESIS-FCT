package com.pasantia.pasantia.dto

import java.time.LocalDate

data class CreateVacancyDTO(
    val title: String,
    val description: String?,
    val requirements: List<String>?,
    val capacity: Int,
    val startDate: LocalDate,
    val endDate: LocalDate
)
