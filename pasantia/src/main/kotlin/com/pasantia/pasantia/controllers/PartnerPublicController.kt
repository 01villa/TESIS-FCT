package com.pasantia.pasantia.controllers

import com.pasantia.pasantia.dto.public.PartnerPublicDTO
import com.pasantia.pasantia.services.PartnerPublicService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/public/partners")
class PartnerPublicController(
    private val partnerPublicService: PartnerPublicService
) {
    @GetMapping
    fun getPartners(): List<PartnerPublicDTO> =
        partnerPublicService.getAllActivePartners()
}
