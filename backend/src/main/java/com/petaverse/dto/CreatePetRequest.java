
package com.petaverse.dto;
import com.petaverse.entity.PetStatus;
import com.petaverse.entity.PetType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Past;

import java.time.LocalDate;
import java.util.List;

public class CreatePetRequest {
    
    @NotBlank(message = "Evcil hayvan adı boş olamaz")
    @Size(max = 100, message = "Evcil hayvan adı en fazla 100 karakter olabilir")
    private String name;
    
    @NotNull(message = "Evcil hayvan türü seçilmelidir")
    private PetType type;
    
    @Size(max = 100, message = "Irk en fazla 100 karakter olabilir")
    private String breed;
    
    @Size(max = 50, message = "Renk en fazla 50 karakter olabilir")
    private String color;
    
    @Past(message = "Doğum tarihi geçmiş bir tarih olmalıdır")
    private LocalDate birthDate;
    
    @Positive(message = "Kilo pozitif bir değer olmalıdır")
    private Double weight; // kg cinsinden
    
    @Size(max = 10, message = "Cinsiyet en fazla 10 karakter olabilir")
    private String gender; // MALE, FEMALE
    
    @Size(max = 20, message = "Boyut en fazla 20 karakter olabilir")
    private String size; // SMALL, MEDIUM, LARGE
    
    @Size(max = 1000, message = "Açıklama en fazla 1000 karakter olabilir")
    private String description;
    
    // Yeni eklenen alanlar
    @Size(max = 255, message = "Ana resim URL'si en fazla 255 karakter olabilir")
    private String mainImageUrl;
    
    private List<String> imageUrls;
    
    private List<String> videoUrls;
    
    @NotNull(message = "Evcil hayvan durumu seçilmelidir")
    private PetStatus status = PetStatus.ACTIVE;
    
    private boolean isNeutered = false;
    
    private boolean isVaccinated = false;
    
    @Size(max = 500, message = "Sağlık notları en fazla 500 karakter olabilir")
    private String healthNotes;
    
    @Size(max = 500, message = "Davranış notları en fazla 500 karakter olabilir")
    private String behaviorNotes;
    
    @Size(max = 500, message = "Özel ihtiyaçlar en fazla 500 karakter olabilir")
    private String specialNeeds;
    
    private boolean isMicrochipped = false;
    
    @Size(max = 50, message = "Mikroçip numarası en fazla 50 karakter olabilir")
    private String microchipNumber;
    
    // Owner ID field'ı ekleniyor
    @NotNull(message = "Sahip ID'si gereklidir")
    private Long ownerId;
    
    public CreatePetRequest() {}
    
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
    
    public Long getOwnerId() {
        return ownerId;
    }
    
    public void setOwnerId(Long ownerId) {
        this.ownerId = ownerId;
    }
    
    // toString method'u ekleniyor
    @Override
    public String toString() {
        return "CreatePetRequest{" +
                "name='" + name + '\'' +
                ", type=" + type +
                ", breed='" + breed + '\'' +
                ", color='" + color + '\'' +
                ", birthDate=" + birthDate +
                ", weight=" + weight +
                ", gender='" + gender + '\'' +
                ", size='" + size + '\'' +
                ", description='" + description + '\'' +
                ", mainImageUrl='" + mainImageUrl + '\'' +
                ", imageUrls=" + imageUrls +
                ", videoUrls=" + videoUrls +
                ", status=" + status +
                ", isNeutered=" + isNeutered +
                ", isVaccinated=" + isVaccinated +
                ", healthNotes='" + healthNotes + '\'' +
                ", behaviorNotes='" + behaviorNotes + '\'' +
                ", specialNeeds='" + specialNeeds + '\'' +
                ", isMicrochipped=" + isMicrochipped +
                ", microchipNumber='" + microchipNumber + '\'' +
                ", ownerId=" + ownerId +
                '}';
    }
} 