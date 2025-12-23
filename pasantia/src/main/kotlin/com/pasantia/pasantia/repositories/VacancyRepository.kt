package com.pasantia.pasantia.repositories

import com.pasantia.pasantia.entities.Vacancy
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface VacancyRepository : JpaRepository<Vacancy, UUID> {

    // Vacantes activas
    fun findAllByActiveTrue(): List<Vacancy>

    // Buscar una vacante activa por ID
    fun findByIdAndActiveTrue(id: UUID): Vacancy?

    // Todas las vacantes activas de una empresa
    fun findAllByCompanyIdAndActiveTrue(companyId: UUID): List<Vacancy>

    // Filtro por estado
    fun findAllByStatusAndActiveTrue(status: Short): List<Vacancy>

    // Listado completo por empresa (incluye cerradas)
    fun findAllByCompanyId(companyId: UUID): List<Vacancy>
    fun findAllBySpecialtyIdAndActiveTrue(specialtyId: UUID): List<Vacancy>
    fun findAllBySpecialtyIdAndActiveTrueAndStatusAndCapacityGreaterThan(
        specialtyId: UUID,
        status: Short,
        capacity: Int
    ): List<Vacancy>

}
