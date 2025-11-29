package com.pasantia.pasantia.controllers

import com.pasantia.pasantia.dto.CreateUserDTO
import com.pasantia.pasantia.dto.UpdateUserDTO
import com.pasantia.pasantia.services.UserService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("/admin/users")
class UserAdminController(
    private val userService: UserService
) {

    /** =======================================
     *  CREATE USER
     *  ======================================= */
    @PostMapping
    fun createUser(@RequestBody dto: CreateUserDTO) =
        ResponseEntity.ok(userService.createUser(dto))

    /** =======================================
     *  LIST ACTIVE USERS
     *  ======================================= */
    @GetMapping
    fun listUsers() =
        ResponseEntity.ok(userService.listActiveUsers())

    /** =======================================
     *  GET USER BY ID
     *  ======================================= */
    @GetMapping("/{id}")
    fun getUser(@PathVariable id: UUID) =
        ResponseEntity.ok(userService.getUser(id))

    /** =======================================
     *  UPDATE USER
     *  ======================================= */
    @PutMapping("/{id}")
    fun updateUser(
        @PathVariable id: UUID,
        @RequestBody dto: UpdateUserDTO
    ) = ResponseEntity.ok(userService.updateUser(id, dto))

    /** =======================================
     *  SOFT DELETE
     *  ======================================= */
    @DeleteMapping("/{id}")
    fun deleteUser(@PathVariable id: UUID): ResponseEntity<Void> {
        userService.softDeleteUser(id)
        return ResponseEntity.noContent().build()
    }

    /** =======================================
     *  RESTORE USER
     *  ======================================= */
    @PatchMapping("/{id}/restore")
    fun restoreUser(@PathVariable id: UUID) =
        ResponseEntity.ok(userService.restoreUser(id))
}
