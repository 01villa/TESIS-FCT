package com.pasantia.pasantia.services

import com.pasantia.pasantia.dto.application.ApplicationDTO
import com.pasantia.pasantia.dto.application.CreateAssignmentDTO
import com.pasantia.pasantia.dto.application.UpdateApplicationStatusDTO
import com.pasantia.pasantia.entities.Application
import com.pasantia.pasantia.mappers.ApplicationMapper
import com.pasantia.pasantia.repositories.*
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.util.UUID

@Service
class ApplicationService(
    private val applicationRepository: ApplicationRepository,
    private val userRepository: UserRepository,
    private val studentRepository: StudentRepository,
    private val vacancyRepository: VacancyRepository,
    private val companyAdminRepository: CompanyAdminRepository
) {

    /**
     * Tutor de escuela asigna un estudiante a una vacante.
     */
    fun assignStudentToVacancy(
        currentUserEmail: String,
        dto: CreateAssignmentDTO
    ): ApplicationDTO {

        val tutorUser = userRepository.findByEmail(currentUserEmail)
            ?: throw RuntimeException("Usuario (tutor) no encontrado")

        val student = studentRepository.findById(dto.studentId)
            .orElseThrow { RuntimeException("Estudiante no encontrado") }

        val vacancy = vacancyRepository.findById(dto.vacancyId)
            .orElseThrow { RuntimeException("Vacante no encontrada") }

        // TODO: validar que el tutor pertenece a la misma escuela que el estudiante
        // TODO: validar que la vacante está abierta y tiene cupo

        val application = Application(
            vacancy = vacancy,
            student = student,
            schoolTutor = tutorUser,
            status = 1, // 1 = asignado por tutor escolar
            notes = dto.notes,
            appliedAt = LocalDateTime.now(),
            updatedAt = LocalDateTime.now()
        )

        val saved = applicationRepository.save(application)
        return ApplicationMapper.toDTO(saved)
    }

    /**
     * Listar asignaciones que creó el tutor de escuela logueado.
     */
    fun listForSchoolTutor(currentUserEmail: String): List<ApplicationDTO> {
        val tutorUser = userRepository.findByEmail(currentUserEmail)
            ?: throw RuntimeException("Usuario (tutor) no encontrado")

        val applications = applicationRepository.findBySchoolTutor(tutorUser)
        return applications.map { ApplicationMapper.toDTO(it) }
    }

    /**
     * Listar asignaciones de todas las vacantes de la empresa del company admin.
     */
    fun listForCompanyAdmin(currentUserEmail: String): List<ApplicationDTO> {
        val adminUser = userRepository.findByEmail(currentUserEmail)
            ?: throw RuntimeException("Usuario no encontrado")

        val companyAdmin = companyAdminRepository.findByUser(adminUser)
            ?: throw RuntimeException("El usuario no es administrador de empresa")

        val companyId = companyAdmin.company.id
            ?: throw RuntimeException("Empresa sin ID")

        val applications = applicationRepository.findByVacancyCompanyId(companyId)
        return applications.map { ApplicationMapper.toDTO(it) }
    }

    /**
     * Obtener una asignación, validando que pertenezca a la empresa del admin.
     */
    fun getForCompanyAdmin(currentUserEmail: String, applicationId: UUID): ApplicationDTO {
        val adminUser = userRepository.findByEmail(currentUserEmail)
            ?: throw RuntimeException("Usuario no encontrado")

        val companyAdmin = companyAdminRepository.findByUser(adminUser)
            ?: throw RuntimeException("El usuario no es administrador de empresa")

        val application = applicationRepository.findById(applicationId)
            .orElseThrow { RuntimeException("Asignación no encontrada") }

        if (application.vacancy.company.id != companyAdmin.company.id) {
            throw RuntimeException("No tiene acceso a esta asignación")
        }

        return ApplicationMapper.toDTO(application)
    }

    /**
     * Aprobar una asignación (empresa).
     */
    fun approveApplication(
        currentUserEmail: String,
        applicationId: UUID,
        dto: UpdateApplicationStatusDTO?
    ): ApplicationDTO {

        val adminUser = userRepository.findByEmail(currentUserEmail)
            ?: throw RuntimeException("Usuario no encontrado")

        val companyAdmin = companyAdminRepository.findByUser(adminUser)
            ?: throw RuntimeException("El usuario no es administrador de empresa")

        val application = applicationRepository.findById(applicationId)
            .orElseThrow { RuntimeException("Asignación no encontrada") }

        if (application.vacancy.company.id != companyAdmin.company.id) {
            throw RuntimeException("No tiene acceso a esta asignación")
        }

        val companyTutor = dto?.companyTutorId?.let { tutorId ->
            userRepository.findById(tutorId)
                .orElseThrow { RuntimeException("Tutor de empresa no encontrado") }
        }

        val updated = application.copy(
            status = 2, // 2 = aprobado por empresa
            companyTutor = companyTutor ?: application.companyTutor,
            notes = dto?.notes ?: application.notes,
            updatedAt = LocalDateTime.now()
        )

        val saved = applicationRepository.save(updated)
        return ApplicationMapper.toDTO(saved)
    }

    /**
     * Rechazar una asignación (empresa).
     */
    fun rejectApplication(
        currentUserEmail: String,
        applicationId: UUID,
        dto: UpdateApplicationStatusDTO?
    ): ApplicationDTO {

        val adminUser = userRepository.findByEmail(currentUserEmail)
            ?: throw RuntimeException("Usuario no encontrado")

        val companyAdmin = companyAdminRepository.findByUser(adminUser)
            ?: throw RuntimeException("El usuario no es administrador de empresa")

        val application = applicationRepository.findById(applicationId)
            .orElseThrow { RuntimeException("Asignación no encontrada") }

        if (application.vacancy.company.id != companyAdmin.company.id) {
            throw RuntimeException("No tiene acceso a esta asignación")
        }

        val updated = application.copy(
            status = 3, // 3 = rechazado por empresa
            notes = dto?.notes ?: application.notes,
            updatedAt = LocalDateTime.now()
        )

        val saved = applicationRepository.save(updated)
        return ApplicationMapper.toDTO(saved)
    }
}
