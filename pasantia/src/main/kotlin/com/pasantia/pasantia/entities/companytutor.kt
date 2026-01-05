package com.pasantia.pasantia.entities

import com.pasantia.pasantia.common.AuditableEntity
import com.pasantia.pasantia.common.SoftDeletable
import jakarta.persistence.*
import java.time.LocalDateTime
import java.util.*

@Entity
@Table(name = "company_tutors")
data class CompanyTutor(

    @Id
    @Column(nullable = false)
    val id: UUID = UUID.randomUUID(),

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    var company: Company,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    var user: User,

    @Column(length = 20)
    var phone: String? = null,

    // ------ Soft Delete ------
    @Column(nullable = false)
    override var active: Boolean = true,

    @Column
    override var deletedAt: LocalDateTime? = null

) : AuditableEntity(), SoftDeletable
