package com.pasantia.pasantia.controllers

import com.pasantia.pasantia.dto.CreateUserDTO
import com.pasantia.pasantia.dto.UpdateUserDTO
import com.pasantia.pasantia.repositories.UserRepository
import com.pasantia.pasantia.services.UserService
import org.springframework.http.ResponseEntity
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import java.util.*

@RestController
@RequestMapping("/admin/users")
class UserAdminController(
    private val userService: UserService,
    private val userRepository: UserRepository
) {

    @PostMapping
    fun createUser(@RequestBody dto: CreateUserDTO) =
        ResponseEntity.ok(userService.createUser(dto))

    @GetMapping
    fun listUsers() =
        ResponseEntity.ok(userService.listActiveUsers())

    @GetMapping("/inactive")
    fun listInactiveUsers() =
        ResponseEntity.ok(userService.listInactiveUsers())

    @GetMapping("/{id}")
    fun getUser(@PathVariable id: UUID) =
        ResponseEntity.ok(userService.getUser(id))

    @PutMapping("/{id}")
    fun updateUser(
        @PathVariable id: UUID,
        @RequestBody dto: UpdateUserDTO
    ) = ResponseEntity.ok(userService.updateUser(id, dto))

    @DeleteMapping("/{id}")
    fun deleteUser(@PathVariable id: UUID): ResponseEntity<Void> {
        userService.softDeleteUser(id)
        return ResponseEntity.noContent().build()
    }

    @PatchMapping("/{id}/restore")
    fun restoreUser(@PathVariable id: UUID): ResponseEntity<Void> {
        userService.restoreUser(id)
        return ResponseEntity.noContent().build()
    }

    @PatchMapping("/{id}/photo")
    fun uploadUserPhoto(
        @PathVariable id: UUID,
        @RequestParam("file") file: MultipartFile
    ): ResponseEntity<Void> {
        userService.updatePhoto(id, file)
        return ResponseEntity.noContent().build()
    }
    @PatchMapping("/{id}/photo/remove")
    fun removePhoto(@PathVariable id: UUID): ResponseEntity<Void> {
        userService.removePhoto(id)
        return ResponseEntity.noContent().build()
    }


}
