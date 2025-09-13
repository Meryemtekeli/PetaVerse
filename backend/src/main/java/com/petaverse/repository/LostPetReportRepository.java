package com.petaverse.repository;

import com.petaverse.entity.LostPetReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LostPetReportRepository extends JpaRepository<LostPetReport, Long> {
    
    List<LostPetReport> findByStatus(com.petaverse.entity.PetStatus status);
    
    List<LostPetReport> findByLocationContainingIgnoreCase(String location);
    
    List<LostPetReport> findByPetId(Long petId);
    
    List<LostPetReport> findByReporterId(Long reporterId);
    
    @Query("SELECT lpr FROM LostPetReport lpr WHERE lpr.pet.petType = :petType")
    List<LostPetReport> findByPetType(@Param("petType") String petType);
    
    @Query("SELECT lpr FROM LostPetReport lpr WHERE lpr.location LIKE %:city%")
    List<LostPetReport> findByCity(@Param("city") String city);
    
    // Map-related queries
    List<LostPetReport> findByStatusAndLatitudeIsNotNullAndLongitudeIsNotNull(com.petaverse.entity.PetStatus status);
}
