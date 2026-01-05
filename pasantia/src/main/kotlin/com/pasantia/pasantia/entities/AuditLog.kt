package com.pasantia.pasantia.entities

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "audit_logs")
data class AuditLog(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(name = "actor_id", nullable = false)
    val actorId: java.util.UUID,

    @Column(nullable = false, length = 100)
    val action: String,

    @Column(name = "entity_type", nullable = false, length = 50)
    val entityType: String,

    @Column(name = "entity_id", nullable = false, length = 50)
    val entityId: String,

    @Column(columnDefinition = "JSONB")
    val details: String? = null,

    @Column(columnDefinition = "INET")
    val ip: String? = null,

    @Column(columnDefinition = "TEXT")
    val userAgent: String? = null,

    @Column(nullable = false)
    val createdAt: LocalDateTime? = LocalDateTime.now()
)
