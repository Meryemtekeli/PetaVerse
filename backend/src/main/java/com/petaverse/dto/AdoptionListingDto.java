package com.petaverse.dto;

import com.petaverse.entity.AdoptionStatus;
import com.petaverse.entity.ListingType;

import java.time.LocalDateTime;
import java.util.List;

public class AdoptionListingDto {
    
    private Long id;
    private String title;
    private String description;
    private PetDto pet;
    private UserDto user;
    private AdoptionStatus status;
    private ListingType type;
    private Double adoptionFee;
    private String location;
    private Double latitude;
    private Double longitude;
    private String requirements;
    private String contactInfo;
    private boolean isUrgent;
    private boolean isVerified;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime expiresAt;
    private List<String> imageUrls;
    private String mainImageUrl;
    private int applicationCount;
    private int viewCount;
    
    public AdoptionListingDto() {}
    
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
    
    public PetDto getPet() {
        return pet;
    }
    
    public void setPet(PetDto pet) {
        this.pet = pet;
    }
    
    public UserDto getUser() {
        return user;
    }
    
    public void setUser(UserDto user) {
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
    
    public Double getAdoptionFee() {
        return adoptionFee;
    }
    
    public void setAdoptionFee(Double adoptionFee) {
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
    
    public List<String> getImageUrls() {
        return imageUrls;
    }
    
    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }
    
    public String getMainImageUrl() {
        return mainImageUrl;
    }
    
    public void setMainImageUrl(String mainImageUrl) {
        this.mainImageUrl = mainImageUrl;
    }
    
    public int getApplicationCount() {
        return applicationCount;
    }
    
    public void setApplicationCount(int applicationCount) {
        this.applicationCount = applicationCount;
    }
    
    public int getViewCount() {
        return viewCount;
    }
    
    public void setViewCount(int viewCount) {
        this.viewCount = viewCount;
    }
} 