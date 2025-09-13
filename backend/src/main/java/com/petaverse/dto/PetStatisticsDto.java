package com.petaverse.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.Map;

@Schema(description = "Evcil hayvan istatistikleri DTO'su")
public class PetStatisticsDto {
    
    @Schema(description = "Toplam evcil hayvan sayısı")
    @JsonProperty("totalPets")
    private long totalPets;
    
    @Schema(description = "Aktif evcil hayvan sayısı")
    @JsonProperty("activePets")
    private long activePets;
    
    @Schema(description = "Sahiplendirilen evcil hayvan sayısı")
    @JsonProperty("adoptedPets")
    private long adoptedPets;
    
    @Schema(description = "Kayıp evcil hayvan sayısı")
    @JsonProperty("lostPets")
    private long lostPets;
    
    @Schema(description = "Vefat eden evcil hayvan sayısı")
    @JsonProperty("deceasedPets")
    private long deceasedPets;
    
    @Schema(description = "Tür bazında evcil hayvan sayıları")
    @JsonProperty("byType")
    private Map<String, Long> byType;
    
    @Schema(description = "Cinsiyet bazında evcil hayvan sayıları")
    @JsonProperty("byGender")
    private Map<String, Long> byGender;
    
    @Schema(description = "Boyut bazında evcil hayvan sayıları")
    @JsonProperty("bySize")
    private Map<String, Long> bySize;
    
    @Schema(description = "Aşılı evcil hayvan sayısı")
    @JsonProperty("vaccinatedPets")
    private long vaccinatedPets;
    
    @Schema(description = "Kısırlaştırılmış evcil hayvan sayısı")
    @JsonProperty("neuteredPets")
    private long neuteredPets;
    
    @Schema(description = "Mikroçipli evcil hayvan sayısı")
    @JsonProperty("microchippedPets")
    private long microchippedPets;
    
    @Schema(description = "Ortalama yaş")
    @JsonProperty("averageAge")
    private double averageAge;
    
    @Schema(description = "Ortalama kilo")
    @JsonProperty("averageWeight")
    private double averageWeight;
    
    public PetStatisticsDto() {}
    
    public PetStatisticsDto(long totalPets, long activePets, long adoptedPets, long lostPets, 
                           long deceasedPets, Map<String, Long> byType, Map<String, Long> byGender, 
                           Map<String, Long> bySize, long vaccinatedPets, long neuteredPets, 
                           long microchippedPets, double averageAge, double averageWeight) {
        this.totalPets = totalPets;
        this.activePets = activePets;
        this.adoptedPets = adoptedPets;
        this.lostPets = lostPets;
        this.deceasedPets = deceasedPets;
        this.byType = byType;
        this.byGender = byGender;
        this.bySize = bySize;
        this.vaccinatedPets = vaccinatedPets;
        this.neuteredPets = neuteredPets;
        this.microchippedPets = microchippedPets;
        this.averageAge = averageAge;
        this.averageWeight = averageWeight;
    }
    
    // Getters and Setters
    public long getTotalPets() {
        return totalPets;
    }
    
    public void setTotalPets(long totalPets) {
        this.totalPets = totalPets;
    }
    
    public long getActivePets() {
        return activePets;
    }
    
    public void setActivePets(long activePets) {
        this.activePets = activePets;
    }
    
    public long getAdoptedPets() {
        return adoptedPets;
    }
    
    public void setAdoptedPets(long adoptedPets) {
        this.adoptedPets = adoptedPets;
    }
    
    public long getLostPets() {
        return lostPets;
    }
    
    public void setLostPets(long lostPets) {
        this.lostPets = lostPets;
    }
    
    public long getDeceasedPets() {
        return deceasedPets;
    }
    
    public void setDeceasedPets(long deceasedPets) {
        this.deceasedPets = deceasedPets;
    }
    
    public Map<String, Long> getByType() {
        return byType;
    }
    
    public void setByType(Map<String, Long> byType) {
        this.byType = byType;
    }
    
    public Map<String, Long> getByGender() {
        return byGender;
    }
    
    public void setByGender(Map<String, Long> byGender) {
        this.byGender = byGender;
    }
    
    public Map<String, Long> getBySize() {
        return bySize;
    }
    
    public void setBySize(Map<String, Long> bySize) {
        this.bySize = bySize;
    }
    
    public long getVaccinatedPets() {
        return vaccinatedPets;
    }
    
    public void setVaccinatedPets(long vaccinatedPets) {
        this.vaccinatedPets = vaccinatedPets;
    }
    
    public long getNeuteredPets() {
        return neuteredPets;
    }
    
    public void setNeuteredPets(long neuteredPets) {
        this.neuteredPets = neuteredPets;
    }
    
    public long getMicrochippedPets() {
        return microchippedPets;
    }
    
    public void setMicrochippedPets(long microchippedPets) {
        this.microchippedPets = microchippedPets;
    }
    
    public double getAverageAge() {
        return averageAge;
    }
    
    public void setAverageAge(double averageAge) {
        this.averageAge = averageAge;
    }
    
    public double getAverageWeight() {
        return averageWeight;
    }
    
    public void setAverageWeight(double averageWeight) {
        this.averageWeight = averageWeight;
    }
    
    @Override
    public String toString() {
        return "PetStatisticsDto{" +
                "totalPets=" + totalPets +
                ", activePets=" + activePets +
                ", adoptedPets=" + adoptedPets +
                ", lostPets=" + lostPets +
                ", deceasedPets=" + deceasedPets +
                ", byType=" + byType +
                ", byGender=" + byGender +
                ", bySize=" + bySize +
                ", vaccinatedPets=" + vaccinatedPets +
                ", neuteredPets=" + neuteredPets +
                ", microchippedPets=" + microchippedPets +
                ", averageAge=" + averageAge +
                ", averageWeight=" + averageWeight +
                '}';
    }
}
