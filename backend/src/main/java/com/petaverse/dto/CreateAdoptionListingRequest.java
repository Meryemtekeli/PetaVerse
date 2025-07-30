package com.petaverse.dto;

import com.petaverse.entity.ListingType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CreateAdoptionListingRequest {
    
    @NotBlank(message = "İlan başlığı boş olamaz")
    @Size(max = 200, message = "İlan başlığı en fazla 200 karakter olabilir")
    private String title;
    
    @NotBlank(message = "İlan açıklaması boş olamaz")
    @Size(max = 2000, message = "İlan açıklaması en fazla 2000 karakter olabilir")
    private String description;
    
    @NotNull(message = "Evcil hayvan ID'si gereklidir")
    private Long petId;
    
    @NotNull(message = "İlan türü seçilmelidir")
    private ListingType type;
    
    private Double adoptionFee;
    
    @NotBlank(message = "Konum bilgisi gereklidir")
    @Size(max = 200, message = "Konum en fazla 200 karakter olabilir")
    private String location;
    
    private Double latitude;
    
    private Double longitude;
    
    @Size(max = 1000, message = "Gereksinimler en fazla 1000 karakter olabilir")
    private String requirements;
    
    @Size(max = 500, message = "İletişim bilgileri en fazla 500 karakter olabilir")
    private String contactInfo;
    
    private boolean isUrgent = false;
    
    public CreateAdoptionListingRequest() {}
    
    // Getters and Setters
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
    
    public Long getPetId() {
        return petId;
    }
    
    public void setPetId(Long petId) {
        this.petId = petId;
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
} 