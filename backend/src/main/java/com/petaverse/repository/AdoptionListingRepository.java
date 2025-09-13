package com.petaverse.repository;

import com.petaverse.entity.AdoptionListing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdoptionListingRepository extends JpaRepository<AdoptionListing, Long> {
    
    List<AdoptionListing> findByListingType(String listingType);
    
    List<AdoptionListing> findByLocationContainingIgnoreCase(String location);
    
    List<AdoptionListing> findByOwnerId(Long ownerId);
    
    List<AdoptionListing> findByStatus(com.petaverse.entity.AdoptionStatus status);
    
    @Query("SELECT al FROM AdoptionListing al WHERE al.pet.petType = :petType")
    List<AdoptionListing> findByPetType(@Param("petType") String petType);
    
    @Query("SELECT al FROM AdoptionListing al WHERE al.adoptionFee <= :maxFee")
    List<AdoptionListing> findByMaxAdoptionFee(@Param("maxFee") Double maxFee);
    
    @Query("SELECT al FROM AdoptionListing al WHERE al.location LIKE %:city%")
    List<AdoptionListing> findByCity(@Param("city") String city);
    
    List<AdoptionListing> findByOwnerIdAndStatus(Long ownerId, com.petaverse.entity.AdoptionStatus status);
    
    List<AdoptionListing> findByUserId(Long userId);
}
