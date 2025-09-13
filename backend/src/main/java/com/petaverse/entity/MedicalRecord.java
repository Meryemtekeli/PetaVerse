package com.petaverse.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "medical_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicalRecord {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pet_id", nullable = false)
    private Pet pet;
    
    @Column(name = "record_type", nullable = false)
    private String recordType; // VACCINATION, TREATMENT, SURGERY, CHECKUP
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "veterinarian_name")
    private String veterinarianName;
    
    @Column(name = "clinic_name")
    private String clinicName;
    
    @Column(name = "record_date", nullable = false)
    private LocalDateTime recordDate;
    
    @Column(name = "next_visit_date")
    private LocalDateTime nextVisitDate;
    
    @Column(name = "cost")
    private Double cost;
    
    @Column(name = "attachments")
    private String attachments; // Comma-separated file paths
    
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
