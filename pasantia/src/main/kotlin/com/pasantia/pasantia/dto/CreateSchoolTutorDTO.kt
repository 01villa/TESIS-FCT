package com.pasantia.pasantia.dto

data class CreateSchoolTutorDTO(
    val fullName: String,
    val email: String,
    val password: String,
    val phone: String?
)
