package com.petaverse.repository;

import com.petaverse.entity.Pet;
import com.petaverse.entity.PetStatus;
import com.petaverse.entity.PetType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PetRepository extends JpaRepository<Pet, Long> {
    
    List<Pet> findByOwnerId(Long ownerId);
    
    List<Pet> findByType(PetType type);
    
    Page<Pet> findByType(PetType type, Pageable pageable);
    
    List<Pet> findByStatus(PetStatus status);
    
    Page<Pet> findByStatus(PetStatus status, Pageable pageable);
    
    List<Pet> findByBreed(String breed);
    
    Page<Pet> findByBreedContainingIgnoreCase(String breed, Pageable pageable);
    
    List<Pet> findByGender(String gender);
    
    List<Pet> findBySize(String size);
    
    @Query("SELECT p FROM Pet p WHERE p.owner.id = :ownerId AND p.status = :status")
    List<Pet> findByOwnerIdAndStatus(@Param("ownerId") Long ownerId, @Param("status") PetStatus status);
    
    @Query("SELECT p FROM Pet p WHERE p.type = :type AND p.status = 'ACTIVE'")
    List<Pet> findActivePetsByType(@Param("type") PetType type);
    
    @Query("SELECT p FROM Pet p WHERE p.birthDate >= :minDate AND p.birthDate <= :maxDate")
    List<Pet> findByBirthDateRange(@Param("minDate") LocalDate minDate, @Param("maxDate") LocalDate maxDate);
    
    @Query("SELECT p FROM Pet p WHERE p.weight BETWEEN :minWeight AND :maxWeight")
    List<Pet> findByWeightRange(@Param("minWeight") Double minWeight, @Param("maxWeight") Double maxWeight);
    
    @Query("SELECT p FROM Pet p WHERE p.isNeutered = :neutered")
    List<Pet> findByNeuteredStatus(@Param("neutered") boolean neutered);
    
    @Query("SELECT p FROM Pet p WHERE p.isVaccinated = :vaccinated")
    List<Pet> findByVaccinatedStatus(@Param("vaccinated") boolean vaccinated);
    
    @Query("SELECT p FROM Pet p WHERE p.isMicrochipped = :microchipped")
    List<Pet> findByMicrochippedStatus(@Param("microchipped") boolean microchipped);
    
    @Query("SELECT DISTINCT p.breed FROM Pet p WHERE p.type = :type AND p.breed IS NOT NULL")
    List<String> findDistinctBreedsByType(@Param("type") PetType type);
    
    @Query("SELECT p FROM Pet p WHERE p.owner.city = :city AND p.status = 'ACTIVE'")
    List<Pet> findActivePetsByCity(@Param("city") String city);
    
    @Query("SELECT p FROM Pet p WHERE p.owner.city LIKE %:city%")
    Page<Pet> findByOwnerCityContainingIgnoreCase(@Param("city") String city, Pageable pageable);
    
    @Query("SELECT COUNT(p) FROM Pet p WHERE p.owner.id = :ownerId")
    Long countPetsByOwnerId(@Param("ownerId") Long ownerId);
    
    @Query("SELECT COUNT(p) FROM Pet p WHERE p.type = :type AND p.status = 'ACTIVE'")
    Long countActivePetsByType(@Param("type") PetType type);
    
    @Query("SELECT COUNT(p) FROM Pet p WHERE p.status = :status")
    Long countByStatus(@Param("status") PetStatus status);
    
    @Query("SELECT p.type, COUNT(p) FROM Pet p GROUP BY p.type")
    List<Object[]> countByType();
} 