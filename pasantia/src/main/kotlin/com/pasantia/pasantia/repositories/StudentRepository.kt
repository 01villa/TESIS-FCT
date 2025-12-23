package com.pasantia.pasantia.repositories

import com.pasantia.pasantia.entities.Student
import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface StudentRepository : JpaRepository<Student, UUID> {
    fun findAllByActiveTrue(): List<Student>
    fun findByIdAndActiveTrue(id: UUID): Student?
    fun findByUserEmailAndActiveTrue(email: String): Student?
    fun findAllBySchoolIdAndActiveTrue(schoolId: UUID): List<Student>
    fun findAllBySpecialtyIdAndActiveTrue(specialtyId: UUID): List<Student>

    fun findBySpecialtyIdAndActiveTrue(
        specialtyId: UUID
    ): List<Student>

    fun findBySchoolIdAndSpecialtyIdAndActiveTrue(
        schoolId: UUID,
        specialtyId: UUID
    ): List<Student>
}
