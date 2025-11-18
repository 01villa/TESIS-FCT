package com.pasantia.pasantia.dto.auth

import java.util.*

data class UserSimpleDTO(
    val id: UUID,
    val fullName: String,
    val email: String
)