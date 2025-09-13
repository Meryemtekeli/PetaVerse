package com.petaverse.controller;

import com.petaverse.dto.AdoptionApplicationDto;
import com.petaverse.entity.AdoptionApplication;
import com.petaverse.entity.AdoptionStatus;
import com.petaverse.repository.AdoptionApplicationRepository;
import com.petaverse.repository.AdoptionListingRepository;
import com.petaverse.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/adoption-applications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdoptionApplicationController {
    
    private final AdoptionApplicationRepository adoptionApplicationRepository;
    private final AdoptionListingRepository adoptionListingRepository;
    private final UserRepository userRepository;
    
    @GetMapping("/listing/{listingId}")
    public ResponseEntity<List<AdoptionApplicationDto>> getApplicationsByListingId(@PathVariable Long listingId) {
        List<AdoptionApplicationDto> applications = adoptionApplicationRepository
                .findByAdoptionListingIdOrderByCreatedAtDesc(listingId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(applications);
    }
    
    @GetMapping("/applicant/{applicantId}")
    public ResponseEntity<List<AdoptionApplicationDto>> getApplicationsByApplicantId(@PathVariable Long applicantId) {
        List<AdoptionApplicationDto> applications = adoptionApplicationRepository
                .findByApplicantIdOrderByCreatedAtDesc(applicantId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(applications);
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<AdoptionApplicationDto>> getApplicationsByStatus(@PathVariable String status) {
        List<AdoptionApplicationDto> applications = adoptionApplicationRepository
                .findByStatusOrderByCreatedAtDesc(AdoptionStatus.valueOf(status))
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(applications);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<AdoptionApplicationDto> getApplicationById(@PathVariable Long id) {
        Optional<AdoptionApplicationDto> application = adoptionApplicationRepository
                .findById(id)
                .map(this::convertToDto);
        return application.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<AdoptionApplicationDto> createApplication(
            @RequestBody AdoptionApplicationDto applicationDto,
            Authentication authentication) {
        String userEmail = authentication.getName();
        var user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        var adoptionListing = adoptionListingRepository.findById(applicationDto.getAdoptionListingId())
                .orElseThrow(() -> new RuntimeException("Adoption listing not found"));
        
        AdoptionApplication application = new AdoptionApplication();
        application.setAdoptionListing(adoptionListing);
        application.setApplicant(user);
        application.setStatus(AdoptionStatus.PENDING);
        application.setMotivation(applicationDto.getMotivation());
        application.setExperienceWithPets(applicationDto.getExperienceWithPets());
        application.setLivingSituation(applicationDto.getLivingSituation());
        application.setWorkSchedule(applicationDto.getWorkSchedule());
        application.setOtherPets(applicationDto.getOtherPets());
        application.setChildrenInHome(applicationDto.getChildrenInHome());
        application.setAllergies(applicationDto.getAllergies());
        application.setFinancialStability(applicationDto.getFinancialStability());
        application.setReferences(applicationDto.getReferences());
        
        AdoptionApplication saved = adoptionApplicationRepository.save(application);
        return ResponseEntity.ok(convertToDto(saved));
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<AdoptionApplicationDto> updateApplicationStatus(
            @PathVariable Long id,
            @RequestParam String status,
            Authentication authentication) {
        String userEmail = authentication.getName();
        var user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Optional<AdoptionApplicationDto> updated = adoptionApplicationRepository.findById(id)
                .filter(app -> app.getAdoptionListing().getUser().getId().equals(user.getId()))
                .map(app -> {
                    app.setStatus(AdoptionStatus.valueOf(status));
                    app.setUpdatedAt(LocalDateTime.now());
                    AdoptionApplication saved = adoptionApplicationRepository.save(app);
                    return convertToDto(saved);
                });
        
        return updated.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{id}/home-visit")
    public ResponseEntity<AdoptionApplicationDto> scheduleHomeVisit(
            @PathVariable Long id,
            @RequestParam String scheduledDate,
            Authentication authentication) {
        String userEmail = authentication.getName();
        var user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Optional<AdoptionApplicationDto> updated = adoptionApplicationRepository.findById(id)
                .filter(app -> app.getAdoptionListing().getUser().getId().equals(user.getId()))
                .map(app -> {
                    app.setHomeVisitScheduled(LocalDateTime.parse(scheduledDate));
                    app.setUpdatedAt(LocalDateTime.now());
                    AdoptionApplication saved = adoptionApplicationRepository.save(app);
                    return convertToDto(saved);
                });
        
        return updated.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{id}/home-visit/complete")
    public ResponseEntity<AdoptionApplicationDto> completeHomeVisit(
            @PathVariable Long id,
            @RequestParam String notes,
            Authentication authentication) {
        String userEmail = authentication.getName();
        var user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Optional<AdoptionApplicationDto> updated = adoptionApplicationRepository.findById(id)
                .filter(app -> app.getAdoptionListing().getUser().getId().equals(user.getId()))
                .map(app -> {
                    app.setHomeVisitCompleted(true);
                    app.setHomeVisitNotes(notes);
                    app.setUpdatedAt(LocalDateTime.now());
                    AdoptionApplication saved = adoptionApplicationRepository.save(app);
                    return convertToDto(saved);
                });
        
        return updated.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApplication(@PathVariable Long id, Authentication authentication) {
        String userEmail = authentication.getName();
        var user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        boolean deleted = adoptionApplicationRepository.findById(id)
                .filter(app -> app.getApplicant().getId().equals(user.getId()))
                .map(app -> {
                    adoptionApplicationRepository.delete(app);
                    return true;
                })
                .orElse(false);
        
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    private AdoptionApplicationDto convertToDto(AdoptionApplication application) {
        AdoptionApplicationDto dto = new AdoptionApplicationDto();
        dto.setId(application.getId());
        dto.setAdoptionListingId(application.getAdoptionListing().getId());
        dto.setApplicantId(application.getApplicant().getId());
        dto.setStatus(application.getStatus().name());
        dto.setMotivation(application.getMotivation());
        dto.setExperienceWithPets(application.getExperienceWithPets());
        dto.setLivingSituation(application.getLivingSituation());
        dto.setWorkSchedule(application.getWorkSchedule());
        dto.setOtherPets(application.getOtherPets());
        dto.setChildrenInHome(application.getChildrenInHome());
        dto.setAllergies(application.getAllergies());
        dto.setFinancialStability(application.getFinancialStability());
        dto.setReferences(application.getReferences());
        dto.setHomeVisitScheduled(application.getHomeVisitScheduled());
        dto.setHomeVisitCompleted(application.getHomeVisitCompleted());
        dto.setHomeVisitNotes(application.getHomeVisitNotes());
        dto.setCreatedAt(application.getCreatedAt());
        dto.setUpdatedAt(application.getUpdatedAt());
        
        // Additional fields for display
        dto.setApplicantName(application.getApplicant().getName());
        dto.setApplicantEmail(application.getApplicant().getEmail());
        dto.setPetName(application.getAdoptionListing().getPet().getName());
        dto.setListingTitle(application.getAdoptionListing().getTitle());
        
        return dto;
    }
}
