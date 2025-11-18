package com.pasantia.pasantia.entities

import jakarta.persistence.*
import java.time.LocalDateTime
import java.util.UUID

@Entity
@Table(
    name = "students",
    uniqueConstraints = [
        UniqueConstraint(columnNames = ["ci"])
    ]
)
data class Student(

    @Id
    @Column(nullable = false)
    val id: UUID = UUID.randomUUID(),

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "school_id", nullable = false)
    val school: School,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    val createdBy: User,  // tutor de escuela

    @Column(nullable = false, length = 80)
    val firstName: String,

    @Column(nullable = false, length = 80)
    val lastName: String,

    @Column(nullable = false, length = 20, unique = true)
    val ci: String,

    @Column(nullable = false, length = 150)
    val email: String,

    @Column(length = 20)
    val phone: String? = null,

    @Column(nullable = false)
    val status: Short = 1,

    @Column(nullable = false)
    val createdAt: LocalDateTime? = LocalDateTime.now()
)
