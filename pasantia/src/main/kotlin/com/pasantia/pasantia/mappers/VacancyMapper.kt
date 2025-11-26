package com.pasantia.pasantia.mappers

import com.pasantia.pasantia.dto.VacancyDTO
import com.pasantia.pasantia.entities.Vacancy

object VacancyMapper {

    fun toDTO(entity: Vacancy) = VacancyDTO(
        id = entity.id,
        companyId = entity.company.id,
        title = entity.title,
        description = entity.description,
        requirements = entity.requirements,
        capacity = entity.capacity,
        startDate = entity.startDate,
        endDate = entity.endDate,
        status = entity.status,
        createdAt = entity.createdAt
    )
}
