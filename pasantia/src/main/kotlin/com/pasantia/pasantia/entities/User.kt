package com.pasantia.pasantia.entities

import com.pasantia.pasantia.common.SoftDeletable
import jakarta.persistence.*
import org.hibernate.annotations.GenericGenerator
import org.springframework.data.annotation.CreatedBy
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedBy
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import java.time.LocalDateTime
import java.util.*

@Entity
@EntityListeners(AuditingEntityListener::class)
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
    var photoUrl: String? = null,

    // ============================
    // Audit
    // ============================
    @CreatedDate
    @Column(nullable = true, updatable = false)
    var createdAt: LocalDateTime? = null,

    @LastModifiedDate
    @Column(nullable = true)
    var updatedAt: LocalDateTime? = null,

    @CreatedBy
    @Column(name = "created_by", nullable = true)
    var createdBy: String? = null,

    @LastModifiedBy
    @Column(name = "updated_by", nullable = true)
    var updatedBy: String? = null

) : SoftDeletable
