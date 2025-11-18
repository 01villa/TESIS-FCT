package com.pasantia.pasantia.dto.auth

import com.pasantia.pasantia.dto.UserDTO


data class AuthResponse(
    val token: String,
    val user: UserDTO
)