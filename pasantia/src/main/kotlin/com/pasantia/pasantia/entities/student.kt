package com.pasantia.pasantia.entities

import jakarta.persistence.*
import java.time.LocalDateTime
import java.util.UUID

@Entity
@Table(
    name = "students",
    uniqueConstraints = [
        UniqueConstraint(columnNames = ["ci"]),
        UniqueConstraint(columnNames = ["email"])
    ]
)
data class Student(

    @Id
    @Column(nullable = false)
    val id: UUID = UUID.randomUUID(),

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "school_id", nullable = false)
    val school: School,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    val createdBy: User,  // tutor de escuela

    @Column(nullable = false, length = 80)
    val firstName: String,

    @Column(nullable = false, length = 80)
    val lastName: String,

    @Column(nullable = false, length = 20, unique = true)
    val ci: String,

    @Column(nullable = false, length = 150, unique = true)
    val email: String,

    @Column(length = 20)
    val phone: String? = null,

    @Column(nullable = false)
    val status: Short = 1,  // 1=activo, 0=inactivo

    @Column(nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now()
) {

    // Getter útil para no repetir lógica en servicios/DTOs
    val fullName: String get() = "$firstName $lastName"
}
