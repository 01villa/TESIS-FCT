package com.pasantia.pasantia.repositories

import com.pasantia.pasantia.entities.Vacancy
import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface VacancyRepository : JpaRepository<Vacancy, UUID> {
    fun findByCompanyId(companyId: UUID): List<Vacancy>
}
