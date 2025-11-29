package com.pasantia.pasantia.dto.company.companytutor

data class CreateCompanyTutorDTO(
    val email: String,
    val fullName: String,
    val password: String,
    val phone: String?
)
