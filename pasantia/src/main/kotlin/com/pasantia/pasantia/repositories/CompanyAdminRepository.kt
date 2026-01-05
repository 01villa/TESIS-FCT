package com.pasantia.pasantia.repositories

import com.pasantia.pasantia.entities.CompanyAdmin
import com.pasantia.pasantia.entities.User
import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface CompanyAdminRepository : JpaRepository<CompanyAdmin, UUID> {

    fun findByUserId(user_id: UUID): CompanyAdmin?

    fun findAllByActiveTrue(): List<CompanyAdmin>

    fun findByIdAndActiveTrue(id: UUID): CompanyAdmin?

    fun findAllByCompanyIdAndActiveTrue(companyId: UUID): List<CompanyAdmin>
}
