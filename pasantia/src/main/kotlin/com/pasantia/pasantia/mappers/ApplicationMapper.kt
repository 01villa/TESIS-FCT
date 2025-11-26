package com.pasantia.pasantia.mappers

import com.pasantia.pasantia.dto.application.ApplicationDTO
import com.pasantia.pasantia.entities.Application

object ApplicationMapper {

    fun toDTO(entity: Application): ApplicationDTO =
        ApplicationDTO(
            id = entity.id,
            vacancyId = entity.vacancy.id,
            vacancyTitle = entity.vacancy.title,
            companyId = entity.vacancy.company.id!!,
            companyName = entity.vacancy.company.name, // ajusta si el campo se llama distinto
            studentId = entity.student.id!!,
            studentFullName = entity.student.fullName,
            schoolTutorId = entity.schoolTutor.id!!,
            schoolTutorName = entity.schoolTutor.fullName,
            companyTutorId = entity.companyTutor?.id,
            companyTutorName = entity.companyTutor?.fullName,
            status = entity.status,
            notes = entity.notes,
            appliedAt = entity.appliedAt,
            updatedAt = entity.updatedAt
        )
}
