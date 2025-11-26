package com.pasantia.pasantia.dto.student

data class CreateStudentDTO(
    val firstName: String,
    val lastName: String,
    val ci: String,
    val email: String,
    val phone: String?
)
