package com.pasantia.pasantia.repositories

import com.pasantia.pasantia.entities.Role
import com.pasantia.pasantia.entities.UserRole
import com.pasantia.pasantia.entities.UserRoleId
import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface UserRoleRepository : JpaRepository<UserRole, UserRoleId> {
    fun findByUserId(userId: UUID): List<UserRole>

}
