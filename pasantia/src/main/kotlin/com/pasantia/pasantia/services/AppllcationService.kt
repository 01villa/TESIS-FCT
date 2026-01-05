package com.pasantia.pasantia.services

import com.pasantia.pasantia.dto.application.ApplicationDTO
import com.pasantia.pasantia.dto.application.CreateAssignmentDTO
import com.pasantia.pasantia.entities.Application
import com.pasantia.pasantia.mappers.ApplicationMapper
import com.pasantia.pasantia.repositories.*
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime
import java.util.*

@Service
class ApplicationService(
    private val applicationRepository: ApplicationRepository,
    private val vacancyRepository: VacancyRepository,
    private val studentRepository: StudentRepository,
    private val userRepository: UserRepository,
    private val companyTutorRepository: CompanyTutorRepository
) {

    // ======================================================
    // 1) Asignar estudiante a vacante (Tutor Escolar)
    // ======================================================
    @Transactional
    fun assignStudentToVacancy(
        schoolTutorEmail: String,
        dto: CreateAssignmentDTO
    ): ApplicationDTO {

        val schoolTutor = userRepository.findByEmailAndActiveTrue(schoolTutorEmail)
            ?: throw IllegalArgumentException("School tutor not found")

        val vacancy = vacancyRepository.findByIdAndActiveTrue(dto.vacancyId)
            ?: throw IllegalArgumentException("Vacancy not found or inactive")

        val student = studentRepository.findById(dto.studentId)
            .orElseThrow { IllegalArgumentException("Student not found") }

        // Evita duplicar asignaciones activas
        if (applicationRepository.existsByStudentIdAndVacancyIdAndActiveTrue(student.id, vacancy.id)) {
            throw IllegalArgumentException("Student is already assigned to this vacancy")
        }

        val app = Application(
            vacancy = vacancy,
            student = student,
            schoolTutor = schoolTutor,
            companyTutor = null,
            status = 1,
            notes = dto.notes,
            active = true,
            deletedAt = null
        )

        return ApplicationMapper.toDTO(applicationRepository.save(app))
    }

    // ======================================================
    // 2) Listar asignaciones para tutor escolar
    // ======================================================
    fun listForSchoolTutor(email: String): List<ApplicationDTO> =
        applicationRepository.findAllBySchoolTutorEmailAndActiveTrue(email)
            .map { ApplicationMapper.toDTO(it) }

    // ======================================================
    // 3) Listar asignaciones para tutor de empresa (todas de su empresa)
    // ======================================================
    fun listForCompanyTutor(email: String): List<ApplicationDTO> {

        val tutorUser = userRepository.findByEmailAndActiveTrue(email)
            ?: throw IllegalArgumentException("Tutor not found")

        val companyTutor = companyTutorRepository.findByUser(tutorUser)
            ?: throw IllegalArgumentException("Tutor is not assigned to any company")

        val apps = applicationRepository
            .findAllByVacancyCompanyIdAndActiveTrue(companyTutor.company.id)

        return apps.map { ApplicationMapper.toDTO(it) }
    }

    // ======================================================
    // 4) Aprobación por tutor de empresa
    // ======================================================
    @Transactional
    fun approveByCompanyTutor(applicationId: UUID, companyTutorEmail: String): ApplicationDTO {

        val app = applicationRepository.findByIdAndActiveTrue(applicationId)
            ?: throw IllegalArgumentException("Application not found or inactive")

        val tutorUser = userRepository.findByEmailAndActiveTrue(companyTutorEmail)
            ?: throw IllegalArgumentException("Company tutor not found")

        val companyTutor = companyTutorRepository.findByUser(tutorUser)
            ?: throw IllegalArgumentException("Tutor does not belong to any company")

        // Validación: evitar aprobar aplicaciones de otras empresas
        if (app.vacancy.company.id != companyTutor.company.id) {
            throw IllegalAccessException("You cannot approve applications from another company")
        }

        // ✅ Si ya estaba aprobada, no vuelvas a descontar cupos
        if (app.status.toInt() == 2) {
            return ApplicationMapper.toDTO(app)
        }

        // ✅ Lock y actualización de cupos en VACANCY
        val vacancy = vacancyRepository.findByIdForUpdate(app.vacancy.id)
            ?: throw IllegalArgumentException("Vacancy not found or inactive")

        if (vacancy.status.toInt() != 1) {
            throw IllegalArgumentException("Vacancy is closed")
        }

        if (vacancy.capacity <= 0) {
            throw IllegalArgumentException("No available slots for this vacancy")
        }

        // ✅ Decrementa cupos
        vacancy.capacity = vacancy.capacity - 1

        // ✅ Si se quedó sin cupos, la puedes cerrar automáticamente (opcional pero recomendado)
        if (vacancy.capacity == 0) {
            vacancy.status = 2.toShort() // cerrada
        }

        vacancy.updatedAt = LocalDateTime.now()
        vacancyRepository.save(vacancy)

        // ✅ Actualiza aplicación
        app.companyTutor = tutorUser
        app.status = 2
        app.updatedAt = LocalDateTime.now()

        return ApplicationMapper.toDTO(applicationRepository.save(app))
    }

    // ======================================================
    // 5) Rechazo por tutor de empresa
    // ======================================================
    @Transactional
    fun rejectByCompanyTutor(applicationId: UUID, companyTutorEmail: String, notes: String?): ApplicationDTO {

        val app = applicationRepository.findByIdAndActiveTrue(applicationId)
            ?: throw IllegalArgumentException("Application not found or inactive")

        val tutorUser = userRepository.findByEmailAndActiveTrue(companyTutorEmail)
            ?: throw IllegalArgumentException("Company tutor not found")

        val companyTutor = companyTutorRepository.findByUser(tutorUser)
            ?: throw IllegalArgumentException("Tutor does not belong to any company")

        if (app.vacancy.company.id != companyTutor.company.id) {
            throw IllegalAccessException("You cannot reject applications from another company")
        }

        app.companyTutor = tutorUser
        app.status = 3
        app.notes = notes
        app.updatedAt = LocalDateTime.now()

        return ApplicationMapper.toDTO(applicationRepository.save(app))
    }

    // ======================================================
    // 6) Listar asignaciones para estudiante
    // ======================================================
    fun listForStudent(studentId: UUID): List<ApplicationDTO> =
        applicationRepository.findAllByStudentIdAndActiveTrue(studentId)
            .map { ApplicationMapper.toDTO(it) }

    // ======================================================
    // 7) Soft delete
    // ======================================================
    @Transactional
    fun softDelete(id: UUID) {
        val app = applicationRepository.findByIdAndActiveTrue(id)
            ?: throw IllegalArgumentException("Application not found or already inactive")

        app.active = false
        app.deletedAt = LocalDateTime.now()

        applicationRepository.save(app)
    }

    // ======================================================
    // 8) Restore
    // ======================================================
    @Transactional
    fun restore(id: UUID) {
        val app = applicationRepository.findById(id)
            .orElseThrow { IllegalArgumentException("Application not found") }

        app.active = true
        app.deletedAt = null

        applicationRepository.save(app)
    }
}
