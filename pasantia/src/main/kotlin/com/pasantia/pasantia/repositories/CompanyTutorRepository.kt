package com.pasantia.pasantia.repositories

import com.pasantia.pasantia.entities.CompanyTutor
import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface CompanyTutorRepository : JpaRepository<CompanyTutor, UUID> {
    fun findByCompanyId(companyId: UUID): List<CompanyTutor>
}
