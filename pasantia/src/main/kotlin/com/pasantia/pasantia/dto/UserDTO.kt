package com.pasantia.pasantia.dto

import java.util.UUID

data class UserDTO(
    val id: UUID,
    val email: String,
    val fullName: String,
    val status: Int,
    val roles: List<String>
)