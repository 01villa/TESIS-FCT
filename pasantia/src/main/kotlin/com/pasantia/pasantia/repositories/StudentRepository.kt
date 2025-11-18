package com.pasantia.pasantia.repositories

import com.pasantia.pasantia.entities.Student
import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface StudentRepository : JpaRepository<Student, UUID> {
    fun existsByEmail(email: String): Boolean
    fun findByEmail(email: String): Student?
}
