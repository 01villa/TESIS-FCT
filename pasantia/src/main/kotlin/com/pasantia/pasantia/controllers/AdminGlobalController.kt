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

    /** -------------------------
     *  CREAR ESCUELA
     *  ------------------------- */
    @PostMapping("/schools")
    fun createSchool(@RequestBody dto: CreateSchoolDTO) =
        adminService.createSchool(dto)

    /** -------------------------
     *  CREAR EMPRESA
     *  ------------------------- */
    @PostMapping("/companies")
    fun createCompany(@RequestBody dto: CreateCompanyDTO) =
        adminService.createCompany(dto)

    /** -------------------------
     *  CREAR ADMIN DE ESCUELA
     *  ------------------------- */
    @PostMapping("/schools/{id}/admin")
    fun createSchoolAdmin(
        @PathVariable id: UUID,
        @RequestBody dto: CreateAdminForEntityDTO
    ) = adminService.createSchoolAdmin(id, dto)

    /** -------------------------
     *  CREAR ADMIN DE EMPRESA
     *  ------------------------- */
    @PostMapping("/companies/{id}/admin")
    fun createCompanyAdmin(
        @PathVariable id: UUID,
        @RequestBody dto: CreateAdminForEntityDTO
    ) = adminService.createCompanyAdmin(id, dto)


    /** -------------------------
     *  LISTAR ESCUELAS
     *  ------------------------- */
    @GetMapping("/schools")
    fun listSchools() = adminService.listSchools()

    /** -------------------------
     *  LISTAR EMPRESAS
     *  ------------------------- */
    @GetMapping("/companies")
    fun listCompanies() = adminService.listCompanies()

    /** -------------------------
     *  LISTAR ADMINS DE ESCUELA
     *  ------------------------- */
    @GetMapping("/schools/admins")
    fun listSchoolAdmins() = adminService.listSchoolAdmins()

    /** -------------------------
     *  LISTAR ADMINS DE EMPRESA
     *  ------------------------- */
    @GetMapping("/companies/admins")
    fun listCompanyAdmins() = adminService.listCompanyAdmins()
}
