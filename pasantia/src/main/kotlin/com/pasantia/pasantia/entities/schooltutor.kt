package com.pasantia.pasantia.entities

import com.pasantia.pasantia.common.AuditableEntity
import com.pasantia.pasantia.common.SoftDeletable
import jakarta.persistence.*
import java.time.LocalDateTime
import java.util.UUID

@Entity
@Table(name = "school_tutors")
data class SchoolTutor(

    @Id
    @Column(nullable = false)
    val id: UUID = UUID.randomUUID(),

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "school_id", nullable = false)
    var school: School,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    var user: User,

    @Column(length = 20)
    var phone: String? = null,

    // ============================
    // Soft Delete
    // ============================
    @Column(nullable = false)
    override var active: Boolean = true,

    @Column
    override var deletedAt: LocalDateTime? = null

) : AuditableEntity(), SoftDeletable
