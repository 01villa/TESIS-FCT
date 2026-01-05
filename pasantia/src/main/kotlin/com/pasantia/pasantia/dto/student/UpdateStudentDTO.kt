package com.pasantia.pasantia.dto.student
import java.util.UUID

data class UpdateStudentDTO(
    val firstName: String?,
    val lastName: String?,
    val ci: String?,
    val phone: String?,
    val specialtyId: UUID?
)
