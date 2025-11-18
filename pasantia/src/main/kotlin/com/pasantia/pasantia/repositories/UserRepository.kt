package com.pasantia.pasantia.repositories

import com.pasantia.pasantia.entities.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.util.*

interface UserRepository : JpaRepository<User, UUID> {
    fun findByEmail(email: String): User?
    fun existsByEmail(email: String): Boolean
    @Query("""
    SELECT u FROM User u
    JOIN u.roles r
    WHERE r.name = 'SCHOOL_ADMIN'
""")
    fun findSchoolAdmins(): List<User>

    @Query("""
    SELECT u FROM User u
    JOIN u.roles r
    WHERE r.name = 'COMPANY_ADMIN'
""")
    fun findCompanyAdmins(): List<User>

}
