package com.pasantia.pasantia.dto

data class UpdateUserBasicDTO(
    val fullName: String,
    val email: String,
    val password: String? = null
)