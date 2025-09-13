package com.petaverse.service;

import com.petaverse.dto.MedicalRecordDto;
import com.petaverse.entity.MedicalRecord;
import com.petaverse.entity.Pet;
import com.petaverse.repository.MedicalRecordRepository;
import com.petaverse.repository.PetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class MedicalRecordService {
    
    private final MedicalRecordRepository medicalRecordRepository;
    private final PetRepository petRepository;
    
    public List<MedicalRecordDto> getMedicalRecordsByPetId(Long petId) {
        return medicalRecordRepository.findByPetIdOrderByRecordDateDesc(petId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<MedicalRecordDto> getMedicalRecordsByPetIdAndType(Long petId, String recordType) {
        return medicalRecordRepository.findByPetIdAndRecordTypeOrderByRecordDateDesc(petId, recordType)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<MedicalRecordDto> getUpcomingVisits(Long petId) {
        return medicalRecordRepository.findUpcomingVisits(petId, LocalDateTime.now())
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public Optional<MedicalRecordDto> getMedicalRecordById(Long id) {
        return medicalRecordRepository.findById(id)
                .map(this::convertToDto);
    }
    
    public MedicalRecordDto createMedicalRecord(MedicalRecordDto medicalRecordDto) {
        Pet pet = petRepository.findById(medicalRecordDto.getPetId())
                .orElseThrow(() -> new RuntimeException("Pet not found"));
        
        MedicalRecord medicalRecord = new MedicalRecord();
        medicalRecord.setPet(pet);
        medicalRecord.setRecordType(medicalRecordDto.getRecordType());
        medicalRecord.setDescription(medicalRecordDto.getDescription());
        medicalRecord.setVeterinarianName(medicalRecordDto.getVeterinarianName());
        medicalRecord.setClinicName(medicalRecordDto.getClinicName());
        medicalRecord.setRecordDate(medicalRecordDto.getRecordDate());
        medicalRecord.setNextVisitDate(medicalRecordDto.getNextVisitDate());
        medicalRecord.setCost(medicalRecordDto.getCost());
        medicalRecord.setAttachments(medicalRecordDto.getAttachments());
        
        MedicalRecord saved = medicalRecordRepository.save(medicalRecord);
        return convertToDto(saved);
    }
    
    public Optional<MedicalRecordDto> updateMedicalRecord(Long id, MedicalRecordDto medicalRecordDto) {
        return medicalRecordRepository.findById(id)
                .map(medicalRecord -> {
                    if (medicalRecordDto.getRecordType() != null) {
                        medicalRecord.setRecordType(medicalRecordDto.getRecordType());
                    }
                    if (medicalRecordDto.getDescription() != null) {
                        medicalRecord.setDescription(medicalRecordDto.getDescription());
                    }
                    if (medicalRecordDto.getVeterinarianName() != null) {
                        medicalRecord.setVeterinarianName(medicalRecordDto.getVeterinarianName());
                    }
                    if (medicalRecordDto.getClinicName() != null) {
                        medicalRecord.setClinicName(medicalRecordDto.getClinicName());
                    }
                    if (medicalRecordDto.getRecordDate() != null) {
                        medicalRecord.setRecordDate(medicalRecordDto.getRecordDate());
                    }
                    if (medicalRecordDto.getNextVisitDate() != null) {
                        medicalRecord.setNextVisitDate(medicalRecordDto.getNextVisitDate());
                    }
                    if (medicalRecordDto.getCost() != null) {
                        medicalRecord.setCost(medicalRecordDto.getCost());
                    }
                    if (medicalRecordDto.getAttachments() != null) {
                        medicalRecord.setAttachments(medicalRecordDto.getAttachments());
                    }
                    
                    MedicalRecord updated = medicalRecordRepository.save(medicalRecord);
                    return convertToDto(updated);
                });
    }
    
    public boolean deleteMedicalRecord(Long id) {
        return medicalRecordRepository.findById(id)
                .map(medicalRecord -> {
                    medicalRecordRepository.delete(medicalRecord);
                    return true;
                })
                .orElse(false);
    }
    
    public List<MedicalRecordDto> getMedicalRecordsByVeterinarian(String veterinarianName) {
        return medicalRecordRepository.findByVeterinarianName(veterinarianName)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<MedicalRecordDto> getMedicalRecordsByClinic(String clinicName) {
        return medicalRecordRepository.findByClinicName(clinicName)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    private MedicalRecordDto convertToDto(MedicalRecord medicalRecord) {
        MedicalRecordDto dto = new MedicalRecordDto();
        dto.setId(medicalRecord.getId());
        dto.setPetId(medicalRecord.getPet().getId());
        dto.setRecordType(medicalRecord.getRecordType());
        dto.setDescription(medicalRecord.getDescription());
        dto.setVeterinarianName(medicalRecord.getVeterinarianName());
        dto.setClinicName(medicalRecord.getClinicName());
        dto.setRecordDate(medicalRecord.getRecordDate());
        dto.setNextVisitDate(medicalRecord.getNextVisitDate());
        dto.setCost(medicalRecord.getCost());
        dto.setAttachments(medicalRecord.getAttachments());
        dto.setCreatedAt(medicalRecord.getCreatedAt());
        dto.setUpdatedAt(medicalRecord.getUpdatedAt());
        return dto;
    }
}
