package com.pasantia.pasantia.audit

import com.pasantia.pasantia.entities.AuditLog
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import java.time.LocalDateTime

@Service
class AuditLogService(
    private val repo: AuditLogRepository
) {
    fun search(
        actorEmail: String?,
        success: Boolean?,
        from: LocalDateTime,
        to: LocalDateTime,
        pageable: Pageable
    ): Page<AuditLog> {
        return when {
            actorEmail != null && success != null ->
                repo.findByActorEmailContainingIgnoreCaseAndSuccessAndTimestampBetween(actorEmail, success, from, to, pageable)

            actorEmail != null ->
                repo.findByActorEmailContainingIgnoreCaseAndTimestampBetween(actorEmail, from, to, pageable)

            success != null ->
                repo.findBySuccessAndTimestampBetween(success, from, to, pageable)

            else ->
                repo.findByTimestampBetween(from, to, pageable)
        }
    }

    fun save(log: AuditLog) = repo.save(log)
}
