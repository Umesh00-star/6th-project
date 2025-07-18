package com.naurioecommerce.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    @Value("${app.image.base-url:http://localhost:8080/api/product/images/}")
    private String imageBaseUrl;

    public static class FileInfo {
        public final String filename;
        public final String folder;
        public final String relativePath;
        public final String imageUrl;

        public FileInfo(String folder, String filename, String imageUrl) {
            this.filename = filename;
            this.folder = folder;
            this.relativePath = folder + "/" + filename;
            this.imageUrl = imageUrl;
        }
    }

    /**
     * Store the file and return metadata (folder, filename, imageUrl)
     */
    public FileInfo storeFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Uploaded file is empty or null");
        }

        String folder = LocalDate.now().toString(); // e.g. "2025-07-17"
        String originalFilename = file.getOriginalFilename();
        String cleanedFilename = cleanFilename(originalFilename);
        String finalFilename = UUID.randomUUID() + "_" + cleanedFilename;

        Path uploadPath = Paths.get(uploadDir, folder);
        Files.createDirectories(uploadPath);

        Path filePath = uploadPath.resolve(finalFilename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        String imageUrl = imageBaseUrl + folder + "/" + finalFilename;
        return new FileInfo(folder, finalFilename, imageUrl);
    }

    /**
     * Get full path from folder + filename
     */
    public Path getFilePath(String folder, String filename) {
        if (folder == null || filename == null)
            throw new IllegalArgumentException("Folder and filename must not be null");
        return Paths.get(uploadDir, folder, filename).normalize();
    }

    /**
     * Overloaded: Get full path from relativePath (e.g., "2025-07-17/uuid_file.jpg")
     */
    public Path getFilePath(String relativePath) {
        if (relativePath == null)
            throw new IllegalArgumentException("Relative path must not be null");
        return Paths.get(uploadDir, relativePath).normalize();
    }

    /**
     * Delete file by image URL
     */
    public boolean deleteFileByUrl(String imageUrl) {
        try {
            Path path = getFilePathFromUrl(imageUrl);
            return Files.deleteIfExists(path);
        } catch (Exception e) {
            System.err.println("⚠️ Failed to delete file: " + imageUrl + " → " + e.getMessage());
            return false;
        }
    }

    /**
     * Get path from full image URL
     */
    public Path getFilePathFromUrl(String imageUrl) {
        if (imageUrl == null || !imageUrl.startsWith(imageBaseUrl)) {
            throw new IllegalArgumentException("Invalid or unsupported image URL");
        }
        String relativePath = imageUrl.replace(imageBaseUrl, "");
        return getFilePath(relativePath);
    }

    /**
     * Sanitize filename to avoid unsafe characters
     */
    private String cleanFilename(String filename) {
        if (filename == null) return "file";
        filename = Paths.get(filename).getFileName().toString(); // Strip any path parts
        return filename.replaceAll("[^a-zA-Z0-9\\.\\-_]", "_");
    }
}
