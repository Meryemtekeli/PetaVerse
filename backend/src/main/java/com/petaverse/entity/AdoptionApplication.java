package com.petaverse.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "adoption_applications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdoptionApplication {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "adoption_listing_id", nullable = false)
    private AdoptionListing adoptionListing;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "applicant_id", nullable = false)
    private User applicant;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private AdoptionStatus status = AdoptionStatus.PENDING;
    
    @Column(name = "motivation", columnDefinition = "TEXT")
    private String motivation;
    
    @Column(name = "experience_with_pets")
    private String experienceWithPets;
    
    @Column(name = "living_situation")
    private String livingSituation;
    
    @Column(name = "work_schedule")
    private String workSchedule;
    
    @Column(name = "other_pets")
    private String otherPets;
    
    @Column(name = "children_in_home")
    private Boolean childrenInHome;
    
    @Column(name = "allergies")
    private String allergies;
    
    @Column(name = "financial_stability")
    private String financialStability;
    
    @Column(name = "references")
    private String references;
    
    @Column(name = "home_visit_scheduled")
    private LocalDateTime homeVisitScheduled;
    
    @Column(name = "home_visit_completed")
    private Boolean homeVisitCompleted = false;
    
    @Column(name = "home_visit_notes")
    private String homeVisitNotes;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
