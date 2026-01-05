package com.pasantia.pasantia.entities

import com.pasantia.pasantia.common.AuditableEntity
import jakarta.persistence.*
import java.util.UUID

@Entity
@Table(name = "specialties")
data class Specialty(

    @Id
    @Column(nullable = false)
    val id: UUID = UUID.randomUUID(),

    @Column(nullable = false, unique = true, length = 100)
    var name: String,

    @Column(length = 255)
    var description: String? = null,

    @Column(nullable = false)
    var active: Boolean = true

) : AuditableEntity()
