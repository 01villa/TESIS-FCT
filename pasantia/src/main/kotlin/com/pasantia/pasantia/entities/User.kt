package com.pasantia.pasantia.entities

import com.pasantia.pasantia.common.AuditableEntity
import com.pasantia.pasantia.common.SoftDeletable
import jakarta.persistence.*
import org.hibernate.annotations.GenericGenerator
import java.time.LocalDateTime
import java.util.*

@Entity
@Table(name = "users")
open class User(

    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(columnDefinition = "UUID", updatable = false, nullable = false)
    val id: UUID? = null,

    @Column(nullable = false, unique = true, length = 150)
    val email: String,

    @Column(name = "password_hash", nullable = false, columnDefinition = "TEXT")
    var passwordHash: String,

    @Column(name = "full_name", nullable = false, length = 150)
    var fullName: String,

    // ============================
    // Soft Delete
    // ============================
    @Column(nullable = false)
    override var active: Boolean = true,

    @Column
    override var deletedAt: LocalDateTime? = null,

    @Column(name = "photo_url")
    var photoUrl: String? = null

) : AuditableEntity(), SoftDeletable
