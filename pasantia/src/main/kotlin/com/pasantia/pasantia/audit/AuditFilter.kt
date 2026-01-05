package com.pasantia.pasantia.audit

import com.pasantia.pasantia.entities.AuditLog
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter
import org.springframework.web.util.ContentCachingResponseWrapper

@Component
class AuditFilter(
    private val auditService: AuditLogService
) : OncePerRequestFilter() {

    private val excludedPaths = listOf(
        "/auth",
        "/swagger",
        "/v3/api-docs",
        "/actuator"
    )

    override fun shouldNotFilter(request: HttpServletRequest): Boolean {
        val path = request.requestURI
        return excludedPaths.any { path.startsWith(it) }
    }

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val start = System.currentTimeMillis()
        val wrappedResponse = ContentCachingResponseWrapper(response)

        var exception: Exception? = null

        try {
            filterChain.doFilter(request, wrappedResponse)
        } catch (ex: Exception) {
            exception = ex
            throw ex
        } finally {
            val duration = System.currentTimeMillis() - start
            val status = wrappedResponse.status

            val auth = SecurityContextHolder.getContext().authentication
            val actor = if (auth != null && auth.isAuthenticated) auth.name else null

            val ip = request.getHeader("X-Forwarded-For")
                ?.split(",")
                ?.firstOrNull()
                ?.trim()
                ?: request.remoteAddr

            val log = AuditLog(
                actorEmail = actor,
                method = request.method,
                path = request.requestURI,
                query = request.queryString,
                ip = ip,
                userAgent = request.getHeader("User-Agent"),
                status = status,
                success = exception == null && status < 400,
                errorCode = exception?.javaClass?.simpleName ?: if (status >= 400) "HTTP_$status" else null,
                errorMessage = exception?.message,
                tookMs = duration
            )

            runCatching { auditService.save(log) }
            wrappedResponse.copyBodyToResponse()
        }
    }
}
