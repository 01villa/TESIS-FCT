package com.pasantia.pasantia.dto.specialty

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class SpecialtyRequest(

    @field:NotBlank
    @field:Size(max = 100)
    val name: String,

    @field:Size(max = 255)
    val description: String?
)
