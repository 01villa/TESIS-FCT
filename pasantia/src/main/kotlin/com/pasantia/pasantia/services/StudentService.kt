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
import java.util.UUID

@Service
class StudentService(
    private val studentRepository: StudentRepository,
    private val schoolRepository: SchoolRepository,
    private val userRepository: UserRepository,
    private val roleRepository: RoleRepository,
    private val userRoleRepository: UserRoleRepository,
    private val specialtyRepository: SpecialtyRepository, // 👈 NUEVO
    private val passwordEncoder: PasswordEncoder,
    private val userService: UserService
) {

    // ============================================================
    // CREATE
    // ============================================================
    @Transactional
    fun createStudent(schoolId: UUID, dto: CreateStudentDTO): StudentDTO {

        if (userRepository.existsByEmail(dto.email))
            throw IllegalArgumentException("Email already registered")

        if (studentRepository.findAll().any { it.ci == dto.ci && it.active })
            throw IllegalArgumentException("Student with this CI already exists")

        val school = schoolRepository.findByIdAndActiveTrue(schoolId)
            ?: throw IllegalArgumentException("School not found or inactive")

        val specialty = specialtyRepository.findById(dto.specialtyId)
            .orElseThrow { IllegalArgumentException("Specialty not found") }

        val user = User(
            email = dto.email,
            fullName = "${dto.firstName} ${dto.lastName}",
            passwordHash = passwordEncoder.encode(dto.password),
            active = true,
            deletedAt = null
        )

        userRepository.save(user)

        val studentRole = roleRepository.findByName("STUDENT")
            ?: throw IllegalArgumentException("Role STUDENT not found")

        userRoleRepository.save(
            UserRole(
                id = UserRoleId(user.id!!, studentRole.id),
                user = user,
                role = studentRole
            )
        )

        val student = Student(
            school = school,
            user = user,
            specialty = specialty, // 👈 CONEXIÓN REAL
            firstName = dto.firstName,
            lastName = dto.lastName,
            ci = dto.ci,
            phone = dto.phone,
            active = true,
            deletedAt = null
        )

        studentRepository.save(student)

        return StudentMapper.toDTO(student)
    }

    // ============================================================
    // READ
    // ============================================================
    fun listStudents(): List<StudentDTO> =
        studentRepository.findAllByActiveTrue()
            .map { StudentMapper.toDTO(it) }

    fun listBySchool(schoolId: UUID): List<StudentDTO> =
        studentRepository.findAllBySchoolIdAndActiveTrue(schoolId)
            .map { StudentMapper.toDTO(it) }

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

        // 👉 cambio de especialidad (si viene)
        dto.specialtyId?.let {
            val specialty = specialtyRepository.findById(it)
                .orElseThrow { IllegalArgumentException("Specialty not found") }
            student.specialty = specialty
        }

        student.updatedAt = LocalDateTime.now()

        // sincronizar nombre con User
        student.user.fullName = "${student.firstName} ${student.lastName}"

        return StudentMapper.toDTO(student)
    }

    private fun validateCIUnique(studentId: UUID, ci: String) {
        val exists = studentRepository.findAllByActiveTrue()
            .any { it.ci == ci && it.id != studentId }
        if (exists) throw IllegalArgumentException("CI already used by another student")
    }

    // ============================================================
    // DELETE (SOFT DELETE)
    // ============================================================
    @Transactional
    fun deleteStudent(id: UUID) {
        val student = studentRepository.findByIdAndActiveTrue(id)
            ?: throw IllegalArgumentException("Student not found or already inactive")

        // fuente de verdad
        userService.softDeleteUser(student.user.id!!)

        student.active = false
        student.deletedAt = LocalDateTime.now()
    }

    // ============================================================
    // RESTORE
    // ============================================================
    @Transactional
    fun restore(id: UUID) {
        val student = studentRepository.findById(id)
            .orElseThrow { IllegalArgumentException("Student not found") }

        userService.restoreUser(student.user.id!!)

        student.active = true
        student.deletedAt = null
    }
}
