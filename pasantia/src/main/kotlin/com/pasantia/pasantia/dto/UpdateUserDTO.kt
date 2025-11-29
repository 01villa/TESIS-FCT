package com.pasantia.pasantia.dto

data class UpdateUserDTO(
    val fullName: String?,
    val password: String?,
    val roles: List<String>?
)
