package com.pasantia.pasantia.services

import com.pasantia.pasantia.dto.specialty.SpecialtyRequest
import com.pasantia.pasantia.dto.specialty.SpecialtyResponse
import com.pasantia.pasantia.entities.Specialty
import com.pasantia.pasantia.repositories.SpecialtyRepository
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class SpecialtyService(
    private val specialtyRepository: SpecialtyRepository
) {

    fun getAllActive(): List<SpecialtyResponse> =
        specialtyRepository.findByActiveTrue()
            .map { it.toResponse() }

    fun create(request: SpecialtyRequest): SpecialtyResponse {

        val exists = specialtyRepository.findByNameIgnoreCase(request.name)
        require(exists == null) { "La especialidad ya existe" }

        val specialty = Specialty(
            name = request.name.trim(),
            description = request.description
        )

        return specialtyRepository.save(specialty).toResponse()
    }

    fun deactivate(id: UUID) {
        val specialty = specialtyRepository.findById(id)
            .orElseThrow { RuntimeException("Especialidad no encontrada") }

        specialty.active = false
        specialtyRepository.save(specialty)
    }

    private fun Specialty.toResponse() = SpecialtyResponse(
        id = this.id,
        name = this.name,
        description = this.description,
        active = this.active
    )
}
