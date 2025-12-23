package com.pasantia.pasantia.entities

import com.pasantia.pasantia.common.SoftDeletable
import jakarta.persistence.*
import org.springframework.data.annotation.CreatedBy
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import java.time.LocalDateTime
import java.util.UUID

@Entity
@EntityListeners(AuditingEntityListener::class)
@Table(name = "schools")
data class School(

    @Id
    @Column(nullable = false)
    val id: UUID = UUID.randomUUID(),

    @Column(nullable = false, length = 150)
    var name: String,

    @Column(length = 200)
    var address: String? = null,

    @Column(name = "logo_url")
    var logoUrl: String? = null,
    // ============================
    // Soft Delete
    // ============================
    @Column(nullable = false)
    override var active: Boolean = true,

    @Column
    override var deletedAt: LocalDateTime? = null,

    // ============================
    // Auditoría
    // ============================
    @CreatedBy
    @Column(name = "created_by", nullable = true)
    var createdBy: String? = null,

    @CreatedDate
    @Column(nullable = true, updatable = false)
    var createdAt: LocalDateTime? = null,

    @LastModifiedDate
    @Column(nullable = true)
    var updatedAt: LocalDateTime? = null

) : SoftDeletable
