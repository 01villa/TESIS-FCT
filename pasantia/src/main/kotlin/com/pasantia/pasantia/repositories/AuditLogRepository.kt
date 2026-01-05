package com.pasantia.pasantia.repositories

import com.pasantia.pasantia.entities.AuditLog
import org.springframework.data.jpa.repository.JpaRepository

interface AuditLogRepository : JpaRepository<AuditLog, Long>
