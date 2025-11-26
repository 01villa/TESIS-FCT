package com.pasantia.pasantia.services

import com.pasantia.pasantia.dto.student.CreateStudentDTO
import com.pasantia.pasantia.dto.student.StudentDTO
import com.pasantia.pasantia.dto.student.UpdateStudentDTO
import com.pasantia.pasantia.entities.Student
import com.pasantia.pasantia.mappers.StudentMapper
import com.pasantia.pasantia.repositories.SchoolTutorRepository
import com.pasantia.pasantia.repositories.StudentRepository
import com.pasantia.pasantia.repositories.UserRepository
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.util.UUID

@Service
class StudentService(
    private val studentRepository: StudentRepository,
    private val userRepository: UserRepository,
    private val schoolTutorRepository: SchoolTutorRepository
) {

    // ====================================================
    // CREATE STUDENT
    // ====================================================
    fun createStudent(currentUserEmail: String, dto: CreateStudentDTO): StudentDTO {

        val tutorUser = userRepository.findByEmail(currentUserEmail)
            ?: throw RuntimeException("Tutor no encontrado")

        val schoolTutor = schoolTutorRepository.findByUser(tutorUser)
            ?: throw RuntimeException("El usuario no es tutor escolar")

        // Validar unicidad de CI
        if (studentRepository.existsByCi(dto.ci)) {
            throw RuntimeException("El CI ${dto.ci} ya está registrado")
        }

        val student = Student(
            school = schoolTutor.school,
            createdBy = tutorUser,
            firstName = dto.firstName,
            lastName = dto.lastName,
            ci = dto.ci,
            email = dto.email,
            phone = dto.phone,
            status = 1, // activo
            createdAt = LocalDateTime.now()
        )

        val saved = studentRepository.save(student)
        return StudentMapper.toDTO(saved)
    }

    // ====================================================
    // LIST STUDENTS OF THIS TUTOR'S SCHOOL
    // ====================================================
    fun listStudents(currentUserEmail: String): List<StudentDTO> {

        val tutorUser = userRepository.findByEmail(currentUserEmail)
            ?: throw RuntimeException("Tutor no encontrado")

        val schoolTutor = schoolTutorRepository.findByUser(tutorUser)
            ?: throw RuntimeException("El usuario no es tutor escolar")

        val students = studentRepository.findBySchool(schoolTutor.school)
        return students.map { StudentMapper.toDTO(it) }
    }

    // ====================================================
    // UPDATE STUDENT
    // ====================================================
    fun updateStudent(currentUserEmail: String, studentId: UUID, dto: UpdateStudentDTO): StudentDTO {

        val tutorUser = userRepository.findByEmail(currentUserEmail)
            ?: throw RuntimeException("Tutor no encontrado")

        val schoolTutor = schoolTutorRepository.findByUser(tutorUser)
            ?: throw RuntimeException("El usuario no es tutor escolar")

        val student = studentRepository.findById(studentId)
            .orElseThrow { RuntimeException("Estudiante no encontrado") }

        // Validar que pertenece a la misma escuela
        if (student.school.id != schoolTutor.school.id) {
            throw RuntimeException("No tiene permiso para editar estudiantes de otra escuela")
        }

        val updated = student.copy(
            firstName = dto.firstName ?: student.firstName,
            lastName = dto.lastName ?: student.lastName,
            phone = dto.phone ?: student.phone,
            status = dto.status ?: student.status
        )

        val saved = studentRepository.save(updated)
        return StudentMapper.toDTO(saved)
    }

    // ====================================================
    // DELETE (SOFT DELETE)
    // ====================================================
    fun deleteStudent(currentUserEmail: String, studentId: UUID) {

        val tutorUser = userRepository.findByEmail(currentUserEmail)
            ?: throw RuntimeException("Tutor no encontrado")

        val schoolTutor = schoolTutorRepository.findByUser(tutorUser)
            ?: throw RuntimeException("El usuario no es tutor escolar")

        val student = studentRepository.findById(studentId)
            .orElseThrow { RuntimeException("Estudiante no encontrado") }

        if (student.school.id != schoolTutor.school.id) {
            throw RuntimeException("No tiene permiso para eliminar estudiantes de otra escuela")
        }

        val disabled = student.copy(status = 0) // 0 = eliminado / inactivo
        studentRepository.save(disabled)
    }
}
