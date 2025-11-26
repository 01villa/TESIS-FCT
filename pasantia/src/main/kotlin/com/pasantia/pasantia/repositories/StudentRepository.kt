package com.pasantia.pasantia.repositories

import com.pasantia.pasantia.entities.School
import com.pasantia.pasantia.entities.Student
import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface StudentRepository : JpaRepository<Student, UUID> {
    fun existsByCi(ci: String): Boolean
    fun findBySchool(school: School): List<Student>
}
