package com.pasantia.pasantia.entities

import jakarta.persistence.*
import java.io.Serializable
import java.util.UUID

@Embeddable
data class UserRoleId(
    @Column(name = "user_id")
    val userId: UUID,

    @Column(name = "role_id")
    val roleId: Long
) : Serializable

@Entity
@Table(name = "user_roles")
data class UserRole(

    @EmbeddedId
    val id: UserRoleId,

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name = "user_id", nullable = false)
    val user: User,

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("roleId")
    @JoinColumn(name = "role_id", nullable = false)
    val role: Role
)
