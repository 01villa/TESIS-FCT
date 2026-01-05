package com.pasantia.pasantia.repositories

import com.pasantia.pasantia.entities.Specialty
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface SpecialtyRepository : JpaRepository<Specialty, UUID> {

    fun findByActiveTrue(): List<Specialty>

    fun findByNameIgnoreCase(name: String): Specialty?
}
