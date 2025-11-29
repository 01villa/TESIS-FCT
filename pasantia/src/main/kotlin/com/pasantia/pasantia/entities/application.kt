package com.pasantia.pasantia.entities

import com.pasantia.pasantia.common.SoftDeletable
import jakarta.persistence.*
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import java.time.LocalDateTime
import java.util.UUID

@Entity
@EntityListeners(AuditingEntityListener::class)
@Table(name = "applications")
data class Application(

    @Id
    @Column(nullable = false)
    val id: UUID = UUID.randomUUID(),

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vacancy_id", nullable = false)
    var vacancy: Vacancy,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    var student: Student,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "school_tutor_id", nullable = false)
    var schoolTutor: User,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_tutor_id")
    var companyTutor: User? = null,

    // 1 = asignado por tutor escolar / pendiente empresa
    // 2 = aprobado por tutor de empresa
    // 3 = rechazado por tutor de empresa
    @Column(nullable = false)
    var status: Short = 1,

    @Column(columnDefinition = "TEXT")
    var notes: String? = null,

    // ---------- Soft delete ----------
    @Column(nullable = false)
    override var active: Boolean = true,

    @Column
    override var deletedAt: LocalDateTime? = null,

    // ---------- Auditoría ----------
    @CreatedDate
    @Column(nullable = true, updatable = false)
    var appliedAt: LocalDateTime? = null,

    @LastModifiedDate
    @Column(nullable = true)
    var updatedAt: LocalDateTime? = null

) : SoftDeletable
