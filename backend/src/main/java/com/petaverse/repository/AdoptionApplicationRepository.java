package com.petaverse.repository;

import com.petaverse.entity.AdoptionApplication;
import com.petaverse.entity.AdoptionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AdoptionApplicationRepository extends JpaRepository<AdoptionApplication, Long> {
    
    List<AdoptionApplication> findByAdoptionListingIdOrderByCreatedAtDesc(Long listingId);
    
    List<AdoptionApplication> findByApplicantIdOrderByCreatedAtDesc(Long applicantId);
    
    List<AdoptionApplication> findByStatusOrderByCreatedAtDesc(AdoptionStatus status);
    
    List<AdoptionApplication> findByAdoptionListingIdAndStatusOrderByCreatedAtDesc(Long listingId, AdoptionStatus status);
    
    @Query("SELECT aa FROM AdoptionApplication aa WHERE aa.adoptionListing.user.id = :ownerId ORDER BY aa.createdAt DESC")
    List<AdoptionApplication> findByOwnerId(@Param("ownerId") Long ownerId);
    
    @Query("SELECT aa FROM AdoptionApplication aa WHERE aa.adoptionListing.user.id = :ownerId AND aa.status = :status ORDER BY aa.createdAt DESC")
    List<AdoptionApplication> findByOwnerIdAndStatus(@Param("ownerId") Long ownerId, @Param("status") AdoptionStatus status);
    
    @Query("SELECT aa FROM AdoptionApplication aa WHERE aa.applicant.id = :applicantId AND aa.status = :status ORDER BY aa.createdAt DESC")
    List<AdoptionApplication> findByApplicantIdAndStatus(@Param("applicantId") Long applicantId, @Param("status") AdoptionStatus status);
    
    @Query("SELECT aa FROM AdoptionApplication aa WHERE aa.homeVisitScheduled IS NOT NULL AND aa.homeVisitScheduled BETWEEN :startDate AND :endDate ORDER BY aa.homeVisitScheduled ASC")
    List<AdoptionApplication> findScheduledHomeVisits(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT aa FROM AdoptionApplication aa WHERE aa.homeVisitCompleted = false AND aa.homeVisitScheduled IS NOT NULL AND aa.homeVisitScheduled <= :date ORDER BY aa.homeVisitScheduled ASC")
    List<AdoptionApplication> findOverdueHomeVisits(@Param("date") LocalDateTime date);
    
    long countByAdoptionListingIdAndStatus(Long listingId, AdoptionStatus status);
    
    long countByApplicantIdAndStatus(Long applicantId, AdoptionStatus status);
    
    @Query("SELECT COUNT(aa) FROM AdoptionApplication aa WHERE aa.adoptionListing.user.id = :ownerId AND aa.status = :status")
    long countByOwnerIdAndStatus(@Param("ownerId") Long ownerId, @Param("status") AdoptionStatus status);
}
