package com.petaverse.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdoptionApplicationDto {
    
    private Long id;
    private Long adoptionListingId;
    private Long applicantId;
    private String status;
    private String motivation;
    private String experienceWithPets;
    private String livingSituation;
    private String workSchedule;
    private String otherPets;
    private Boolean childrenInHome;
    private String allergies;
    private String financialStability;
    private String references;
    private LocalDateTime homeVisitScheduled;
    private Boolean homeVisitCompleted;
    private String homeVisitNotes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Additional fields for display
    private String applicantName;
    private String applicantEmail;
    private String petName;
    private String listingTitle;
}
