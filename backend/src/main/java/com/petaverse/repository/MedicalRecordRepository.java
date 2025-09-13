package com.petaverse.repository;

import com.petaverse.entity.MedicalRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {
    
    List<MedicalRecord> findByPetIdOrderByRecordDateDesc(Long petId);
    
    List<MedicalRecord> findByPetIdAndRecordTypeOrderByRecordDateDesc(Long petId, String recordType);
    
    @Query("SELECT mr FROM MedicalRecord mr WHERE mr.pet.id = :petId AND mr.recordDate BETWEEN :startDate AND :endDate ORDER BY mr.recordDate DESC")
    List<MedicalRecord> findByPetIdAndDateRange(@Param("petId") Long petId, 
                                               @Param("startDate") LocalDateTime startDate, 
                                               @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT mr FROM MedicalRecord mr WHERE mr.pet.id = :petId AND mr.nextVisitDate IS NOT NULL AND mr.nextVisitDate <= :date ORDER BY mr.nextVisitDate ASC")
    List<MedicalRecord> findUpcomingVisits(@Param("petId") Long petId, @Param("date") LocalDateTime date);
    
    @Query("SELECT mr FROM MedicalRecord mr WHERE mr.veterinarianName = :veterinarianName ORDER BY mr.recordDate DESC")
    List<MedicalRecord> findByVeterinarianName(@Param("veterinarianName") String veterinarianName);
    
    @Query("SELECT mr FROM MedicalRecord mr WHERE mr.clinicName = :clinicName ORDER BY mr.recordDate DESC")
    List<MedicalRecord> findByClinicName(@Param("clinicName") String clinicName);
}
