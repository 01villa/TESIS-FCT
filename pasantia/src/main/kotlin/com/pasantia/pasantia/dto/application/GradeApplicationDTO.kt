package com.pasantia.pasantia.dto.application

import java.math.BigDecimal

data class GradeApplicationDTO(
    val finalGrade: BigDecimal,
    val finalFeedback: String? = null
)