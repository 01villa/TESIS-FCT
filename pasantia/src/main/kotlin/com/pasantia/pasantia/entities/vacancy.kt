package com.pasantia.pasantia.entities

import com.vladmihalcea.hibernate.type.json.JsonType
import jakarta.persistence.*
import org.hibernate.annotations.Type
import java.time.LocalDate
import java.time.LocalDateTime
import java.util.UUID

@Entity
@Table(name = "vacancies")
data class Vacancy(

    @Id
    @Column(nullable = false)
    val id: UUID = UUID.randomUUID(),

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    val company: Company,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    val createdBy: User,

    @Column(nullable = false, length = 150)
    val title: String,

    @Column(columnDefinition = "TEXT")
    val description: String? = null,

    @Type(JsonType::class)
    @Column(columnDefinition = "jsonb")
    val requirements: List<String>? = null,

    @Column(nullable = false)
    val capacity: Int,

    @Column(name = "start_date", nullable = false)
    val startDate: LocalDate,

    @Column(name = "end_date", nullable = false)
    val endDate: LocalDate,

    @Column(nullable = false)
    val status: Short = 1,

    @Column(nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now()
)
