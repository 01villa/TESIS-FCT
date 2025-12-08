package com.pasantia.pasantia.security

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource

@Configuration
class SecurityConfig(
    private val jwtAuthFilter: JwtAuthFilter
) {

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {

        http
            .cors { it.configurationSource(corsConfig()) }
            .csrf { it.disable() }
            .sessionManagement { it.sessionCreationPolicy(SessionCreationPolicy.STATELESS) }
            .authorizeHttpRequests { it ->

                // ---------------------------
                // PÚBLICO
                // ---------------------------
                it.requestMatchers("/auth/**").permitAll()

                // ---------------------------
                // ADMIN GENERAL (CRUD GLOBAL)
                // ---------------------------
                it.requestMatchers(
                    "/students/**"
                ).hasRole("ADMIN")

                // ---------------------------
                // COLEGIOS (Admin + SchoolAdmin)
                // ---------------------------
                it.requestMatchers("/schools/**")
                    .hasAnyRole("ADMIN", "SCHOOL_ADMIN")

                it.requestMatchers(
                    "/admin/schools/**",
                    "/admin/school-admins/**",
                    "/admin/school-tutors/**"
                ).hasAnyRole("ADMIN", "SCHOOL_ADMIN")

                // ---------------------------
                // STUDENTS también para SCHOOL_TUTOR
                // ---------------------------
                it.requestMatchers("/admin/students/**")
                    .hasAnyRole("ADMIN", "SCHOOL_ADMIN", "SCHOOL_TUTOR")

                // ---------------------------
                // EMPRESAS
                // ---------------------------
                it.requestMatchers("/companies", "/companies/**")
                    .hasRole("ADMIN")
                // ---------------------------
                // VACANTES (globalmente accesibles)
                // ---------------------------
                it.requestMatchers("/vacancies/**")
                    .hasAnyRole("ADMIN", "SCHOOL_TUTOR", "COMPANY_TUTOR", "STUDENT")

                // ---------------------------
                // TUTOR ESCOLAR
                // ---------------------------
                it.requestMatchers(
                    "/applications/school-tutor/**",
                    "/applications/assign"
                ).hasRole("SCHOOL_TUTOR")

                // ---------------------------
                // TUTOR EMPRESA
                // ---------------------------
                it.requestMatchers(
                    "/applications/company-tutor/**"
                ).hasRole("COMPANY_TUTOR")

                // ---------------------------
                // ESTUDIANTE
                // ---------------------------
                it.requestMatchers(
                    "/student/**",
                    "/applications/student/**"
                ).hasRole("STUDENT")

                // ---------------------------
                // EL RESTO
                // ---------------------------
                it.anyRequest().authenticated()
            }
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter::class.java)

        return http.build()
    }

    @Bean
    fun corsConfig(): CorsConfigurationSource {
        val config = CorsConfiguration()
        config.allowedOrigins = listOf(
            "http://localhost:5173",
            "http://127.0.0.1:5173"
        )
        config.allowedMethods = listOf("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
        config.allowedHeaders = listOf("*")
        config.exposedHeaders = listOf("Authorization")
        config.allowCredentials = true

        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/**", config)
        return source
    }

    @Bean
    fun authenticationManager(configuration: AuthenticationConfiguration): AuthenticationManager {
        return configuration.authenticationManager
    }
}
