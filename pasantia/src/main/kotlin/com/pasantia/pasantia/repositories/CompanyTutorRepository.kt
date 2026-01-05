package com.pasantia.pasantia.repositories

import com.pasantia.pasantia.entities.Company
import com.pasantia.pasantia.entities.CompanyAdmin
import com.pasantia.pasantia.entities.CompanyTutor
import com.pasantia.pasantia.entities.User
import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface CompanyTutorRepository : JpaRepository<CompanyTutor, UUID> {

    fun findByUserId(user_id: UUID): CompanyAdmin?

    fun findByUser(user: User): CompanyTutor?

    fun findAllByActiveTrue(): List<CompanyTutor>

    fun findByIdAndActiveTrue(id: UUID): CompanyTutor?

    fun findAllByCompanyIdAndActiveTrue(companyId: UUID): List<CompanyTutor>

    fun findAllByCompanyAndActiveTrue(company: Company): List<CompanyTutor>
}
