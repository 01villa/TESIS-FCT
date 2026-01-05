package com.pasantia.pasantia.controllers

import com.pasantia.pasantia.dto.UserSimpleDTO
import com.pasantia.pasantia.repositories.UserRepository
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/users")
class UserPublicController(
    private val userRepository: UserRepository
) {

    @GetMapping("/basic")
    fun listBasic(): List<UserSimpleDTO> =
        userRepository.findAll().map {
            UserSimpleDTO(
                id = it.id!!,
                email = it.email,
                fullName = it.fullName
            )
        }
}
