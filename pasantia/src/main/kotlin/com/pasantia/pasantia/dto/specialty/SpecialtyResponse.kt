package com.pasantia.pasantia.dto.specialty

import java.util.UUID

data class SpecialtyResponse(
    val id: UUID,
    val name: String,
    val description: String?,
    val active: Boolean
)
