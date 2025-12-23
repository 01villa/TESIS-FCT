package com.pasantia.pasantia.repositories

import com.pasantia.pasantia.entities.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface UserRepository : JpaRepository<User, UUID> {

    /** ============================
     *  Búsquedas estándar
     *  ============================ */

    fun findByEmail(email: String): User?
    fun findByEmailAndActiveTrue(email: String): User?
    fun existsByEmail(email: String): Boolean

    fun findAllByActiveTrue(): List<User>
    fun findByIdAndActiveTrue(id: UUID): User?
    fun findAllByActiveFalse(): List<User>

    /** ============================
     *  ADMINS DE ESCUELA (solo activos)
     *  ============================ */
    @Query(
        value = """
        SELECT u.*
        FROM users u
        JOIN user_roles ur ON ur.user_id = u.id
        JOIN roles r ON r.id = ur.role_id
        WHERE r.name = 'SCHOOL_ADMIN'
        AND u.active = true
        """,
        nativeQuery = true
    )
    fun findSchoolAdmins(): List<User>


    /** ============================
     *  ADMINS DE EMPRESA (solo activos)
     *  ============================ */
    @Query(
        value = """
        SELECT u.*
        FROM users u
        JOIN user_roles ur ON ur.user_id = u.id
        JOIN roles r ON r.id = ur.role_id
        WHERE r.name = 'COMPANY_ADMIN'
        AND u.active = true
        """,
        nativeQuery = true
    )
    fun findCompanyAdmins(): List<User>
}
