package com.pasantia.pasantia.repositories

import com.pasantia.pasantia.entities.Assignment
import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface AssignmentRepository : JpaRepository<Assignment, UUID> {
    fun findByStudentId(studentId: UUID): List<Assignment>
    fun findByVacancyId(vacancyId: UUID): List<Assignment>
}
