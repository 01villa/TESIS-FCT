package com.pasantia.pasantia.repositories

import com.pasantia.pasantia.entities.SchoolAdmin
import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface SchoolAdminRepository : JpaRepository<SchoolAdmin, UUID> {
    fun findBySchoolId(schoolId: UUID): List<SchoolAdmin>
}
