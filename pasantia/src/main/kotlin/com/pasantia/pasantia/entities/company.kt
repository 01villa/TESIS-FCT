package com.pasantia.pasantia.entities

import jakarta.persistence.*
import org.springframework.data.annotation.CreatedBy
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import java.time.LocalDateTime
import java.util.*

@Entity
@EntityListeners(AuditingEntityListener::class)
@Table(name = "companies")
data class Company(

    @Id
    @Column(nullable = false)
    val id: UUID = UUID.randomUUID(),

    @Column(nullable = false, length = 150)
    val name: String,

    @Column(length = 200)
    val address: String? = null,

    @CreatedBy
    @Column(name = "created_by", nullable = true)
    var createdBy: String? = null,

    @CreatedDate
    @Column(nullable = true)
    var createdAt: LocalDateTime? = null
)
