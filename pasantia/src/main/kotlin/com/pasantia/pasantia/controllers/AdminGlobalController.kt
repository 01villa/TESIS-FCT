package com.pasantia.pasantia.controllers

import com.pasantia.pasantia.dto.admin.CreateAdminForEntityDTO
import com.pasantia.pasantia.dto.admin.CreateCompanyDTO
import com.pasantia.pasantia.dto.admin.CreateSchoolDTO
import com.pasantia.pasantia.services.AdminGlobalService
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("/admin")
class AdminGlobalController(
    private val adminService: AdminGlobalService
) {

    @PostMapping("/schools")
    fun createSchool(@RequestBody dto: CreateSchoolDTO) =
        adminService.createSchool(dto)

    @PostMapping("/companies")
    fun createCompany(@RequestBody dto: CreateCompanyDTO) =
        adminService.createCompany(dto)

    @PostMapping("/schools/{id}/admin")
    fun createSchoolAdmin(
        @PathVariable id: UUID,
        @RequestBody dto: CreateAdminForEntityDTO
    ) = adminService.createSchoolAdmin(id, dto)

    @PostMapping("/companies/{id}/admin")
    fun createCompanyAdmin(
        @PathVariable id: UUID,
        @RequestBody dto: CreateAdminForEntityDTO
    ) = adminService.createCompanyAdmin(id, dto)
}
