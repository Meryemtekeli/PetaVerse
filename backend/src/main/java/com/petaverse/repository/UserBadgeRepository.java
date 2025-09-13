package com.petaverse.repository;

import com.petaverse.entity.UserBadge;
import com.petaverse.entity.User;
import com.petaverse.entity.Badge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserBadgeRepository extends JpaRepository<UserBadge, Long> {
    
    List<UserBadge> findByUserOrderByEarnedAtDesc(User user);
    
    List<UserBadge> findByUserAndIsEarnedTrueOrderByEarnedAtDesc(User user);
    
    List<UserBadge> findByUserAndIsDisplayedTrueOrderByEarnedAtDesc(User user);
    
    @Query("SELECT ub FROM UserBadge ub WHERE ub.user = :user AND ub.badge.type = :type ORDER BY ub.earnedAt DESC")
    List<UserBadge> findByUserAndBadgeType(@Param("user") User user, @Param("type") com.petaverse.entity.BadgeType type);
    
    @Query("SELECT ub FROM UserBadge ub WHERE ub.user = :user AND ub.badge.rarity = :rarity ORDER BY ub.earnedAt DESC")
    List<UserBadge> findByUserAndBadgeRarity(@Param("user") User user, @Param("rarity") com.petaverse.entity.BadgeRarity rarity);
    
    Optional<UserBadge> findByUserAndBadge(User user, Badge badge);
    
    @Query("SELECT COUNT(ub) FROM UserBadge ub WHERE ub.user = :user AND ub.isEarned = true")
    Long countEarnedBadgesByUser(@Param("user") User user);
    
    @Query("SELECT ub FROM UserBadge ub WHERE ub.user = :user AND ub.isEarned = false AND ub.progress > 0 ORDER BY ub.progress DESC")
    List<UserBadge> findProgressBadgesByUser(@Param("user") User user);
    
    @Query("SELECT ub FROM UserBadge ub WHERE ub.user = :user AND ub.isEarned = true AND ub.earnedAt >= :since ORDER BY ub.earnedAt DESC")
    List<UserBadge> findRecentlyEarnedBadges(@Param("user") User user, @Param("since") java.time.LocalDateTime since);
}
