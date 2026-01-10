package com.pasantia.pasantia.dto.admin

data class CreateSchoolDTO(
    val name: String,
    val address: String?,
    val logoUrl: String?,
    val publicUrl: String?
)
