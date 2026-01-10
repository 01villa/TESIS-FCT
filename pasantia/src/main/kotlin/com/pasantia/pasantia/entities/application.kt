package com.pasantia.pasantia.entities

import com.pasantia.pasantia.common.SoftDeletable
import jakarta.persistence.*
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import java.math.BigDecimal
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
    // 4 = finalizado por tutor escolar
    // 5 = calificado por tutor escolar
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var status: ApplicationStatus = ApplicationStatus.ASSIGNED,

    @Column(columnDefinition = "TEXT")
    var notes: String? = null,

    // ===========================
    // CALIFICACIÓN FINAL
    // ===========================
    // Nota final (ej: 0.00 - 10.00)
    @Column(name = "final_grade", precision = 5, scale = 2)
    var finalGrade: BigDecimal? = null,

    // Observación final / retroalimentación
    @Column(name = "final_feedback", columnDefinition = "TEXT")
    var finalFeedback: String? = null,

    // Cuándo se marcó como finalizada la pasantía
    @Column(name = "finished_at")
    var finishedAt: LocalDateTime? = null,

    // Cuándo se registró la calificación
    @Column(name = "graded_at")
    var gradedAt: LocalDateTime? = null,

    // Quién calificó (id del tutor escolar normalmente)
    @Column(name = "graded_by")
    var gradedBy: UUID? = null,

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
