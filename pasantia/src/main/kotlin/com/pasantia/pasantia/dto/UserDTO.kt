package com.pasantia.pasantia.dto

import java.time.LocalDateTime
import java.util.UUID

data class UserDTO(
    val id: UUID,
    val email: String,
    val fullName: String,
    val status: Int,
    val roles: List<String>,
    val createdAt: LocalDateTime?,
    val updatedAt: LocalDateTime?
)
