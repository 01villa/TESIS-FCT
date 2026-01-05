package com.pasantia.pasantia.security

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
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

                // -------------------------------------------------
                // PUBLIC
                // -------------------------------------------------
                it.requestMatchers("/auth/**").permitAll()
                it.requestMatchers("/uploads/**").permitAll()
                it.requestMatchers("/api/public/**").permitAll()

                // ============================
                // ADMIN GENERAL
                // ============================
                it.requestMatchers("/admin/audit-logs/**").hasRole("ADMIN")
                it.requestMatchers("/students/**")
                    .hasRole("ADMIN")

                // ============================
                // COLEGIOS
                // ============================

                // CRUD completo solo para ADMIN + SCHOOL_ADMIN
                it.requestMatchers(
                    "/admin/schools/**",
                    "/admin/school-admins/**",
                    "/admin/school-tutors/**"
                ).hasAnyRole("ADMIN", "SCHOOL_ADMIN")

                // Listado general
                it.requestMatchers("/schools/**")
                    .hasAnyRole("ADMIN", "SCHOOL_ADMIN")

                // Students administración
                it.requestMatchers("/admin/students/**")
                    .hasAnyRole("ADMIN", "SCHOOL_ADMIN", "SCHOOL_TUTOR")


                // ============================
                // EMPRESAS
                // ============================

                // CRUD total de empresas
                it.requestMatchers("/admin/companies/**")
                    .hasAnyRole("ADMIN", "COMPANY_ADMIN")

                // Panel personal empresa
                it.requestMatchers("/company/**")
                    .hasRole("COMPANY_ADMIN")


                // ============================
                // VACANTES
                // ============================

                // Crear vacante
                it.requestMatchers(HttpMethod.POST, "/vacancies/company/**")
                    .hasAnyRole("COMPANY_ADMIN", "COMPANY_TUTOR", "ADMIN")

                // Listado general abierto para todos estos roles
                it.requestMatchers(HttpMethod.GET, "/vacancies")
                    .hasAnyRole("ADMIN", "SCHOOL_TUTOR", "COMPANY_ADMIN", "COMPANY_TUTOR", "STUDENT")

                // Listado por empresa
                it.requestMatchers(HttpMethod.GET, "/vacancies/company/**")
                    .hasAnyRole("COMPANY_ADMIN", "COMPANY_TUTOR", "ADMIN")

                // Detalle de vacante
                it.requestMatchers(HttpMethod.GET, "/vacancies/**")
                    .hasAnyRole("ADMIN", "SCHOOL_TUTOR", "COMPANY_ADMIN", "COMPANY_TUTOR", "STUDENT")

                // Editar / cerrar / abrir
                it.requestMatchers(HttpMethod.PUT, "/vacancies/**")
                    .hasAnyRole("COMPANY_ADMIN", "COMPANY_TUTOR", "ADMIN")

                it.requestMatchers(HttpMethod.PATCH, "/vacancies/**")
                    .hasAnyRole("COMPANY_ADMIN", "COMPANY_TUTOR", "ADMIN")

                it.requestMatchers(HttpMethod.DELETE, "/vacancies/**")
                    .hasAnyRole("COMPANY_ADMIN", "COMPANY_TUTOR", "ADMIN")


                // ============================
                // TUTOR ESCOLAR
                // ============================
                it.requestMatchers(
                    "/applications/school-tutor/**",
                    "/applications/assign"
                ).hasRole("SCHOOL_TUTOR")


                // ============================
                // TUTOR EMPRESA
                // ============================
                it.requestMatchers("/applications/company-tutor/**")
                    .hasRole("COMPANY_TUTOR")


                // ============================
                // STUDENT
                // ============================
                it.requestMatchers(
                    "/student/**",
                    "/applications/student/**"
                ).hasRole("STUDENT")


                // ============================
                // API NUEVOS (studentsApi / usersApi)
                // ============================

                // GET /students   ← listado básico general
                it.requestMatchers(HttpMethod.GET, "/students")
                    .hasAnyRole("ADMIN", "SCHOOL_ADMIN", "SCHOOL_TUTOR", "COMPANY_ADMIN", "COMPANY_TUTOR")

                // GET /users/basic
                it.requestMatchers(HttpMethod.GET, "/users/basic")
                    .hasAnyRole("ADMIN", "SCHOOL_ADMIN", "SCHOOL_TUTOR", "COMPANY_ADMIN", "COMPANY_TUTOR")

                it.requestMatchers(
                    HttpMethod.PATCH,
                    "/admin/users/**"
                ).hasRole("ADMIN")



                // ============================
                // DEFAULT
                // ============================
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
