package com.pasantia.pasantia.entities

import jakarta.persistence.*
import org.hibernate.annotations.UuidGenerator
import java.time.LocalDateTime
import java.util.*

@Entity
@Table(name = "audit_logs")
class AuditLog(

    @Id
    @UuidGenerator
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    var id: UUID? = null,

    @Column(nullable = false)
    var timestamp: LocalDateTime = LocalDateTime.now(),

    @Column(name = "actor_email")
    var actorEmail: String? = null,

    @Column(nullable = false, length = 10)
    var method: String,

    @Column(nullable = false, length = 255)
    var path: String,

    @Column(length = 500)
    var query: String? = null,

    @Column(length = 50)
    var ip: String? = null,

    @Column(length = 255)
    var userAgent: String? = null,

    var status: Int? = null,

    @Column(nullable = false)
    var success: Boolean = true,

    @Column(length = 100)
    var errorCode: String? = null,

    @Column(length = 500)
    var errorMessage: String? = null,

    var tookMs: Long? = null
)
