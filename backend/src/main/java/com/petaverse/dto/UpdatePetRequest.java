package com.petaverse.dto;

import com.petaverse.entity.PetType;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public class UpdatePetRequest {
    
    @Size(max = 100, message = "Evcil hayvan adı en fazla 100 karakter olabilir")
    private String name;
    
    private PetType type;
    
    @Size(max = 100, message = "Irk en fazla 100 karakter olabilir")
    private String breed;
    
    @Size(max = 50, message = "Renk en fazla 50 karakter olabilir")
    private String color;
    
    private LocalDate birthDate;
    
    private Double weight;
    
    @Size(max = 20, message = "Cinsiyet en fazla 20 karakter olabilir")
    private String gender;
    
    @Size(max = 20, message = "Boyut en fazla 20 karakter olabilir")
    private String size;
    
    @Size(max = 1000, message = "Açıklama en fazla 1000 karakter olabilir")
    private String description;
    
    private Boolean isNeutered;
    
    private Boolean isVaccinated;
    
    @Size(max = 500, message = "Sağlık notları en fazla 500 karakter olabilir")
    private String healthNotes;
    
    @Size(max = 500, message = "Davranış notları en fazla 500 karakter olabilir")
    private String behaviorNotes;
    
    @Size(max = 500, message = "Özel ihtiyaçlar en fazla 500 karakter olabilir")
    private String specialNeeds;
    
    private Boolean isMicrochipped;
    
    @Size(max = 50, message = "Mikroçip numarası en fazla 50 karakter olabilir")
    private String microchipNumber;
    
    private String status;
    
    public UpdatePetRequest() {}
    
    // Getters and Setters
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
    
    public Boolean getIsNeutered() {
        return isNeutered;
    }
    
    public void setIsNeutered(Boolean neutered) {
        isNeutered = neutered;
    }
    
    public Boolean getIsVaccinated() {
        return isVaccinated;
    }
    
    public void setIsVaccinated(Boolean vaccinated) {
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
    
    public Boolean getIsMicrochipped() {
        return isMicrochipped;
    }
    
    public void setIsMicrochipped(Boolean microchipped) {
        isMicrochipped = microchipped;
    }
    
    public String getMicrochipNumber() {
        return microchipNumber;
    }
    
    public void setMicrochipNumber(String microchipNumber) {
        this.microchipNumber = microchipNumber;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
} 