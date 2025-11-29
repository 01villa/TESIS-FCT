package com.pasantia.pasantia.dto

data class CreateUserDTO(
    val email: String,
    val fullName: String,
    val password: String,
    val roles: List<String>
)
