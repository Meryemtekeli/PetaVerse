package com.petaverse.repository;

import com.petaverse.entity.VaccinationRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface VaccinationRecordRepository extends JpaRepository<VaccinationRecord, Long> {
    
    List<VaccinationRecord> findByPetIdOrderByVaccinationDateDesc(Long petId);
    
    List<VaccinationRecord> findByPetIdAndVaccineNameOrderByVaccinationDateDesc(Long petId, String vaccineName);
    
    @Query("SELECT vr FROM VaccinationRecord vr WHERE vr.pet.id = :petId AND vr.nextVaccinationDate IS NOT NULL AND vr.nextVaccinationDate <= :date ORDER BY vr.nextVaccinationDate ASC")
    List<VaccinationRecord> findUpcomingVaccinations(@Param("petId") Long petId, @Param("date") LocalDateTime date);
    
    @Query("SELECT vr FROM VaccinationRecord vr WHERE vr.pet.id = :petId AND vr.vaccinationDate BETWEEN :startDate AND :endDate ORDER BY vr.vaccinationDate DESC")
    List<VaccinationRecord> findByPetIdAndDateRange(@Param("petId") Long petId, 
                                                   @Param("startDate") LocalDateTime startDate, 
                                                   @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT vr FROM VaccinationRecord vr WHERE vr.veterinarianName = :veterinarianName ORDER BY vr.vaccinationDate DESC")
    List<VaccinationRecord> findByVeterinarianName(@Param("veterinarianName") String veterinarianName);
    
    @Query("SELECT vr FROM VaccinationRecord vr WHERE vr.clinicName = :clinicName ORDER BY vr.vaccinationDate DESC")
    List<VaccinationRecord> findByClinicName(@Param("clinicName") String clinicName);
    
    @Query("SELECT vr FROM VaccinationRecord vr WHERE vr.manufacturer = :manufacturer ORDER BY vr.vaccinationDate DESC")
    List<VaccinationRecord> findByManufacturer(@Param("manufacturer") String manufacturer);
    
    @Query("SELECT DISTINCT vr.vaccineName FROM VaccinationRecord vr ORDER BY vr.vaccineName")
    List<String> findDistinctVaccineNames();
}
