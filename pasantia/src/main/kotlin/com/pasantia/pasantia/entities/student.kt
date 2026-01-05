package com.pasantia.pasantia.entities

import com.pasantia.pasantia.common.AuditableEntity
import com.pasantia.pasantia.common.SoftDeletable
import jakarta.persistence.*
import java.time.LocalDateTime
import java.util.*

@Entity
@Table(
    name = "students",
    uniqueConstraints = [
        UniqueConstraint(columnNames = ["ci"])
    ]
)
data class Student(

    @Id
    @Column(nullable = false)
    val id: UUID = UUID.randomUUID(),

    // Student → School
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "school_id", nullable = false)
    var school: School,

    // Student → User (LOGIN)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    var user: User,

    // Student → Specialty
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "specialty_id", nullable = false)
    var specialty: Specialty,

    @Column(nullable = false, length = 80)
    var firstName: String,

    @Column(nullable = false, length = 80)
    var lastName: String,

    @Column(nullable = false, length = 20, unique = true)
    var ci: String,

    @Column(length = 20)
    var phone: String? = null,

    // Soft delete
    @Column(nullable = false)
    override var active: Boolean = true,

    @Column
    override var deletedAt: LocalDateTime? = null

) : AuditableEntity(), SoftDeletable {

    val fullName: String get() = "$firstName $lastName"
}
