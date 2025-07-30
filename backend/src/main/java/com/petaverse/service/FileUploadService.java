package com.petaverse.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileUploadService {

    @Value("${app.file.upload.path}")
    private String uploadPath;

    @Value("${app.file.upload.max-size}")
    private long maxFileSize;

    public String uploadFile(MultipartFile file, String subDirectory) {
        try {
            // Dosya boyutu kontrolü
            if (file.getSize() > maxFileSize) {
                throw new RuntimeException("Dosya boyutu çok büyük. Maksimum: " + (maxFileSize / 1024 / 1024) + "MB");
            }

            // Dosya türü kontrolü
            String contentType = file.getContentType();
            if (contentType == null || (!contentType.startsWith("image/") && !contentType.startsWith("video/"))) {
                throw new RuntimeException("Sadece resim ve video dosyaları yüklenebilir");
            }

            // Dosya adını güvenli hale getir
            String originalFilename = file.getOriginalFilename();
            String fileExtension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            
            String fileName = UUID.randomUUID().toString() + fileExtension;
            
            // Dizin oluştur
            Path uploadDir = Paths.get(uploadPath, subDirectory);
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }
            
            // Dosyayı kaydet
            Path filePath = uploadDir.resolve(fileName);
            Files.copy(file.getInputStream(), filePath);
            
            // URL döndür
            return "/uploads/" + subDirectory + "/" + fileName;
            
        } catch (IOException e) {
            throw new RuntimeException("Dosya yüklenirken hata oluştu: " + e.getMessage());
        }
    }

    public void deleteFile(String fileUrl) {
        try {
            if (fileUrl != null && fileUrl.startsWith("/uploads/")) {
                String relativePath = fileUrl.substring("/uploads/".length());
                Path filePath = Paths.get(uploadPath, relativePath);
                
                if (Files.exists(filePath)) {
                    Files.delete(filePath);
                }
            }
        } catch (IOException e) {
            throw new RuntimeException("Dosya silinirken hata oluştu: " + e.getMessage());
        }
    }

    public boolean isValidFileType(String contentType) {
        return contentType != null && 
               (contentType.startsWith("image/") || contentType.startsWith("video/"));
    }

    public boolean isValidFileSize(long fileSize) {
        return fileSize <= maxFileSize;
    }
} 