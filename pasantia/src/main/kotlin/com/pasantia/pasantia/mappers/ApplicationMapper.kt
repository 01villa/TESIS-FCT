package com.pasantia.pasantia.mappers

import com.pasantia.pasantia.dto.application.ApplicationDTO
import com.pasantia.pasantia.entities.Application

object ApplicationMapper {

    fun toDTO(a: Application) = ApplicationDTO(
        id = a.id,
        vacancyId = a.vacancy.id,
        vacancyTitle = a.vacancy.title,
        companyId = a.vacancy.company.id,
        companyName = a.vacancy.company.name,
        studentId = a.student.id,
        studentFullName = a.student.fullName,
        schoolTutorId = a.schoolTutor.id!!,
        schoolTutorName = a.schoolTutor.fullName,
        companyTutorId = a.companyTutor?.id,
        companyTutorName = a.companyTutor?.fullName,
        status = a.status,
        notes = a.notes,
        active = a.active,
        appliedAt = a.appliedAt,
        updatedAt = a.updatedAt
    )
}
