package com.pasantia.pasantia.dto.school.schoolTutor

data class CreateSchoolTutorDTO(
    val email: String,
    val fullName: String,
    val password: String,
    val phone: String?
)
