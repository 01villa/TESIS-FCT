package com.pasantia.pasantia.repositories

import com.pasantia.pasantia.entities.Role
import com.pasantia.pasantia.entities.UserRole
import com.pasantia.pasantia.entities.UserRoleId
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import java.util.*

interface UserRoleRepository : JpaRepository<UserRole, UserRoleId> {

    fun findByUserId(userId: UUID): List<UserRole>

    @Query("""
        SELECT ur FROM UserRole ur
        JOIN FETCH ur.role r
        WHERE ur.user.id = :userId
    """)
    fun findRolesWithRoleLoaded(userId: UUID): List<UserRole>

    @Modifying
    @Query(
        value = "DELETE FROM user_roles WHERE user_id = :userId",
        nativeQuery = true
    )
    fun deleteRolesByUserId(userId: UUID)
}