package com.pasantia.pasantia.repositories

import com.pasantia.pasantia.entities.CompanyAdmin
import com.pasantia.pasantia.entities.User
import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface CompanyAdminRepository : JpaRepository<CompanyAdmin, UUID> {
    fun findByCompanyId(companyId: UUID): List<CompanyAdmin>
    fun findByUser(user: User): CompanyAdmin?

}
