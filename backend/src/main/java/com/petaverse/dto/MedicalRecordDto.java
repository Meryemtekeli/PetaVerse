package com.petaverse.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicalRecordDto {
    
    private Long id;
    private Long petId;
    private String recordType;
    private String description;
    private String veterinarianName;
    private String clinicName;
    private LocalDateTime recordDate;
    private LocalDateTime nextVisitDate;
    private Double cost;
    private String attachments;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
