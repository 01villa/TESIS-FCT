package com.pasantia.pasantia.entities

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
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
)
