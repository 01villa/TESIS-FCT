package com.pasantia.pasantia.entities

import jakarta.persistence.*

@Entity
@Table(
    name = "roles",
    uniqueConstraints = [
        UniqueConstraint(columnNames = ["name"])
    ]
)
data class Role(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(nullable = false, length = 50, unique = true)
    val name: String
)
