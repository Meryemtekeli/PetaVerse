package com.petaverse.controller;

import com.petaverse.dto.VaccinationRecordDto;
import com.petaverse.service.VaccinationRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/vaccination-records")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class VaccinationRecordController {
    
    private final VaccinationRecordService vaccinationRecordService;
    
    @GetMapping("/pet/{petId}")
    public ResponseEntity<List<VaccinationRecordDto>> getVaccinationRecordsByPetId(@PathVariable Long petId) {
        List<VaccinationRecordDto> records = vaccinationRecordService.getVaccinationRecordsByPetId(petId);
        return ResponseEntity.ok(records);
    }
    
    @GetMapping("/pet/{petId}/vaccine/{vaccineName}")
    public ResponseEntity<List<VaccinationRecordDto>> getVaccinationRecordsByPetIdAndVaccine(
            @PathVariable Long petId, 
            @PathVariable String vaccineName) {
        List<VaccinationRecordDto> records = vaccinationRecordService.getVaccinationRecordsByPetIdAndVaccine(petId, vaccineName);
        return ResponseEntity.ok(records);
    }
    
    @GetMapping("/pet/{petId}/upcoming")
    public ResponseEntity<List<VaccinationRecordDto>> getUpcomingVaccinations(@PathVariable Long petId) {
        List<VaccinationRecordDto> records = vaccinationRecordService.getUpcomingVaccinations(petId);
        return ResponseEntity.ok(records);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<VaccinationRecordDto> getVaccinationRecordById(@PathVariable Long id) {
        Optional<VaccinationRecordDto> record = vaccinationRecordService.getVaccinationRecordById(id);
        return record.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<VaccinationRecordDto> createVaccinationRecord(@RequestBody VaccinationRecordDto vaccinationRecordDto) {
        VaccinationRecordDto created = vaccinationRecordService.createVaccinationRecord(vaccinationRecordDto);
        return ResponseEntity.ok(created);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<VaccinationRecordDto> updateVaccinationRecord(
            @PathVariable Long id, 
            @RequestBody VaccinationRecordDto vaccinationRecordDto) {
        Optional<VaccinationRecordDto> updated = vaccinationRecordService.updateVaccinationRecord(id, vaccinationRecordDto);
        return updated.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVaccinationRecord(@PathVariable Long id) {
        boolean deleted = vaccinationRecordService.deleteVaccinationRecord(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/veterinarian/{veterinarianName}")
    public ResponseEntity<List<VaccinationRecordDto>> getVaccinationRecordsByVeterinarian(
            @PathVariable String veterinarianName) {
        List<VaccinationRecordDto> records = vaccinationRecordService.getVaccinationRecordsByVeterinarian(veterinarianName);
        return ResponseEntity.ok(records);
    }
    
    @GetMapping("/clinic/{clinicName}")
    public ResponseEntity<List<VaccinationRecordDto>> getVaccinationRecordsByClinic(
            @PathVariable String clinicName) {
        List<VaccinationRecordDto> records = vaccinationRecordService.getVaccinationRecordsByClinic(clinicName);
        return ResponseEntity.ok(records);
    }
    
    @GetMapping("/manufacturer/{manufacturer}")
    public ResponseEntity<List<VaccinationRecordDto>> getVaccinationRecordsByManufacturer(
            @PathVariable String manufacturer) {
        List<VaccinationRecordDto> records = vaccinationRecordService.getVaccinationRecordsByManufacturer(manufacturer);
        return ResponseEntity.ok(records);
    }
    
    @GetMapping("/vaccines")
    public ResponseEntity<List<String>> getDistinctVaccineNames() {
        List<String> vaccineNames = vaccinationRecordService.getDistinctVaccineNames();
        return ResponseEntity.ok(vaccineNames);
    }
}
