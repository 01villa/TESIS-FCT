package com.pasantia.pasantia.repositories

import com.pasantia.pasantia.entities.School
import com.pasantia.pasantia.entities.SchoolTutor
import com.pasantia.pasantia.entities.User
import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface SchoolTutorRepository : JpaRepository<SchoolTutor, UUID> {

    fun findByUser(user: User): SchoolTutor?

    fun findAllByActiveTrue(): List<SchoolTutor>

    fun findByIdAndActiveTrue(id: UUID): SchoolTutor?

    fun findAllBySchoolIdAndActiveTrue(schoolId: UUID): List<SchoolTutor>

    fun findAllBySchoolAndActiveTrue(school: School): List<SchoolTutor>
}
