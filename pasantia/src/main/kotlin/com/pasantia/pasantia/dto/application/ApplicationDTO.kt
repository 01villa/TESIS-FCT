package com.pasantia.pasantia.dto.application

import com.pasantia.pasantia.entities.ApplicationStatus
import java.math.BigDecimal
import java.time.LocalDate
import java.time.LocalDateTime
import java.util.UUID

data class ApplicationDTO(
    val id: UUID,

    val vacancyId: UUID,
    val vacancyTitle: String,
    val companyId: UUID,
    val companyName: String,

    val vacancyStartDate: LocalDate?,
    val vacancyEndDate: LocalDate?,

    val studentId: UUID,
    val studentFullName: String,

    val studentCi: String?,
    val studentPhone: String?,
    val studentEmail: String?,

    val schoolTutorId: UUID,
    val schoolTutorName: String,

    val companyTutorId: UUID?,
    val companyTutorName: String?,

    val status: ApplicationStatus,

    // Notas generales (las que ya usabas)
    val notes: String?,

    // ===========================
    // CAMPOS DE CIERRE / NOTA FINAL
    // ===========================
    val finalGrade: BigDecimal?,        // null => aún no calificada
    val finalFeedback: String?,         // observación final
    val finishedAt: LocalDateTime?,     // cuándo se finalizó
    val gradedAt: LocalDateTime?,       // cuándo se calificó

    val active: Boolean,
    val appliedAt: LocalDateTime?,
    val updatedAt: LocalDateTime?
)
