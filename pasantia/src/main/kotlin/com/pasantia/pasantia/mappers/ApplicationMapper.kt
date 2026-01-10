package com.pasantia.pasantia.mappers

import com.pasantia.pasantia.dto.application.ApplicationDTO
import com.pasantia.pasantia.entities.Application

object ApplicationMapper {

    fun toDTO(a: Application) = ApplicationDTO(
        id = a.id,

        // ===========================
        // VACANTE / EMPRESA
        // ===========================
        vacancyId = a.vacancy.id,
        vacancyTitle = a.vacancy.title,
        companyId = a.vacancy.company.id,
        companyName = a.vacancy.company.name,

        vacancyStartDate = a.vacancy.startDate,
        vacancyEndDate = a.vacancy.endDate,

        // ===========================
        // ESTUDIANTE
        // ===========================
        studentId = a.student.id,
        studentFullName = a.student.fullName,

        studentCi = a.student.ci,
        studentPhone = a.student.phone,
        studentEmail = a.student.user?.email,

        // ===========================
        // TUTORES
        // ===========================
        schoolTutorId = a.schoolTutor.id!!,
        schoolTutorName = a.schoolTutor.fullName,

        companyTutorId = a.companyTutor?.id,
        companyTutorName = a.companyTutor?.fullName,

        // ===========================
        // ESTADO (ENUM)
        // ===========================
        status = a.status,

        // ===========================
        // NOTAS
        // ===========================
        notes = a.notes,

        // ===========================
        // CIERRE / CALIFICACIÓN
        // ===========================
        finalGrade = a.finalGrade,
        finalFeedback = a.finalFeedback,
        finishedAt = a.finishedAt,
        gradedAt = a.gradedAt,

        // ===========================
        // METADATOS
        // ===========================
        active = a.active,
        appliedAt = a.appliedAt,
        updatedAt = a.updatedAt
    )

}
