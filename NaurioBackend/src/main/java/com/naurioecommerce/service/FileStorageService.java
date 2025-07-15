package com.naurioecommerce.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {

    private final String uploadDir = "uploads";

    public String storeFile(MultipartFile file) throws IOException {
        String dateFolder = LocalDate.now().toString(); // e.g. "2025-07-13"
        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path uploadPath = Paths.get(uploadDir, dateFolder);

        Files.createDirectories(uploadPath);
        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return "/api/products/images/" + dateFolder + "/" + filename;
    }

    public Path getFilePath(String folder, String filename) {
        return Paths.get(uploadDir, folder, filename).normalize();
    }
}
