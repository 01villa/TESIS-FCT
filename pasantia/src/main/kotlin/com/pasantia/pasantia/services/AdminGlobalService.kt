package com.pasantia.pasantia.services

import com.pasantia.pasantia.dto.admin.CreateAdminForEntityDTO
import com.pasantia.pasantia.dto.admin.CreateCompanyDTO
import com.pasantia.pasantia.dto.admin.CreateSchoolDTO
import com.pasantia.pasantia.dto.CreateUserDTO
import com.pasantia.pasantia.dto.CompanyDTO
import com.pasantia.pasantia.dto.SchoolDTO
import com.pasantia.pasantia.dto.UserDTO
import com.pasantia.pasantia.entities.*
import com.pasantia.pasantia.mappers.CompanyMapper
import com.pasantia.pasantia.mappers.SchoolMapper
import com.pasantia.pasantia.repositories.*
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.util.*

@Service
class AdminGlobalService(
    private val schoolRepository: SchoolRepository,
    private val companyRepository: CompanyRepository,
    private val schoolAdminRepository: SchoolAdminRepository,
    private val companyAdminRepository: CompanyAdminRepository,
    private val userService: UserService,
    private val roleRepository: RoleRepository,
    private val userRoleRepository: UserRoleRepository,
    private val userRepository: UserRepository
) {

    /** -------------------------
     *  CREAR ESCUELA
     *  ------------------------- */
    fun createSchool(dto: CreateSchoolDTO): School {

        val school = School(
            name = dto.name,
            address = dto.address,
            createdBy = null,
            createdAt = LocalDateTime.now()
        )

        return schoolRepository.save(school)
    }

    /** -------------------------
     *  CREAR EMPRESA
     *  ------------------------- */
    fun createCompany(dto: CreateCompanyDTO): Company {

        val company = Company(
            name = dto.name,
            address = dto.address,
            createdBy = null,
            createdAt = LocalDateTime.now()
        )

        return companyRepository.save(company)
    }

    /** -------------------------
     *  CREAR ADMIN DE ESCUELA
     *  ------------------------- */
    fun createSchoolAdmin(schoolId: UUID, dto: CreateAdminForEntityDTO): User {

        val school = schoolRepository.findById(schoolId)
            .orElseThrow { IllegalArgumentException("School not found") }

        val createUserDTO = CreateUserDTO(
            email = dto.email,
            fullName = dto.fullName,
            password = dto.password
        )

        val user = userService.createUser(createUserDTO)

        val role = roleRepository.findByName("SCHOOL_ADMIN")
            ?: throw IllegalStateException("Role SCHOOL_ADMIN not found")

        userRoleRepository.save(
            UserRole(
                id = UserRoleId(user.id!!, role.id),
                user = user,
                role = role
            )
        )

        schoolAdminRepository.save(
            SchoolAdmin(
                school = school,
                user = user,
                createdAt = LocalDateTime.now()
            )
        )

        return user
    }

    /** -------------------------
     *  CREAR ADMIN DE EMPRESA
     *  ------------------------- */
    fun createCompanyAdmin(companyId: UUID, dto: CreateAdminForEntityDTO): User {

        val company = companyRepository.findById(companyId)
            .orElseThrow { IllegalArgumentException("Company not found") }

        val createUserDTO = CreateUserDTO(
            email = dto.email,
            fullName = dto.fullName,
            password = dto.password
        )

        val user = userService.createUser(createUserDTO)

        val role = roleRepository.findByName("COMPANY_ADMIN")
            ?: throw IllegalStateException("Role COMPANY_ADMIN not found")

        userRoleRepository.save(
            UserRole(
                id = UserRoleId(user.id!!, role.id),
                user = user,
                role = role
            )
        )

        companyAdminRepository.save(
            CompanyAdmin(
                company = company,
                user = user,
                createdAt = LocalDateTime.now()
            )
        )

        return user
    }

    /** -------------------------
     *  LISTAR ESCUELAS
     *  ------------------------- */
    fun listSchools(): List<SchoolDTO> =
        schoolRepository.findAll().map { SchoolMapper.toDTO(it) }

    /** -------------------------
     *  LISTAR EMPRESAS
     *  ------------------------- */
    fun listCompanies(): List<CompanyDTO> =
        companyRepository.findAll().map { CompanyMapper.toDTO(it) }

    /** -------------------------
     *  LISTAR ADMINS DE ESCUELA
     *  ------------------------- */
    fun listSchoolAdmins(): List<UserDTO> {
        val users = userRepository.findSchoolAdmins()
        return users.map { userService.getUserDTOWithRoles(it) }
    }

    /** -------------------------
     *  LISTAR ADMINS DE EMPRESA
     *  ------------------------- */
    fun listCompanyAdmins(): List<UserDTO> {
        val users = userRepository.findCompanyAdmins()
        return users.map { userService.getUserDTOWithRoles(it) }
    }
}
