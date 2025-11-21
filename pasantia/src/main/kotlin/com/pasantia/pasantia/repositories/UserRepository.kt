package com.pasantia.pasantia.repositories

import com.pasantia.pasantia.entities.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface UserRepository : JpaRepository<User, UUID> {

    fun findByEmail(email: String): User?
    fun existsByEmail(email: String): Boolean

    /** -----------------------------
     *  ADMINS DE ESCUELA
     *  ----------------------------- */
    @Query(
        value = """
        SELECT u.*
        FROM users u
        JOIN user_roles ur ON ur.user_id = u.id
        JOIN roles r ON r.id = ur.role_id
        WHERE r.name = 'SCHOOL_ADMIN'
        """,
        nativeQuery = true
    )
    fun findSchoolAdmins(): List<User>

    /** -----------------------------
     *  ADMINS DE EMPRESA
     *  ----------------------------- */
    @Query(
        value = """
        SELECT u.*
        FROM users u
        JOIN user_roles ur ON ur.user_id = u.id
        JOIN roles r ON r.id = ur.role_id
        WHERE r.name = 'COMPANY_ADMIN'
        """,
        nativeQuery = true
    )
    fun findCompanyAdmins(): List<User>
}
