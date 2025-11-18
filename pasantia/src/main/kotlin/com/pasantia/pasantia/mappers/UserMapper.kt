package com.pasantia.pasantia.mappers

import com.pasantia.pasantia.dto.UserDTO
import com.pasantia.pasantia.entities.User

fun User.toDTO(roles: List<String>): UserDTO {
    return UserDTO(
        id = this.id!!,
        email = this.email,
        fullName = this.fullName,
        status = this.status,
        roles = roles
    )
}
