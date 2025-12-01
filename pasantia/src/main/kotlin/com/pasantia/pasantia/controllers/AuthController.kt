package com.pasantia.pasantia.controllers

import com.pasantia.pasantia.dto.auth.AuthRequest
import com.pasantia.pasantia.dto.CreateUserDTO
import com.pasantia.pasantia.services.AuthService
import com.pasantia.pasantia.services.UserService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/auth")
class AuthController(
    private val authService: AuthService,
    private val userService: UserService
) {

    @PostMapping("/login")
    fun login(@RequestBody req: AuthRequest) =
        authService.login(req)
}

