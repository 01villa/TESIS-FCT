package com.pasantia.pasantia.audit

import com.pasantia.pasantia.entities.AuditLog
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import java.time.LocalDateTime
import java.util.UUID

interface AuditLogRepository : JpaRepository<AuditLog, UUID> {

    fun findByTimestampBetween(
        from: LocalDateTime,
        to: LocalDateTime,
        pageable: Pageable
    ): Page<AuditLog>

    fun findByActorEmailContainingIgnoreCaseAndTimestampBetween(
        actorEmail: String,
        from: LocalDateTime,
        to: LocalDateTime,
        pageable: Pageable
    ): Page<AuditLog>

    fun findBySuccessAndTimestampBetween(
        success: Boolean,
        from: LocalDateTime,
        to: LocalDateTime,
        pageable: Pageable
    ): Page<AuditLog>

    fun findByActorEmailContainingIgnoreCaseAndSuccessAndTimestampBetween(
        actorEmail: String,
        success: Boolean,
        from: LocalDateTime,
        to: LocalDateTime,
        pageable: Pageable
    ): Page<AuditLog>
}
