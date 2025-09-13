package com.petaverse.controller;

import com.petaverse.dto.MedicalRecordDto;
import com.petaverse.service.MedicalRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/medical-records")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MedicalRecordController {
    
    private final MedicalRecordService medicalRecordService;
    
    @GetMapping("/pet/{petId}")
    public ResponseEntity<List<MedicalRecordDto>> getMedicalRecordsByPetId(@PathVariable Long petId) {
        List<MedicalRecordDto> records = medicalRecordService.getMedicalRecordsByPetId(petId);
        return ResponseEntity.ok(records);
    }
    
    @GetMapping("/pet/{petId}/type/{recordType}")
    public ResponseEntity<List<MedicalRecordDto>> getMedicalRecordsByPetIdAndType(
            @PathVariable Long petId, 
            @PathVariable String recordType) {
        List<MedicalRecordDto> records = medicalRecordService.getMedicalRecordsByPetIdAndType(petId, recordType);
        return ResponseEntity.ok(records);
    }
    
    @GetMapping("/pet/{petId}/upcoming")
    public ResponseEntity<List<MedicalRecordDto>> getUpcomingVisits(@PathVariable Long petId) {
        List<MedicalRecordDto> records = medicalRecordService.getUpcomingVisits(petId);
        return ResponseEntity.ok(records);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<MedicalRecordDto> getMedicalRecordById(@PathVariable Long id) {
        Optional<MedicalRecordDto> record = medicalRecordService.getMedicalRecordById(id);
        return record.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<MedicalRecordDto> createMedicalRecord(@RequestBody MedicalRecordDto medicalRecordDto) {
        MedicalRecordDto created = medicalRecordService.createMedicalRecord(medicalRecordDto);
        return ResponseEntity.ok(created);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<MedicalRecordDto> updateMedicalRecord(
            @PathVariable Long id, 
            @RequestBody MedicalRecordDto medicalRecordDto) {
        Optional<MedicalRecordDto> updated = medicalRecordService.updateMedicalRecord(id, medicalRecordDto);
        return updated.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedicalRecord(@PathVariable Long id) {
        boolean deleted = medicalRecordService.deleteMedicalRecord(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/veterinarian/{veterinarianName}")
    public ResponseEntity<List<MedicalRecordDto>> getMedicalRecordsByVeterinarian(
            @PathVariable String veterinarianName) {
        List<MedicalRecordDto> records = medicalRecordService.getMedicalRecordsByVeterinarian(veterinarianName);
        return ResponseEntity.ok(records);
    }
    
    @GetMapping("/clinic/{clinicName}")
    public ResponseEntity<List<MedicalRecordDto>> getMedicalRecordsByClinic(
            @PathVariable String clinicName) {
        List<MedicalRecordDto> records = medicalRecordService.getMedicalRecordsByClinic(clinicName);
        return ResponseEntity.ok(records);
    }
}
