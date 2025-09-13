package com.petaverse.service;

import com.petaverse.dto.AdoptionListingDto;
import com.petaverse.dto.CreateAdoptionListingRequest;
import com.petaverse.dto.UpdateAdoptionListingRequest;
import com.petaverse.entity.AdoptionListing;
import com.petaverse.entity.AdoptionStatus;
import com.petaverse.entity.ListingType;
import com.petaverse.entity.Pet;
import com.petaverse.entity.User;
import com.petaverse.repository.AdoptionListingRepository;
import com.petaverse.repository.PetRepository;
import com.petaverse.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class AdoptionService {
    
    private final AdoptionListingRepository adoptionListingRepository;
    private final PetRepository petRepository;
    private final UserRepository userRepository;
    
    public List<AdoptionListingDto> getAllAdoptionListings() {
        return adoptionListingRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<AdoptionListingDto> getAdoptionListingsByType(String type) {
        return adoptionListingRepository.findByListingType(type).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<AdoptionListingDto> getAdoptionListingsByLocation(String location) {
        return adoptionListingRepository.findByLocationContainingIgnoreCase(location).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public Optional<AdoptionListingDto> getAdoptionListingById(Long id) {
        return adoptionListingRepository.findById(id)
                .map(this::convertToDto);
    }
    
    public AdoptionListingDto createAdoptionListing(CreateAdoptionListingRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Pet pet = petRepository.findById(request.getPetId())
                .orElseThrow(() -> new RuntimeException("Pet not found"));
        
        AdoptionListing listing = new AdoptionListing();
        listing.setPet(pet);
        listing.setUser(user);
        listing.setTitle(request.getTitle());
        listing.setDescription(request.getDescription());
        listing.setLocation(request.getLocation());
        listing.setType(ListingType.valueOf(request.getListingType()));
        listing.setAdoptionFee(BigDecimal.valueOf(request.getAdoptionFee()));
        listing.setStatus(AdoptionStatus.ACTIVE);
        listing.setCreatedAt(LocalDateTime.now());
        listing.setUpdatedAt(LocalDateTime.now());
        
        AdoptionListing saved = adoptionListingRepository.save(listing);
        return convertToDto(saved);
    }
    
    public Optional<AdoptionListingDto> updateAdoptionListing(Long id, UpdateAdoptionListingRequest request, Long userId) {
        return adoptionListingRepository.findById(id)
                .filter(listing -> listing.getUser().getId().equals(userId))
                .map(listing -> {
                    if (request.getTitle() != null) listing.setTitle(request.getTitle());
                    if (request.getDescription() != null) listing.setDescription(request.getDescription());
                    if (request.getLocation() != null) listing.setLocation(request.getLocation());
                    if (request.getAdoptionFee() != null) listing.setAdoptionFee(BigDecimal.valueOf(request.getAdoptionFee()));
                    if (request.getStatus() != null) listing.setStatus(AdoptionStatus.valueOf(request.getStatus()));
                    listing.setUpdatedAt(LocalDateTime.now());
                    
                    AdoptionListing updated = adoptionListingRepository.save(listing);
                    return convertToDto(updated);
                });
    }
    
    public boolean deleteAdoptionListing(Long id, Long userId) {
        return adoptionListingRepository.findById(id)
                .filter(listing -> listing.getUser().getId().equals(userId))
                .map(listing -> {
                    adoptionListingRepository.delete(listing);
                    return true;
                })
                .orElse(false);
    }
    
    public List<AdoptionListingDto> getAdoptionListingsByOwner(Long userId) {
        return adoptionListingRepository.findByUserId(userId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<AdoptionListingDto> getAllListings(String type, String breed, String city, String status, Boolean isUrgent, Boolean isVerified, Pageable pageable) {
        // Implementation for paginated search
        return adoptionListingRepository.findAll(pageable).getContent().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public Optional<AdoptionListingDto> getListingById(Long id) {
        return getAdoptionListingById(id);
    }
    
    public List<AdoptionListingDto> getListingsByUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return getAdoptionListingsByOwner(user.getId());
    }
    
    public AdoptionListingDto createListing(CreateAdoptionListingRequest request, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return createAdoptionListing(request, user.getId());
    }
    
    public Optional<AdoptionListingDto> updateListing(Long id, UpdateAdoptionListingRequest request, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return updateAdoptionListing(id, request, user.getId());
    }
    
    public void deleteListing(Long id, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        deleteAdoptionListing(id, user.getId());
    }
    
    public String uploadListingImage(Long id, MultipartFile file, Authentication authentication) {
        // Implementation for image upload
        return "Image uploaded successfully";
    }
    
    public void deleteListingImage(Long id, int imageIndex, Authentication authentication) {
        // Implementation for image deletion
    }
    
    public Object applyForAdoption(Long listingId, String message, Authentication authentication) {
        // Implementation for adoption application
        return new Object();
    }
    
    public List<Object> getApplications(Long listingId, Authentication authentication) {
        // Implementation for getting applications
        return new ArrayList<>();
    }
    
    public Object updateApplicationStatus(Long listingId, Long applicationId, String status, Authentication authentication) {
        // Implementation for updating application status
        return new Object();
    }
    
    public List<AdoptionListingDto> searchListings(String title, String type, String breed, String gender, String size, String city, Integer minAge, Integer maxAge, Double minFee, Double maxFee, Boolean isUrgent, Boolean isVerified) {
        // Implementation for advanced search
        return new ArrayList<>();
    }
    
    public Object getAdoptionStats() {
        // Implementation for adoption statistics
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalListings", adoptionListingRepository.count());
        stats.put("activeListings", adoptionListingRepository.findByStatus(AdoptionStatus.ACTIVE).size());
        return stats;
    }
    
    public boolean updateListingStatus(Long id, String status, Authentication authentication) {
        // Implementation for updating listing status
        return true;
    }
    
    public boolean verifyListing(Long id, Authentication authentication) {
        // Implementation for verifying listing
        return true;
    }
    
    public boolean markAsUrgent(Long id, Authentication authentication) {
        // Implementation for marking as urgent
        return true;
    }
    
    private AdoptionListingDto convertToDto(AdoptionListing listing) {
        AdoptionListingDto dto = new AdoptionListingDto();
        dto.setId(listing.getId());
        dto.setPetId(listing.getPet().getId());
        dto.setOwnerId(listing.getUser().getId());
        dto.setTitle(listing.getTitle());
        dto.setDescription(listing.getDescription());
        dto.setLocation(listing.getLocation());
        dto.setListingType(listing.getType().name());
        dto.setAdoptionFee(listing.getAdoptionFee().doubleValue());
        dto.setStatus(listing.getStatus());
        dto.setCreatedAt(listing.getCreatedAt());
        dto.setUpdatedAt(listing.getUpdatedAt());
        return dto;
    }
}
