package com.pasantia.pasantia.repositories

import com.pasantia.pasantia.entities.Role
import org.springframework.data.jpa.repository.JpaRepository

interface RoleRepository : JpaRepository<Role, Long> {
    fun findByName(name: String): Role?
}
