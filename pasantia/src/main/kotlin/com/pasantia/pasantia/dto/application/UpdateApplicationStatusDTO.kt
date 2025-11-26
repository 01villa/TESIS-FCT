package com.pasantia.pasantia.dto.application

import java.util.UUID

data class UpdateApplicationStatusDTO(
    val notes: String? = null,
    val companyTutorId: UUID? = null
)
