package com.pasantia.pasantia.entities

import jakarta.persistence.*
import java.time.LocalDateTime
import java.util.UUID

@Entity
@Table(name = "company_tutors")
data class CompanyTutor(

    @Id
    @Column(nullable = false)
    val id: UUID = UUID.randomUUID(),

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    val company: Company,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    val user: User,

    @Column(length = 20)
    val phone: String? = null,

    @Column(nullable = false)
    val createdAt: LocalDateTime? = LocalDateTime.now()
)
