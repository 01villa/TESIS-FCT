package com.pasantia.pasantia.repositories

import com.pasantia.pasantia.entities.Application
import com.pasantia.pasantia.entities.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface ApplicationRepository : JpaRepository<Application, UUID> {

    // Todas las asignaciones de una empresa (por company_id de la vacancy)
    fun findByVacancyCompanyId(companyId: UUID): List<Application>

    // Todas las asignaciones creadas por un tutor de escuela
    fun findBySchoolTutor(schoolTutor: User): List<Application>


}
