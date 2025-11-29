package com.pasantia.pasantia.repositories

import com.pasantia.pasantia.entities.School
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface SchoolRepository : JpaRepository<School, UUID> {

    fun findByCreatedBy(createdBy: String): School?
    fun findAllByActiveTrue(): List<School>
    fun findByIdAndActiveTrue(id: UUID): School?
}
