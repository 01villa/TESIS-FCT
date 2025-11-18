package com.pasantia.pasantia.repositories

import com.pasantia.pasantia.entities.Application
import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface ApplicationRepository : JpaRepository<Application, UUID> {
    fun findByStudentId(studentId: UUID): List<Application>
    fun findByVacancyId(vacancyId: UUID): List<Application>
    fun existsByVacancyIdAndStudentId(vacancyId: UUID, studentId: UUID): Boolean
}
