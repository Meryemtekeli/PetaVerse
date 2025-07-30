package com.petaverse.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "adoption_listings")
@EntityListeners(AuditingEntityListener.class)
public class AdoptionListing {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Size(max = 200)
    private String title;
    
    @Size(max = 2000)
    private String description;
    
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pet_id", nullable = false)
    private Pet pet;
    
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Enumerated(EnumType.STRING)
    private AdoptionStatus status = AdoptionStatus.ACTIVE;
    
    @Enumerated(EnumType.STRING)
    private ListingType type = ListingType.FREE;
    
    private BigDecimal adoptionFee;
    
    @Size(max = 255)
    private String location;
    
    private Double latitude;
    
    private Double longitude;
    
    @Size(max = 1000)
    private String requirements;
    
    @Size(max = 500)
    private String contactInfo;
    
    private boolean isUrgent = false;
    
    private boolean isVerified = false;
    
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    private LocalDateTime expiresAt;
    
    // Relationships
    @OneToMany(mappedBy = "adoptionListing", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<AdoptionApplication> applications = new ArrayList<>();
    
    @OneToMany(mappedBy = "adoptionListing", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Message> messages = new ArrayList<>();
    
    // Constructors
    public AdoptionListing() {}
    
    public AdoptionListing(String title, Pet pet, User user) {
        this.title = title;
        this.pet = pet;
        this.user = user;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public Pet getPet() {
        return pet;
    }
    
    public void setPet(Pet pet) {
        this.pet = pet;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public AdoptionStatus getStatus() {
        return status;
    }
    
    public void setStatus(AdoptionStatus status) {
        this.status = status;
    }
    
    public ListingType getType() {
        return type;
    }
    
    public void setType(ListingType type) {
        this.type = type;
    }
    
    public BigDecimal getAdoptionFee() {
        return adoptionFee;
    }
    
    public void setAdoptionFee(BigDecimal adoptionFee) {
        this.adoptionFee = adoptionFee;
    }
    
    public String getLocation() {
        return location;
    }
    
    public void setLocation(String location) {
        this.location = location;
    }
    
    public Double getLatitude() {
        return latitude;
    }
    
    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }
    
    public Double getLongitude() {
        return longitude;
    }
    
    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }
    
    public String getRequirements() {
        return requirements;
    }
    
    public void setRequirements(String requirements) {
        this.requirements = requirements;
    }
    
    public String getContactInfo() {
        return contactInfo;
    }
    
    public void setContactInfo(String contactInfo) {
        this.contactInfo = contactInfo;
    }
    
    public boolean isUrgent() {
        return isUrgent;
    }
    
    public void setUrgent(boolean urgent) {
        isUrgent = urgent;
    }
    
    public boolean isVerified() {
        return isVerified;
    }
    
    public void setVerified(boolean verified) {
        isVerified = verified;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }
    
    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }
    
    public List<AdoptionApplication> getApplications() {
        return applications;
    }
    
    public void setApplications(List<AdoptionApplication> applications) {
        this.applications = applications;
    }
    
    public List<Message> getMessages() {
        return messages;
    }
    
    public void setMessages(List<Message> messages) {
        this.messages = messages;
    }
    
    // Helper methods
    public boolean isExpired() {
        return expiresAt != null && LocalDateTime.now().isAfter(expiresAt);
    }
    
    public boolean isActive() {
        return status == AdoptionStatus.ACTIVE && !isExpired();
    }
    
    public int getApplicationCount() {
        return applications != null ? applications.size() : 0;
    }
} 