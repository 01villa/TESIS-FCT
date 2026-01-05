package com.pasantia.pasantia.entities

import com.pasantia.pasantia.common.AuditableEntity
import com.pasantia.pasantia.common.SoftDeletable
import com.vladmihalcea.hibernate.type.json.JsonType
import jakarta.persistence.*
import org.hibernate.annotations.Type
import java.time.LocalDate
import java.time.LocalDateTime
import java.util.*

@Entity
@Table(name = "vacancies")
data class Vacancy(

    @Id
    @Column(nullable = false)
    val id: UUID = UUID.randomUUID(),

    // ============================
    // RELACIONES
    // ============================
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    var company: Company,

    // Vacancy → Specialty
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "specialty_id", nullable = false)
    var specialty: Specialty,

    // ============================
    // CAMPOS EDITABLES
    // ============================
    @Column(nullable = false, length = 150)
    var title: String,

    @Column(columnDefinition = "TEXT")
    var description: String? = null,

    @Type(JsonType::class)
    @Column(columnDefinition = "jsonb")
    var requirements: List<String>? = null,

    @Column(nullable = false)
    var capacity: Int,

    @Column(name = "start_date", nullable = false)
    var startDate: LocalDate,

    @Column(name = "end_date", nullable = false)
    var endDate: LocalDate,

    @Column(nullable = false)
    var status: Short = 1, // 1 = abierta, 2 = cerrada

    // ============================
    // SOFT DELETE
    // ============================
    @Column(nullable = false)
    override var active: Boolean = true,

    @Column
    override var deletedAt: LocalDateTime? = null

) : AuditableEntity(), SoftDeletable
