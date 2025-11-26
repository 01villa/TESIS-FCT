package com.pasantia.pasantia.services

import com.pasantia.pasantia.dto.CreateSchoolTutorDTO
import com.pasantia.pasantia.dto.SchoolTutorDTO
import com.pasantia.pasantia.entities.SchoolTutor
import com.pasantia.pasantia.entities.User
import com.pasantia.pasantia.entities.UserRole
import com.pasantia.pasantia.entities.UserRoleId
import com.pasantia.pasantia.mappers.SchoolTutorMapper
import com.pasantia.pasantia.repositories.*
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import java.time.LocalDateTime

@Service
class SchoolTutorService(
    private val userRepository: UserRepository,
    private val schoolRepository: SchoolRepository,
    private val schoolAdminRepository: SchoolAdminRepository,
    private val schoolTutorRepository: SchoolTutorRepository,
    private val roleRepository: RoleRepository,
    private val userRoleRepository: UserRoleRepository,
    private val passwordEncoder: PasswordEncoder
) {

    /**
     * Crear tutor escolar desde el token del SCHOOL_ADMIN
     */
    fun createTutor(currentUserEmail: String, dto: CreateSchoolTutorDTO): SchoolTutorDTO {

        // 1. Usuario logueado
        val adminUser = userRepository.findByEmail(currentUserEmail)
            ?: throw RuntimeException("Usuario no encontrado")

        // 2. Validar que sea SCHOOL_ADMIN
        val schoolAdmin = schoolAdminRepository.findByUser(adminUser)
            ?: throw RuntimeException("No tiene permisos para crear tutores escolares")

        val school = schoolAdmin.school

        // 3. Validar que el correo no exista
        if (userRepository.existsByEmail(dto.email)) {
            throw RuntimeException("Ese correo ya está registrado")
        }

        // 4. Crear usuario del tutor escolar
        val tutorUser = User(
            email = dto.email,
            fullName = dto.fullName,
            passwordHash = passwordEncoder.encode(dto.password),
            status = 1,
            createdAt = LocalDateTime.now(),
            updatedAt = LocalDateTime.now()
        )
        val savedUser = userRepository.save(tutorUser)

        // 5. Asignar rol SCHOOL_TUTOR
        val role = roleRepository.findByName("SCHOOL_TUTOR")
            ?: throw RuntimeException("No existe el rol SCHOOL_TUTOR")

        val userRole = UserRole(
            id = UserRoleId(
                userId = savedUser.id!!,
                roleId = role.id
            ),
            user = savedUser,
            role = role
        )
        userRoleRepository.save(userRole)

        // 6. Crear tutor escolar en la tabla school_tutors
        val tutor = SchoolTutor(
            school = school,
            user = savedUser,
            phone = dto.phone
        )

        val savedTutor = schoolTutorRepository.save(tutor)

        // 7. Respuesta DTO para evitar LAZY FAILS
        return SchoolTutorMapper.toDTO(savedTutor)
    }

    /**
     * Listar todos los tutores escolares de la escuela del admin logueado
     */
    fun listTutors(currentUserEmail: String): List<SchoolTutorDTO> {

        val adminUser = userRepository.findByEmail(currentUserEmail)
            ?: throw RuntimeException("Usuario no encontrado")

        val schoolAdmin = schoolAdminRepository.findByUser(adminUser)
            ?: throw RuntimeException("No tiene permisos para listar tutores")

        val schoolId = schoolAdmin.school.id!!

        val tutors = schoolTutorRepository.findBySchoolId(schoolId)

        return tutors.map { SchoolTutorMapper.toDTO(it) }
    }
}
