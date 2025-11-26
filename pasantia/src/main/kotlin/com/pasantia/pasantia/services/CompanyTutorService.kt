package com.pasantia.pasantia.services

import com.pasantia.pasantia.dto.CompanyTutorDTO
import com.pasantia.pasantia.dto.CreateCompanyTutorDTO
import com.pasantia.pasantia.entities.CompanyTutor
import com.pasantia.pasantia.entities.User
import com.pasantia.pasantia.entities.UserRole
import com.pasantia.pasantia.entities.UserRoleId
import com.pasantia.pasantia.mappers.CompanyTutorMapper
import com.pasantia.pasantia.repositories.*
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import java.time.LocalDateTime

@Service
class CompanyTutorService(
    private val userRepository: UserRepository,
    private val roleRepository: RoleRepository,
    private val userRoleRepository: UserRoleRepository,
    private val companyTutorRepository: CompanyTutorRepository,
    private val companyAdminRepository: CompanyAdminRepository,
    private val passwordEncoder: PasswordEncoder
) {

    /**
     * Crear tutor empresarial desde el token del Company Admin
     */
    fun createTutorForCompanyAdmin(currentUserEmail: String, dto: CreateCompanyTutorDTO): CompanyTutorDTO {

        // 1. Usuario logueado
        val adminUser = userRepository.findByEmail(currentUserEmail)
            ?: throw RuntimeException("Usuario no encontrado (token inválido)")

        // 2. Buscar su CompanyAdmin
        val companyAdmin = companyAdminRepository.findByUser(adminUser)
            ?: throw RuntimeException("Este usuario no es administrador de empresa")

        val company = companyAdmin.company

        // 3. Validar correo único
        if (userRepository.existsByEmail(dto.email)) {
            throw RuntimeException("Ya existe un usuario con ese correo")
        }

        // 4. Crear usuario del tutor
        val tutorUser = User(
            email = dto.email,
            passwordHash = passwordEncoder.encode(dto.password),
            fullName = dto.fullName,
            status = 1,
            createdAt = LocalDateTime.now(),
            updatedAt = LocalDateTime.now()
        )
        val savedTutorUser = userRepository.save(tutorUser)

        // 5. Asignar rol COMPANY_TUTOR
        val tutorRole = roleRepository.findByName("COMPANY_TUTOR")
            ?: throw RuntimeException("Rol COMPANY_TUTOR no existe")

        // Clave compuesta: user_id + role_id
        val userRoleId = UserRoleId(
            userId = savedTutorUser.id!!,
            roleId = tutorRole.id
        )

        userRoleRepository.save(
            UserRole(
                id = userRoleId,
                user = savedTutorUser,
                role = tutorRole
            )
        )

        // 6. Crear tutor empresarial
        val tutor = CompanyTutor(
            company = company,
            user = savedTutorUser,
            phone = dto.phone
        )

        val savedTutor = companyTutorRepository.save(tutor)

        // 7. Convertir a DTO PARA EVITAR LAZY LOADING
        return CompanyTutorMapper.toDTO(savedTutor)
    }

    /**
     * Listar todos los tutores de la empresa del admin logueado
     */
    fun listTutorsForCompanyAdmin(currentUserEmail: String): List<CompanyTutorDTO> {

        val adminUser = userRepository.findByEmail(currentUserEmail)
            ?: throw RuntimeException("Usuario no encontrado")

        val companyAdmin = companyAdminRepository.findByUser(adminUser)
            ?: throw RuntimeException("No es administrador de empresa")

        val tutors = companyTutorRepository.findByCompanyId(companyAdmin.company.id!!)

        // Convertimos a DTO para evitar errores de serialización
        return tutors.map { CompanyTutorMapper.toDTO(it) }
    }
}
