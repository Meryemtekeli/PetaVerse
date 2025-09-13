package com.petaverse.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "vaccination_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VaccinationRecord {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pet_id", nullable = false)
    private Pet pet;
    
    @Column(name = "vaccine_name", nullable = false)
    private String vaccineName;
    
    @Column(name = "vaccination_date", nullable = false)
    private LocalDateTime vaccinationDate;
    
    @Column(name = "next_vaccination_date")
    private LocalDateTime nextVaccinationDate;
    
    @Column(name = "veterinarian_name")
    private String veterinarianName;
    
    @Column(name = "clinic_name")
    private String clinicName;
    
    @Column(name = "batch_number")
    private String batchNumber;
    
    @Column(name = "manufacturer")
    private String manufacturer;
    
    @Column(name = "notes")
    private String notes;
    
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
