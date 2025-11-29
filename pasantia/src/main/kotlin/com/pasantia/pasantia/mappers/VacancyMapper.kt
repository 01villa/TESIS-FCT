package com.pasantia.pasantia.mappers

import com.pasantia.pasantia.dto.vacancy.VacancyDTO
import com.pasantia.pasantia.entities.Vacancy

object VacancyMapper {

    fun toDTO(v: Vacancy): VacancyDTO =
        VacancyDTO(
            id = v.id,
            companyId = v.company.id,
            title = v.title,
            description = v.description,
            requirements = v.requirements,
            capacity = v.capacity,
            startDate = v.startDate,
            endDate = v.endDate,
            status = v.status,
            active = v.active,
            deletedAt = v.deletedAt,
            createdAt = v.createdAt,
            updatedAt = v.updatedAt
        )
}
