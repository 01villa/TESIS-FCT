package com.pasantia.pasantia.services

import com.pasantia.pasantia.dto.application.ApplicationDTO
import com.pasantia.pasantia.dto.application.CreateAssignmentDTO
import com.pasantia.pasantia.dto.application.FinishApplicationDTO
import com.pasantia.pasantia.dto.application.GradeApplicationDTO
import com.pasantia.pasantia.entities.Application
import com.pasantia.pasantia.entities.ApplicationStatus
import com.pasantia.pasantia.mappers.ApplicationMapper
import com.pasantia.pasantia.repositories.*
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.math.BigDecimal
import java.time.LocalDateTime
import java.util.UUID

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
            status = ApplicationStatus.ASSIGNED,
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
        if (app.status == ApplicationStatus.APPROVED_BY_COMPANY) {
            return ApplicationMapper.toDTO(app)
        }

        // (Opcional pero recomendado) Solo permitir aprobar si estaba asignada
        if (app.status != ApplicationStatus.ASSIGNED) {
            throw IllegalArgumentException("Only ASSIGNED applications can be approved")
        }

        // ✅ Lock y actualización de cupos en VACANCY
        val vacancy = vacancyRepository.findByIdForUpdate(app.vacancy.id)
            ?: throw IllegalArgumentException("Vacancy not found or inactive")

        // OJO: aquí Vacancy sigue con Short status según tu código existente
        if (vacancy.status.toInt() != 1) {
            throw IllegalArgumentException("Vacancy is closed")
        }

        if (vacancy.capacity <= 0) {
            throw IllegalArgumentException("No available slots for this vacancy")
        }

        // ✅ Decrementa cupos
        vacancy.capacity = vacancy.capacity - 1

        // ✅ Si se quedó sin cupos, la puedes cerrar automáticamente (opcional)
        if (vacancy.capacity == 0) {
            vacancy.status = 2.toShort() // cerrada
        }

        vacancy.updatedAt = LocalDateTime.now()
        vacancyRepository.save(vacancy)

        // ✅ Actualiza aplicación
        app.companyTutor = tutorUser
        app.status = ApplicationStatus.APPROVED_BY_COMPANY
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

        // (Opcional) Solo permitir rechazar si estaba asignada
        if (app.status != ApplicationStatus.ASSIGNED) {
            throw IllegalArgumentException("Only ASSIGNED applications can be rejected")
        }

        app.companyTutor = tutorUser
        app.status = ApplicationStatus.REJECTED_BY_COMPANY
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
    @Transactional
    fun finishByCompanyTutor(
        applicationId: UUID,
        companyTutorEmail: String,
        dto: FinishApplicationDTO
    ): ApplicationDTO {
        val app = applicationRepository.findByIdAndActiveTrue(applicationId)
            ?: throw IllegalArgumentException("Application not found or inactive")

        val tutorUser = userRepository.findByEmailAndActiveTrue(companyTutorEmail)
            ?: throw IllegalArgumentException("Company tutor not found")

        val companyTutor = companyTutorRepository.findByUser(tutorUser)
            ?: throw IllegalArgumentException("Tutor does not belong to any company")

        // ✅ Solo su empresa
        if (app.vacancy.company.id != companyTutor.company.id) {
            throw IllegalAccessException("You cannot finish applications from another company")
        }

        // ✅ Solo si estaba aprobada por empresa
        if (app.status != ApplicationStatus.APPROVED_BY_COMPANY) {
            throw IllegalArgumentException("Only approved applications can be finished")
        }

        // ✅ finalizar
        app.status = ApplicationStatus.FINISHED
        app.finalFeedback = dto.finalFeedback?.trim()?.takeIf { it.isNotBlank() }
        app.finishedAt = LocalDateTime.now()
        app.updatedAt = LocalDateTime.now()

        return ApplicationMapper.toDTO(applicationRepository.save(app))
    }


    // ======================================================
    // 8) Calificar pasantía (Tutor Escolar)
    // ======================================================
    @Transactional
    fun gradeBySchoolTutor(applicationId: UUID, schoolTutorEmail: String, dto: GradeApplicationDTO): ApplicationDTO {

        val app = applicationRepository.findByIdAndActiveTrue(applicationId)
            ?: throw IllegalArgumentException("Application not found or inactive")

        val tutor = userRepository.findByEmailAndActiveTrue(schoolTutorEmail)
            ?: throw IllegalArgumentException("School tutor not found")

        if (app.schoolTutor.id != tutor.id) {
            throw IllegalAccessException("You cannot grade applications from another tutor")
        }

        if (app.status != ApplicationStatus.FINISHED) {
            throw IllegalArgumentException("Application must be finished before grading")
        }

        // Validación básica (ajusta rango si usas 0-20, 0-100, etc.)
        if (dto.finalGrade < BigDecimal.ZERO || dto.finalGrade > BigDecimal("10.00")) {
            throw IllegalArgumentException("finalGrade must be between 0 and 10")
        }

        app.finalGrade = dto.finalGrade
        if (!dto.finalFeedback.isNullOrBlank()) {
            app.finalFeedback = dto.finalFeedback
        }

        app.gradedAt = LocalDateTime.now()
        app.gradedBy = tutor.id
        app.status = ApplicationStatus.GRADED
        app.updatedAt = LocalDateTime.now()

        return ApplicationMapper.toDTO(applicationRepository.save(app))
    }

    // ======================================================
    // 9) Soft delete
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
    // 10) Restore
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
