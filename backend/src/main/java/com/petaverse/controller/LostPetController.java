package com.petaverse.controller;

import com.petaverse.dto.CreatePetRequest;
import com.petaverse.dto.PetDto;
import com.petaverse.dto.UpdatePetRequest;
import com.petaverse.service.PetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/lost-pets")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class LostPetController {
    
    private final PetService petService;
    
    @GetMapping
    public ResponseEntity<List<PetDto>> getAllLostPets() {
        List<PetDto> lostPets = petService.getPetsByStatus(com.petaverse.entity.PetStatus.LOST);
        return ResponseEntity.ok(lostPets);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<PetDto> getLostPetById(@PathVariable Long id) {
        PetDto pet = petService.getPetById(id);
        return ResponseEntity.ok(pet);
    }
    
    @PostMapping
    public ResponseEntity<PetDto> createLostPetReport(
            @RequestBody CreatePetRequest request,
            Authentication authentication) {
        // Set status as LOST for lost pet reports
        request.setStatus(com.petaverse.entity.PetStatus.LOST);
        PetDto createdPet = petService.createPet(request, authentication);
        return ResponseEntity.ok(createdPet);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<PetDto> updateLostPetReport(
            @PathVariable Long id,
            @RequestBody UpdatePetRequest request,
            Authentication authentication) {
        Optional<PetDto> updatedPet = petService.updatePet(id, request, authentication);
        if (updatedPet.isPresent()) {
            return ResponseEntity.ok(updatedPet.get());
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLostPetReport(
            @PathVariable Long id,
            Authentication authentication) {
        boolean deleted = petService.deletePet(id, authentication);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<PetDto>> searchLostPets(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String petType,
            @RequestParam(required = false) String breed) {
        List<PetDto> searchResults = petService.searchPets(com.petaverse.entity.PetStatus.LOST, location, petType, breed);
        return ResponseEntity.ok(searchResults);
    }
    
    @PutMapping("/{id}/found")
    public ResponseEntity<PetDto> markPetAsFound(
            @PathVariable Long id,
            Authentication authentication) {
        UpdatePetRequest request = new UpdatePetRequest();
        request.setStatus("FOUND");
        Optional<PetDto> updatedPet = petService.updatePet(id, request, authentication);
        if (updatedPet.isPresent()) {
            return ResponseEntity.ok(updatedPet.get());
        }
        return ResponseEntity.notFound().build();
    }
}
