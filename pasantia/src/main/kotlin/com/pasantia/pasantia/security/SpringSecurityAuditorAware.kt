package com.pasantia.pasantia.security

import org.springframework.data.domain.AuditorAware
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Component
import java.util.*

@Component("auditorProvider")
class SpringSecurityAuditorAware : AuditorAware<String> {
    override fun getCurrentAuditor(): Optional<String> {
        val auth = SecurityContextHolder.getContext().authentication
        val name = if (auth != null && auth.isAuthenticated) auth.name else null
        return Optional.ofNullable(name)
    }
}
