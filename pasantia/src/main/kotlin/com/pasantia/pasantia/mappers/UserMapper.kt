package com.pasantia.pasantia.mappers

import com.pasantia.pasantia.dto.UserDTO
import com.pasantia.pasantia.entities.User

object UserMapper {

    fun toDTO(user: User, roles: List<String>) = UserDTO(
        id = user.id!!,
        email = user.email,
        fullName = user.fullName,
        active = user.active,
        deletedAt = user.deletedAt,
        roles = roles,
        createdAt = user.createdAt,
        updatedAt = user.updatedAt,
        photoUrl = user.photoUrl

    )
}
