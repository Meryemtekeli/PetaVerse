package com.petaverse.service;

import com.petaverse.dto.VaccinationRecordDto;
import com.petaverse.entity.VaccinationRecord;
import com.petaverse.entity.Pet;
import com.petaverse.repository.VaccinationRecordRepository;
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
public class VaccinationRecordService {
    
    private final VaccinationRecordRepository vaccinationRecordRepository;
    private final PetRepository petRepository;
    
    public List<VaccinationRecordDto> getVaccinationRecordsByPetId(Long petId) {
        return vaccinationRecordRepository.findByPetIdOrderByVaccinationDateDesc(petId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<VaccinationRecordDto> getVaccinationRecordsByPetIdAndVaccine(Long petId, String vaccineName) {
        return vaccinationRecordRepository.findByPetIdAndVaccineNameOrderByVaccinationDateDesc(petId, vaccineName)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<VaccinationRecordDto> getUpcomingVaccinations(Long petId) {
        return vaccinationRecordRepository.findUpcomingVaccinations(petId, LocalDateTime.now())
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public Optional<VaccinationRecordDto> getVaccinationRecordById(Long id) {
        return vaccinationRecordRepository.findById(id)
                .map(this::convertToDto);
    }
    
    public VaccinationRecordDto createVaccinationRecord(VaccinationRecordDto vaccinationRecordDto) {
        Pet pet = petRepository.findById(vaccinationRecordDto.getPetId())
                .orElseThrow(() -> new RuntimeException("Pet not found"));
        
        VaccinationRecord vaccinationRecord = new VaccinationRecord();
        vaccinationRecord.setPet(pet);
        vaccinationRecord.setVaccineName(vaccinationRecordDto.getVaccineName());
        vaccinationRecord.setVaccinationDate(vaccinationRecordDto.getVaccinationDate());
        vaccinationRecord.setNextVaccinationDate(vaccinationRecordDto.getNextVaccinationDate());
        vaccinationRecord.setVeterinarianName(vaccinationRecordDto.getVeterinarianName());
        vaccinationRecord.setClinicName(vaccinationRecordDto.getClinicName());
        vaccinationRecord.setBatchNumber(vaccinationRecordDto.getBatchNumber());
        vaccinationRecord.setManufacturer(vaccinationRecordDto.getManufacturer());
        vaccinationRecord.setNotes(vaccinationRecordDto.getNotes());
        
        VaccinationRecord saved = vaccinationRecordRepository.save(vaccinationRecord);
        return convertToDto(saved);
    }
    
    public Optional<VaccinationRecordDto> updateVaccinationRecord(Long id, VaccinationRecordDto vaccinationRecordDto) {
        return vaccinationRecordRepository.findById(id)
                .map(vaccinationRecord -> {
                    if (vaccinationRecordDto.getVaccineName() != null) {
                        vaccinationRecord.setVaccineName(vaccinationRecordDto.getVaccineName());
                    }
                    if (vaccinationRecordDto.getVaccinationDate() != null) {
                        vaccinationRecord.setVaccinationDate(vaccinationRecordDto.getVaccinationDate());
                    }
                    if (vaccinationRecordDto.getNextVaccinationDate() != null) {
                        vaccinationRecord.setNextVaccinationDate(vaccinationRecordDto.getNextVaccinationDate());
                    }
                    if (vaccinationRecordDto.getVeterinarianName() != null) {
                        vaccinationRecord.setVeterinarianName(vaccinationRecordDto.getVeterinarianName());
                    }
                    if (vaccinationRecordDto.getClinicName() != null) {
                        vaccinationRecord.setClinicName(vaccinationRecordDto.getClinicName());
                    }
                    if (vaccinationRecordDto.getBatchNumber() != null) {
                        vaccinationRecord.setBatchNumber(vaccinationRecordDto.getBatchNumber());
                    }
                    if (vaccinationRecordDto.getManufacturer() != null) {
                        vaccinationRecord.setManufacturer(vaccinationRecordDto.getManufacturer());
                    }
                    if (vaccinationRecordDto.getNotes() != null) {
                        vaccinationRecord.setNotes(vaccinationRecordDto.getNotes());
                    }
                    
                    VaccinationRecord updated = vaccinationRecordRepository.save(vaccinationRecord);
                    return convertToDto(updated);
                });
    }
    
    public boolean deleteVaccinationRecord(Long id) {
        return vaccinationRecordRepository.findById(id)
                .map(vaccinationRecord -> {
                    vaccinationRecordRepository.delete(vaccinationRecord);
                    return true;
                })
                .orElse(false);
    }
    
    public List<VaccinationRecordDto> getVaccinationRecordsByVeterinarian(String veterinarianName) {
        return vaccinationRecordRepository.findByVeterinarianName(veterinarianName)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<VaccinationRecordDto> getVaccinationRecordsByClinic(String clinicName) {
        return vaccinationRecordRepository.findByClinicName(clinicName)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<VaccinationRecordDto> getVaccinationRecordsByManufacturer(String manufacturer) {
        return vaccinationRecordRepository.findByManufacturer(manufacturer)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<String> getDistinctVaccineNames() {
        return vaccinationRecordRepository.findDistinctVaccineNames();
    }
    
    private VaccinationRecordDto convertToDto(VaccinationRecord vaccinationRecord) {
        VaccinationRecordDto dto = new VaccinationRecordDto();
        dto.setId(vaccinationRecord.getId());
        dto.setPetId(vaccinationRecord.getPet().getId());
        dto.setVaccineName(vaccinationRecord.getVaccineName());
        dto.setVaccinationDate(vaccinationRecord.getVaccinationDate());
        dto.setNextVaccinationDate(vaccinationRecord.getNextVaccinationDate());
        dto.setVeterinarianName(vaccinationRecord.getVeterinarianName());
        dto.setClinicName(vaccinationRecord.getClinicName());
        dto.setBatchNumber(vaccinationRecord.getBatchNumber());
        dto.setManufacturer(vaccinationRecord.getManufacturer());
        dto.setNotes(vaccinationRecord.getNotes());
        dto.setCreatedAt(vaccinationRecord.getCreatedAt());
        dto.setUpdatedAt(vaccinationRecord.getUpdatedAt());
        return dto;
    }
}
