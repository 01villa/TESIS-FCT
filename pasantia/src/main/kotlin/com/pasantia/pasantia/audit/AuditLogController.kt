package com.pasantia.pasantia.audit

import com.pasantia.pasantia.entities.AuditLog
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.time.LocalDateTime

@RestController
@RequestMapping("/admin/audit-logs")
class AuditLogController(
    private val auditService: AuditLogService
) {

    @GetMapping
    fun search(
        @RequestParam(required = false) actorEmail: String?,
        @RequestParam(required = false) success: Boolean?,
        @RequestParam(required = false)
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
        from: LocalDateTime?,
        @RequestParam(required = false)
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
        to: LocalDateTime?,
        pageable: Pageable
    ): Page<AuditLog> {
        val safeFrom = from ?: LocalDateTime.now().minusDays(30)
        val safeTo = to ?: LocalDateTime.now()
        return auditService.search(actorEmail, success, safeFrom, safeTo, pageable)
    }
}
