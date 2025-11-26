package com.pasantia.pasantia.repositories

import com.pasantia.pasantia.entities.SchoolAdmin
import com.pasantia.pasantia.entities.User
import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface SchoolAdminRepository : JpaRepository<SchoolAdmin, UUID> {
    fun findByUser(user: User): SchoolAdmin?
}
