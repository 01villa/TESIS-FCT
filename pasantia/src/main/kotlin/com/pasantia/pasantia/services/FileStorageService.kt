package com.pasantia.pasantia.services

import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths
import java.nio.file.StandardCopyOption
import java.util.*

@Service
class FileStorageService(

    @Value("\${app.upload-dir}")
    private val uploadDir: String
) {

    fun store(file: MultipartFile, folder: String): String {

        if (file.isEmpty) {
            throw IllegalArgumentException("File is empty")
        }

        // Asegura carpeta base + subcarpeta
        val basePath: Path = Paths.get(uploadDir, folder)
        Files.createDirectories(basePath)

        val extension = file.originalFilename
            ?.substringAfterLast('.', "")
            ?.lowercase()
            ?: "bin"

        val filename = "${UUID.randomUUID()}.$extension"
        val targetPath = basePath.resolve(filename)

        Files.copy(file.inputStream, targetPath, StandardCopyOption.REPLACE_EXISTING)

        // URL pública que consumirá el frontend
        return "/uploads/$folder/$filename"
    }
}
