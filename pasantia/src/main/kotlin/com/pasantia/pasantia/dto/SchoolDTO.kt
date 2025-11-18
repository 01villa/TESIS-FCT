package com.pasantia.pasantia.dto

import java.time.LocalDateTime
import java.util.*

data class SchoolDTO(
    val id: UUID,
    val name: String,
    val address: String?,
    val createdBy: UUID,
    val createdAt: LocalDateTime?
)
