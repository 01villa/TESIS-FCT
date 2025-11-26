package com.pasantia.pasantia.dto

data class CompanyTutorDTO(
    val id: String,
    val fullName: String,
    val email: String,
    val phone: String?,
    val companyId: String,
    val userId: String
)
