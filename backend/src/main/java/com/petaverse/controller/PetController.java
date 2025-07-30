package com.petaverse.controller;

import com.petaverse.dto.PetDto;
import com.petaverse.dto.CreatePetRequest;
import com.petaverse.dto.UpdatePetRequest;
import com.petaverse.service.PetService;
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
@RequestMapping("/api/pets")
@Tag(name = "Pets", description = "Evcil hayvan işlemleri")
@CrossOrigin(origins = "*")
public class PetController {

    @Autowired
    private PetService petService;

    @GetMapping
    @Operation(summary = "Evcil hayvanları listele", description = "Sayfalama ile evcil hayvanları listeler")
    public ResponseEntity<Page<PetDto>> getAllPets(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String breed,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String status,
            Pageable pageable) {
        Page<PetDto> pets = petService.getAllPets(type, breed, city, status, pageable);
        return ResponseEntity.ok(pets);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Evcil hayvan detayı", description = "ID ile evcil hayvan detayını getirir")
    public ResponseEntity<PetDto> getPetById(@PathVariable Long id) {
        PetDto pet = petService.getPetById(id);
        return ResponseEntity.ok(pet);
    }

    @GetMapping("/my-pets")
    @Operation(summary = "Kullanıcının evcil hayvanları", description = "Giriş yapmış kullanıcının evcil hayvanlarını listeler")
    public ResponseEntity<List<PetDto>> getMyPets(Authentication authentication) {
        List<PetDto> pets = petService.getPetsByOwner(authentication);
        return ResponseEntity.ok(pets);
    }

    @PostMapping
    @Operation(summary = "Evcil hayvan oluştur", description = "Yeni evcil hayvan profili oluşturur")
    public ResponseEntity<PetDto> createPet(
            @Valid @RequestBody CreatePetRequest request,
            Authentication authentication) {
        PetDto pet = petService.createPet(request, authentication);
        return ResponseEntity.ok(pet);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Evcil hayvan güncelle", description = "Evcil hayvan bilgilerini günceller")
    public ResponseEntity<PetDto> updatePet(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePetRequest request,
            Authentication authentication) {
        PetDto pet = petService.updatePet(id, request, authentication);
        return ResponseEntity.ok(pet);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Evcil hayvan sil", description = "Evcil hayvan profilini siler")
    public ResponseEntity<String> deletePet(
            @PathVariable Long id,
            Authentication authentication) {
        petService.deletePet(id, authentication);
        return ResponseEntity.ok("Evcil hayvan başarıyla silindi");
    }

    @PostMapping("/{id}/images")
    @Operation(summary = "Evcil hayvan fotoğrafı yükle", description = "Evcil hayvana fotoğraf ekler")
    public ResponseEntity<String> uploadPetImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        String imageUrl = petService.uploadPetImage(id, file, authentication);
        return ResponseEntity.ok(imageUrl);
    }

    @DeleteMapping("/{id}/images/{imageIndex}")
    @Operation(summary = "Evcil hayvan fotoğrafı sil", description = "Evcil hayvandan fotoğraf siler")
    public ResponseEntity<String> deletePetImage(
            @PathVariable Long id,
            @PathVariable int imageIndex,
            Authentication authentication) {
        petService.deletePetImage(id, imageIndex, authentication);
        return ResponseEntity.ok("Fotoğraf başarıyla silindi");
    }

    @PostMapping("/{id}/videos")
    @Operation(summary = "Evcil hayvan videosu yükle", description = "Evcil hayvana video ekler")
    public ResponseEntity<String> uploadPetVideo(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        String videoUrl = petService.uploadPetVideo(id, file, authentication);
        return ResponseEntity.ok(videoUrl);
    }

    @DeleteMapping("/{id}/videos/{videoIndex}")
    @Operation(summary = "Evcil hayvan videosu sil", description = "Evcil hayvandan video siler")
    public ResponseEntity<String> deletePetVideo(
            @PathVariable Long id,
            @PathVariable int videoIndex,
            Authentication authentication) {
        petService.deletePetVideo(id, videoIndex, authentication);
        return ResponseEntity.ok("Video başarıyla silindi");
    }

    @GetMapping("/search")
    @Operation(summary = "Evcil hayvan ara", description = "Filtrelerle evcil hayvan arama")
    public ResponseEntity<List<PetDto>> searchPets(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String breed,
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) String size,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Integer minAge,
            @RequestParam(required = false) Integer maxAge,
            @RequestParam(required = false) Boolean isNeutered,
            @RequestParam(required = false) Boolean isVaccinated) {
        List<PetDto> pets = petService.searchPets(name, type, breed, gender, size, city, minAge, maxAge, isNeutered, isVaccinated);
        return ResponseEntity.ok(pets);
    }

    @GetMapping("/breeds")
    @Operation(summary = "Irk listesi", description = "Tür bazında ırk listesini getirir")
    public ResponseEntity<List<String>> getBreeds(@RequestParam String type) {
        List<String> breeds = petService.getBreedsByType(type);
        return ResponseEntity.ok(breeds);
    }

    @GetMapping("/stats")
    @Operation(summary = "Evcil hayvan istatistikleri", description = "Platform evcil hayvan istatistiklerini getirir")
    public ResponseEntity<Object> getPetStats() {
        Object stats = petService.getPetStats();
        return ResponseEntity.ok(stats);
    }

    @PostMapping("/{id}/status")
    @Operation(summary = "Evcil hayvan durumu güncelle", description = "Evcil hayvanın durumunu günceller")
    public ResponseEntity<PetDto> updatePetStatus(
            @PathVariable Long id,
            @RequestParam String status,
            Authentication authentication) {
        PetDto pet = petService.updatePetStatus(id, status, authentication);
        return ResponseEntity.ok(pet);
    }
} 