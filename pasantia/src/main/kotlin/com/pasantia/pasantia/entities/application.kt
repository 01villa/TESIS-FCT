package com.pasantia.pasantia.entities

import jakarta.persistence.*
import java.time.LocalDateTime
import java.util.UUID

@Entity
@Table(name = "applications")
data class Application(

    @Id
    @Column(nullable = false)
    val id: UUID = UUID.randomUUID(),

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vacancy_id", nullable = false)
    val vacancy: Vacancy,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    val student: Student,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "school_tutor_id", nullable = false)
    val schoolTutor: User, // el que valida la postulación

    @Column(nullable = false)
    val status: Short = 1, // 1 pendiente

    @Column(nullable = false)
    val appliedAt: LocalDateTime? = LocalDateTime.now()
)
