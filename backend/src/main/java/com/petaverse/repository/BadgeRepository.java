package com.petaverse.repository;

import com.petaverse.entity.Badge;
import com.petaverse.entity.BadgeType;
import com.petaverse.entity.BadgeRarity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BadgeRepository extends JpaRepository<Badge, Long> {
    
    List<Badge> findByIsActiveTrueOrderBySortOrderAsc();
    
    List<Badge> findByTypeAndIsActiveTrueOrderBySortOrderAsc(BadgeType type);
    
    List<Badge> findByRarityAndIsActiveTrueOrderBySortOrderAsc(BadgeRarity rarity);
    
    @Query("SELECT b FROM Badge b WHERE b.isActive = true AND b.type = :type ORDER BY b.sortOrder ASC")
    List<Badge> findActiveByType(@Param("type") BadgeType type);
    
    @Query("SELECT b FROM Badge b WHERE b.isActive = true AND b.rarity = :rarity ORDER BY b.sortOrder ASC")
    List<Badge> findActiveByRarity(@Param("rarity") BadgeRarity rarity);
    
    Optional<Badge> findByNameAndIsActiveTrue(String name);
}
