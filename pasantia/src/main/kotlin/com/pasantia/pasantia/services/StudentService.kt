package com.pasantia.pasantia.services

import com.pasantia.pasantia.dto.student.CreateStudentDTO
import com.pasantia.pasantia.dto.student.StudentDTO
import com.pasantia.pasantia.dto.student.UpdateStudentDTO
import com.pasantia.pasantia.entities.Student
import com.pasantia.pasantia.entities.User
import com.pasantia.pasantia.entities.UserRole
import com.pasantia.pasantia.entities.UserRoleId
import com.pasantia.pasantia.mappers.StudentMapper
import com.pasantia.pasantia.repositories.*
import jakarta.transaction.Transactional
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.util.*

@Service
class StudentService(
    private val studentRepository: StudentRepository,
    private val schoolRepository: SchoolRepository,
    private val userRepository: UserRepository,
    private val roleRepository: RoleRepository,
    private val userRoleRepository: UserRoleRepository,
    private val passwordEncoder: PasswordEncoder
) {

    // ============================================================
    // CREATE STUDENT (User + Role + Student)
    // ============================================================
    @Transactional
    fun createStudent(schoolId: UUID, dto: CreateStudentDTO): StudentDTO {

        // Validar duplicados
        if (userRepository.existsByEmail(dto.email))
            throw IllegalArgumentException("Email already registered")

        if (studentRepository.findAll().any { it.ci == dto.ci && it.active })
            throw IllegalArgumentException("Student with this CI already exists")

        val school = schoolRepository.findByIdAndActiveTrue(schoolId)
            ?: throw IllegalArgumentException("School not found or inactive")

        // ===== Crear User asociado ===== //
        val user = User(
            email = dto.email,
            fullName = "${dto.firstName} ${dto.lastName}",
            passwordHash = passwordEncoder.encode(dto.password),
            active = true,
            deletedAt = null
        )

        val savedUser = userRepository.save(user)

        // ===== Asignar rol STUDENT ===== //
        val studentRole = roleRepository.findByName("STUDENT")
            ?: throw IllegalArgumentException("Role STUDENT not found")

        userRoleRepository.save(
            UserRole(
                id = UserRoleId(savedUser.id!!, studentRole.id),
                user = savedUser,
                role = studentRole
            )
        )

        // ===== Crear Student ===== //
        val student = Student(
            school = school,
            user = savedUser,
            firstName = dto.firstName,
            lastName = dto.lastName,
            ci = dto.ci,
            phone = dto.phone,
            active = true,
            deletedAt = null
        )

        val savedStudent = studentRepository.save(student)

        return StudentMapper.toDTO(savedStudent)
    }

    // ============================================================
    // LIST STUDENTS (solo activos)
    // ============================================================
    fun listStudents(): List<StudentDTO> =
        studentRepository.findAllByActiveTrue()
            .map { StudentMapper.toDTO(it) }

    fun listBySchool(schoolId: UUID): List<StudentDTO> =
        studentRepository.findAllBySchoolIdAndActiveTrue(schoolId)
            .map { StudentMapper.toDTO(it) }

    // ============================================================
    // GET ONE
    // ============================================================
    fun getStudent(id: UUID): StudentDTO {
        val student = studentRepository.findByIdAndActiveTrue(id)
            ?: throw IllegalArgumentException("Student not found or inactive")
        return StudentMapper.toDTO(student)
    }

    // ============================================================
    // UPDATE
    // ============================================================
    @Transactional
    fun updateStudent(id: UUID, dto: UpdateStudentDTO): StudentDTO {

        val student = studentRepository.findByIdAndActiveTrue(id)
            ?: throw IllegalArgumentException("Student not found or inactive")

        dto.firstName?.let { student.firstName = it }
        dto.lastName?.let { student.lastName = it }
        dto.ci?.let {
            validateCIUnique(student.id, it)
            student.ci = it
        }
        dto.phone?.let { student.phone = it }

        student.updatedAt = LocalDateTime.now()

        studentRepository.save(student)

        // Actualizar nombre en User también
        student.user.fullName = "${student.firstName} ${student.lastName}"
        userRepository.save(student.user)

        return StudentMapper.toDTO(student)
    }

    private fun validateCIUnique(studentId: UUID, ci: String) {
        val exists = studentRepository.findAllByActiveTrue()
            .any { it.ci == ci && it.id != studentId }
        if (exists) throw IllegalArgumentException("CI already used by another student")
    }

    // ============================================================
    // SOFT DELETE
    // ============================================================
    @Transactional
    fun softDelete(id: UUID) {
        val student = studentRepository.findByIdAndActiveTrue(id)
            ?: throw IllegalArgumentException("Student not found or already inactive")

        student.active = false
        student.deletedAt = LocalDateTime.now()

        studentRepository.save(student)
    }

    // ============================================================
    // RESTORE
    // ============================================================
    @Transactional
    fun restore(id: UUID) {
        val student = studentRepository.findById(id)
            .orElseThrow { IllegalArgumentException("Student not found") }

        student.active = true
        student.deletedAt = null

        studentRepository.save(student)
    }
}
