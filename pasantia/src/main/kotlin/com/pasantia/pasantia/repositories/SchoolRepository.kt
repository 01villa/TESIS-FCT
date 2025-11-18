package com.pasantia.pasantia.repositories

import com.pasantia.pasantia.entities.School
import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface SchoolRepository : JpaRepository<School, UUID>
