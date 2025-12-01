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
            .authorizeHttpRequests {

                // ---------------------------
                // PÚBLICO
                // ---------------------------
                it.requestMatchers("/auth/**").permitAll()

                // ---------------------------
                // ADMIN GENERAL
                // ---------------------------
                it.requestMatchers(
                    "/students/**",
                    "/applications/**",
                    "/vacancies/**"
                ).hasRole("ADMIN")

                // ---------------------------
                // ESCUELAS
                // ---------------------------
                it.requestMatchers("/schools/**")
                    .hasAnyRole("ADMIN", "SCHOOL_ADMIN")

                // ADMINISTRACIÓN DE ESCUELAS
                it.requestMatchers(
                    "/admin/schools/**",
                    "/admin/school-admins/**",
                    "/admin/school-tutors/**",
                    "/admin/students/**"
                ).hasAnyRole("ADMIN", "SCHOOL_ADMIN")

                // ---------------------------
                // EMPRESAS
                // ---------------------------
                it.requestMatchers("/companies/**")
                    .hasAnyRole("ADMIN", "COMPANY_ADMIN")

                it.requestMatchers("/admin/companies/**")
                    .hasAnyRole("ADMIN", "COMPANY_ADMIN")

                // ---------------------------
                // TUTOR ESCOLAR
                // ---------------------------
                it.requestMatchers(
                    "/applications/school-tutor/**"
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
                // RESTO
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
