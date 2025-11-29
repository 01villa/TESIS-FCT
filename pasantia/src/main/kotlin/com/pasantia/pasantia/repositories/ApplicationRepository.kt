package com.pasantia.pasantia.repositories

import com.pasantia.pasantia.entities.Application
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface ApplicationRepository : JpaRepository<Application, UUID> {

    fun findAllByActiveTrue(): List<Application>

    fun findByIdAndActiveTrue(id: UUID): Application?

    fun findAllBySchoolTutorEmailAndActiveTrue(email: String): List<Application>

    fun findAllByCompanyTutorEmailAndActiveTrue(email: String): List<Application>

    fun findAllByStudentIdAndActiveTrue(studentId: UUID): List<Application>

    fun existsByStudentIdAndVacancyIdAndActiveTrue(studentId: UUID, vacancyId: UUID): Boolean

    fun findAllByVacancyCompanyIdAndActiveTrue(companyId: UUID): List<Application>

}
