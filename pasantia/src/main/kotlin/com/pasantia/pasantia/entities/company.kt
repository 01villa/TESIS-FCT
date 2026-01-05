package com.pasantia.pasantia.entities

import com.pasantia.pasantia.common.AuditableEntity
import com.pasantia.pasantia.common.SoftDeletable
import jakarta.persistence.*
import java.time.LocalDateTime
import java.util.UUID

@Entity
@Table(name = "companies")
data class Company(

    @Id
    @Column(nullable = false)
    val id: UUID = UUID.randomUUID(),

    @Column(nullable = false, length = 150)
    var name: String,

    @Column(length = 200)
    var address: String? = null,

    // ============================
    // Soft Delete
    // ============================
    @Column(nullable = false)
    override var active: Boolean = true,

    @Column(name = "logo_url")
    var logoUrl: String? = null,

    @Column
    override var deletedAt: LocalDateTime? = null

) : AuditableEntity(), SoftDeletable
