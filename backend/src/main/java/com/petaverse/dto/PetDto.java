package com.petaverse.dto;

import com.petaverse.entity.PetStatus;
import com.petaverse.entity.PetType;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class PetDto {
    
    private Long id;
    private String name;
    private PetType type;
    private String breed;
    private String color;
    private LocalDate birthDate;
    private Integer age;
    private Double weight;
    private String gender;
    private String size;
    private String description;
    private String mainImageUrl;
    private List<String> imageUrls;
    private List<String> videoUrls;
    private PetStatus status;
    private boolean isNeutered;
    private boolean isVaccinated;
    private String healthNotes;
    private String behaviorNotes;
    private String specialNeeds;
    private boolean isMicrochipped;
    private String microchipNumber;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private UserDto owner;
    
    public PetDto() {}
    
    public PetDto(Long id, String name, PetType type) {
        this.id = id;
        this.name = name;
        this.type = type;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public PetType getType() {
        return type;
    }
    
    public void setType(PetType type) {
        this.type = type;
    }
    
    public String getBreed() {
        return breed;
    }
    
    public void setBreed(String breed) {
        this.breed = breed;
    }
    
    public String getColor() {
        return color;
    }
    
    public void setColor(String color) {
        this.color = color;
    }
    
    public LocalDate getBirthDate() {
        return birthDate;
    }
    
    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }
    
    public Integer getAge() {
        return age;
    }
    
    public void setAge(Integer age) {
        this.age = age;
    }
    
    public Double getWeight() {
        return weight;
    }
    
    public void setWeight(Double weight) {
        this.weight = weight;
    }
    
    public String getGender() {
        return gender;
    }
    
    public void setGender(String gender) {
        this.gender = gender;
    }
    
    public String getSize() {
        return size;
    }
    
    public void setSize(String size) {
        this.size = size;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getMainImageUrl() {
        return mainImageUrl;
    }
    
    public void setMainImageUrl(String mainImageUrl) {
        this.mainImageUrl = mainImageUrl;
    }
    
    public List<String> getImageUrls() {
        return imageUrls;
    }
    
    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }
    
    public List<String> getVideoUrls() {
        return videoUrls;
    }
    
    public void setVideoUrls(List<String> videoUrls) {
        this.videoUrls = videoUrls;
    }
    
    public PetStatus getStatus() {
        return status;
    }
    
    public void setStatus(PetStatus status) {
        this.status = status;
    }
    
    public boolean isNeutered() {
        return isNeutered;
    }
    
    public void setNeutered(boolean neutered) {
        isNeutered = neutered;
    }
    
    public boolean isVaccinated() {
        return isVaccinated;
    }
    
    public void setVaccinated(boolean vaccinated) {
        isVaccinated = vaccinated;
    }
    
    public String getHealthNotes() {
        return healthNotes;
    }
    
    public void setHealthNotes(String healthNotes) {
        this.healthNotes = healthNotes;
    }
    
    public String getBehaviorNotes() {
        return behaviorNotes;
    }
    
    public void setBehaviorNotes(String behaviorNotes) {
        this.behaviorNotes = behaviorNotes;
    }
    
    public String getSpecialNeeds() {
        return specialNeeds;
    }
    
    public void setSpecialNeeds(String specialNeeds) {
        this.specialNeeds = specialNeeds;
    }
    
    public boolean isMicrochipped() {
        return isMicrochipped;
    }
    
    public void setMicrochipped(boolean microchipped) {
        isMicrochipped = microchipped;
    }
    
    public String getMicrochipNumber() {
        return microchipNumber;
    }
    
    public void setMicrochipNumber(String microchipNumber) {
        this.microchipNumber = microchipNumber;
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
    
    public UserDto getOwner() {
        return owner;
    }
    
    public void setOwner(UserDto owner) {
        this.owner = owner;
    }
} 