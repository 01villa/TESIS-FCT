package com.pasantia.pasantia.dto.application

import java.util.UUID


data class CreateAssignmentDTO(
    val vacancyId: UUID,
    val studentId: UUID,
    val notes: String?
)