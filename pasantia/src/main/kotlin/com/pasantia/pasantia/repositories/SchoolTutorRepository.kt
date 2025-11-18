package com.pasantia.pasantia.repositories

import com.pasantia.pasantia.entities.SchoolTutor
import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface SchoolTutorRepository : JpaRepository<SchoolTutor, UUID> {
    fun findBySchoolId(schoolId: UUID): List<SchoolTutor>
}
