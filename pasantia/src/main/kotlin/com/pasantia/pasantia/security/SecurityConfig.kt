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

                // Público
                it.requestMatchers("/auth/**").permitAll()

                // ADMIN puede ver todo el dashboard
                it.requestMatchers(
                    "/students/**",
                    "/companies/**",
                    "/schools/**",
                    "/applications/**",
                    "/vacancies/**"
                ).hasAnyRole("ADMIN")

                // /admin/**
                it.requestMatchers("/admin/**").hasRole("ADMIN")

                // Student
                it.requestMatchers("/student/**").hasRole("STUDENT")
                it.requestMatchers("/applications/student/**").hasRole("STUDENT")

                // Tutor escolar
                it.requestMatchers(
                    "/applications/assign",
                    "/applications/school-tutor",
                    "/applications/school-tutor/**"
                ).hasRole("SCHOOL_TUTOR")

                // Tutor empresa
                it.requestMatchers(
                    "/applications/company-tutor",
                    "/applications/company-tutor/**",
                    "/applications/*/approve",
                    "/applications/*/reject"
                ).hasRole("COMPANY_TUTOR")

                // Resto → autenticado
                it.anyRequest().authenticated()
            }

            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter::class.java)

        return http.build()
    }

    @Bean
    fun corsConfig(): CorsConfigurationSource {
        val config = CorsConfiguration()
        // Ajusta estos orígenes según tu frontend
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
