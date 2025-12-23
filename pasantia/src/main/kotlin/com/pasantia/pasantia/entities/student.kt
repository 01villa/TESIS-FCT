package com.pasantia.pasantia.entities

import com.pasantia.pasantia.common.SoftDeletable
import jakarta.persistence.*
import org.springframework.data.annotation.CreatedBy
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import java.time.LocalDateTime
import java.util.*

@Entity
@EntityListeners(AuditingEntityListener::class)
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
    override var deletedAt: LocalDateTime? = null,

    // Auditoría
    @CreatedBy
    @Column(name = "created_by")
    var createdBy: String? = null,

    @CreatedDate
    var createdAt: LocalDateTime? = null,

    @LastModifiedDate
    var updatedAt: LocalDateTime? = null

) : SoftDeletable {

    val fullName: String get() = "$firstName $lastName"
}
