package com.pasantia.pasantia.dto.public


import java.util.UUID

data class PartnerPublicDTO(
    val id: UUID,
    val name: String,
    val type: String, // SCHOOL | COMPANY
    val logoUrl: String?,
    val publicUrl: String?,
)