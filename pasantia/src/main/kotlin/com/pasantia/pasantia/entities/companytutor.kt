package com.pasantia.pasantia.entities

import com.pasantia.pasantia.common.SoftDeletable
import jakarta.persistence.*
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import java.time.LocalDateTime
import java.util.*

@Entity
@EntityListeners(AuditingEntityListener::class)
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
    override var deletedAt: LocalDateTime? = null,

    // ------ Auditoría ------
    @CreatedDate
    @Column(updatable = false)
    var createdAt: LocalDateTime? = null,

    @LastModifiedDate
    var updatedAt: LocalDateTime? = null

) : SoftDeletable
