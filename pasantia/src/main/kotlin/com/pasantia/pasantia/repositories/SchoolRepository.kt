package com.pasantia.pasantia.repositories

import com.pasantia.pasantia.entities.School
import com.pasantia.pasantia.entities.User
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface SchoolRepository : JpaRepository<School, UUID> {

    fun findByCreatedBy(user: User): School?

}
