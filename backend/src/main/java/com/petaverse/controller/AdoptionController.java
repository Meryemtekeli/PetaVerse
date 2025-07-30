package com.petaverse.controller;

import com.petaverse.dto.AdoptionListingDto;
import com.petaverse.dto.CreateAdoptionListingRequest;
import com.petaverse.dto.UpdateAdoptionListingRequest;
import com.petaverse.service.AdoptionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/adoption")
@Tag(name = "Adoption", description = "Sahiplendirme işlemleri")
@CrossOrigin(origins = "*")
public class AdoptionController {

    @Autowired
    private AdoptionService adoptionService;

    @GetMapping
    @Operation(summary = "Sahiplendirme ilanlarını listele", description = "Sayfalama ile sahiplendirme ilanlarını listeler")
    public ResponseEntity<Page<AdoptionListingDto>> getAllListings(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String breed,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Boolean isUrgent,
            @RequestParam(required = false) Boolean isVerified,
            Pageable pageable) {
        
        Page<AdoptionListingDto> listings = adoptionService.getAllListings(type, breed, city, status, isUrgent, isVerified, pageable);
        return ResponseEntity.ok(listings);
    }

    @GetMapping("/{id}")
    @Operation(summary = "İlan detayı", description = "ID ile sahiplendirme ilanı detayını getirir")
    public ResponseEntity<AdoptionListingDto> getListingById(@PathVariable Long id) {
        AdoptionListingDto listing = adoptionService.getListingById(id);
        return ResponseEntity.ok(listing);
    }

    @GetMapping("/my-listings")
    @Operation(summary = "Kullanıcının ilanları", description = "Giriş yapmış kullanıcının ilanlarını listeler")
    public ResponseEntity<List<AdoptionListingDto>> getMyListings(Authentication authentication) {
        List<AdoptionListingDto> listings = adoptionService.getListingsByUser(authentication);
        return ResponseEntity.ok(listings);
    }

    @PostMapping
    @Operation(summary = "Yeni ilan oluştur", description = "Yeni sahiplendirme ilanı oluşturur")
    public ResponseEntity<AdoptionListingDto> createListing(
            @Valid @RequestBody CreateAdoptionListingRequest request,
            Authentication authentication) {
        
        AdoptionListingDto listing = adoptionService.createListing(request, authentication);
        return ResponseEntity.ok(listing);
    }

    @PutMapping("/{id}")
    @Operation(summary = "İlan güncelle", description = "Mevcut sahiplendirme ilanını günceller")
    public ResponseEntity<AdoptionListingDto> updateListing(
            @PathVariable Long id,
            @Valid @RequestBody UpdateAdoptionListingRequest request,
            Authentication authentication) {
        
        AdoptionListingDto listing = adoptionService.updateListing(id, request, authentication);
        return ResponseEntity.ok(listing);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "İlan sil", description = "Sahiplendirme ilanını siler")
    public ResponseEntity<Void> deleteListing(@PathVariable Long id, Authentication authentication) {
        adoptionService.deleteListing(id, authentication);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/images")
    @Operation(summary = "İlan resmi yükle", description = "Sahiplendirme ilanına resim yükler")
    public ResponseEntity<String> uploadListingImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        
        String imageUrl = adoptionService.uploadListingImage(id, file, authentication);
        return ResponseEntity.ok(imageUrl);
    }

    @DeleteMapping("/{id}/images/{imageIndex}")
    @Operation(summary = "İlan resmi sil", description = "Sahiplendirme ilanından resim siler")
    public ResponseEntity<Void> deleteListingImage(
            @PathVariable Long id,
            @PathVariable int imageIndex,
            Authentication authentication) {
        
        adoptionService.deleteListingImage(id, imageIndex, authentication);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/apply")
    @Operation(summary = "Başvuru yap", description = "Sahiplendirme ilanına başvuru yapar")
    public ResponseEntity<Object> applyForAdoption(
            @PathVariable Long id,
            @RequestBody String message,
            Authentication authentication) {
        
        Object application = adoptionService.applyForAdoption(id, message, authentication);
        return ResponseEntity.ok(application);
    }

    @GetMapping("/{id}/applications")
    @Operation(summary = "Başvuruları listele", description = "İlan için gelen başvuruları listeler")
    public ResponseEntity<List<Object>> getApplications(
            @PathVariable Long id,
            Authentication authentication) {
        
        List<Object> applications = adoptionService.getApplications(id, authentication);
        return ResponseEntity.ok(applications);
    }

    @PutMapping("/{id}/applications/{applicationId}/status")
    @Operation(summary = "Başvuru durumu güncelle", description = "Başvuru durumunu günceller")
    public ResponseEntity<Object> updateApplicationStatus(
            @PathVariable Long id,
            @PathVariable Long applicationId,
            @RequestParam String status,
            Authentication authentication) {
        
        Object application = adoptionService.updateApplicationStatus(id, applicationId, status, authentication);
        return ResponseEntity.ok(application);
    }

    @GetMapping("/search")
    @Operation(summary = "İlan ara", description = "Gelişmiş arama ile ilan arar")
    public ResponseEntity<List<AdoptionListingDto>> searchListings(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String breed,
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) String size,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Integer minAge,
            @RequestParam(required = false) Integer maxAge,
            @RequestParam(required = false) Double minFee,
            @RequestParam(required = false) Double maxFee,
            @RequestParam(required = false) Boolean isUrgent,
            @RequestParam(required = false) Boolean isVerified) {
        
        List<AdoptionListingDto> listings = adoptionService.searchListings(
                title, type, breed, gender, size, city, minAge, maxAge, minFee, maxFee, isUrgent, isVerified);
        return ResponseEntity.ok(listings);
    }

    @GetMapping("/stats")
    @Operation(summary = "İstatistikler", description = "Sahiplendirme istatistiklerini getirir")
    public ResponseEntity<Object> getAdoptionStats() {
        Object stats = adoptionService.getAdoptionStats();
        return ResponseEntity.ok(stats);
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "İlan durumu güncelle", description = "İlan durumunu günceller")
    public ResponseEntity<AdoptionListingDto> updateListingStatus(
            @PathVariable Long id,
            @RequestParam String status,
            Authentication authentication) {
        
        AdoptionListingDto listing = adoptionService.updateListingStatus(id, status, authentication);
        return ResponseEntity.ok(listing);
    }

    @PostMapping("/{id}/verify")
    @Operation(summary = "İlan doğrula", description = "İlanı doğrulanmış olarak işaretler (Admin)")
    public ResponseEntity<AdoptionListingDto> verifyListing(
            @PathVariable Long id,
            Authentication authentication) {
        
        AdoptionListingDto listing = adoptionService.verifyListing(id, authentication);
        return ResponseEntity.ok(listing);
    }

    @PostMapping("/{id}/mark-urgent")
    @Operation(summary = "Acil işaretle", description = "İlanı acil olarak işaretler")
    public ResponseEntity<AdoptionListingDto> markAsUrgent(
            @PathVariable Long id,
            Authentication authentication) {
        
        AdoptionListingDto listing = adoptionService.markAsUrgent(id, authentication);
        return ResponseEntity.ok(listing);
    }
} 