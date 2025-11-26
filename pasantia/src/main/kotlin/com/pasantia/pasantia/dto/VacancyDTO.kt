package com.pasantia.pasantia.dto

import java.time.LocalDate
import java.time.LocalDateTime
import java.util.*

data class VacancyDTO(
    val id: UUID,
    val companyId: UUID,
    val title: String,
    val description: String?,
    val requirements: List<String>?,
    val capacity: Int,
    val startDate: LocalDate,
    val endDate: LocalDate,
    val status: Short,
    val createdAt: LocalDateTime?
)
