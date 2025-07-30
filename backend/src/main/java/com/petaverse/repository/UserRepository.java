package com.petaverse.repository;

import com.petaverse.entity.User;
import com.petaverse.entity.UserRole;
import com.petaverse.entity.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByUsername(String username);
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByPhoneNumber(String phoneNumber);
    
    boolean existsByUsername(String username);
    
    boolean existsByEmail(String email);
    
    boolean existsByPhoneNumber(String phoneNumber);
    
    List<User> findByRole(UserRole role);
    
    List<User> findByStatus(UserStatus status);
    
    @Query("SELECT u FROM User u WHERE u.city = :city")
    List<User> findByCity(@Param("city") String city);
    
    @Query("SELECT u FROM User u WHERE u.latitude BETWEEN :minLat AND :maxLat AND u.longitude BETWEEN :minLng AND :maxLng")
    List<User> findByLocationRange(@Param("minLat") Double minLat, 
                                   @Param("maxLat") Double maxLat,
                                   @Param("minLng") Double minLng, 
                                   @Param("maxLng") Double maxLng);
    
    @Query("SELECT u FROM User u WHERE u.emailVerified = true AND u.status = 'ACTIVE'")
    Page<User> findActiveVerifiedUsers(Pageable pageable);
    
    @Query("SELECT u FROM User u WHERE u.role = :role AND u.status = 'ACTIVE'")
    List<User> findActiveUsersByRole(@Param("role") UserRole role);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.createdAt >= :startDate")
    Long countUsersCreatedAfter(@Param("startDate") java.time.LocalDateTime startDate);
} 