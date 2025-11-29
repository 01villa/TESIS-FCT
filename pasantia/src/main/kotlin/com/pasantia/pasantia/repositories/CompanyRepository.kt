package com.pasantia.pasantia.repositories

import com.pasantia.pasantia.entities.Company
import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface CompanyRepository : JpaRepository<Company, UUID> {

    fun findAllByActiveTrue(): List<Company>

    fun findByIdAndActiveTrue(id: UUID): Company?
}
