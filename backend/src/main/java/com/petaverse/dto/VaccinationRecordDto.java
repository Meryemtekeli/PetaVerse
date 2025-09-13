package com.petaverse.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VaccinationRecordDto {
    
    private Long id;
    private Long petId;
    private String vaccineName;
    private LocalDateTime vaccinationDate;
    private LocalDateTime nextVaccinationDate;
    private String veterinarianName;
    private String clinicName;
    private String batchNumber;
    private String manufacturer;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
