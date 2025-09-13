package com.petaverse.service;

import com.petaverse.entity.*;
import com.petaverse.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class BadgeService {
    
    @Autowired
    private BadgeRepository badgeRepository;
    
    @Autowired
    private UserBadgeRepository userBadgeRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PetRepository petRepository;
    
    @Autowired
    private AdoptionListingRepository adoptionListingRepository;
    
    @Autowired
    private AdoptionApplicationRepository adoptionApplicationRepository;
    
    @Autowired
    private MessageRepository messageRepository;
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private NotificationService notificationService;
    
    public void checkAndAwardBadges(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Check all badge types
        checkAdoptionBadges(user);
        checkListingBadges(user);
        checkMessageBadges(user);
        checkPaymentBadges(user);
        checkTimeBasedBadges(user);
        checkSocialBadges(user);
    }
    
    private void checkAdoptionBadges(User user) {
        // First Adoption Badge
        checkBadge(user, "first_adoption", () -> {
            long adoptionCount = adoptionApplicationRepository.findByApplicantIdAndStatus(
                    user.getId(), AdoptionStatus.APPROVED).size();
            return adoptionCount >= 1;
        });
        
        // Adoption Master Badge
        checkBadge(user, "adoption_master", () -> {
            long adoptionCount = adoptionApplicationRepository.findByApplicantIdAndStatus(
                    user.getId(), AdoptionStatus.APPROVED).size();
            return adoptionCount >= 10;
        });
        
        // Adoption Hero Badge
        checkBadge(user, "adoption_hero", () -> {
            long adoptionCount = adoptionApplicationRepository.findByApplicantIdAndStatus(
                    user.getId(), AdoptionStatus.APPROVED).size();
            return adoptionCount >= 50;
        });
    }
    
    private void checkListingBadges(User user) {
        // First Listing Badge
        checkBadge(user, "first_listing", () -> {
            long listingCount = adoptionListingRepository.findByOwnerId(user.getId()).size();
            return listingCount >= 1;
        });
        
        // Listing Master Badge
        checkBadge(user, "listing_master", () -> {
            long listingCount = adoptionListingRepository.findByOwnerId(user.getId()).size();
            return listingCount >= 5;
        });
        
        // Pet Owner Badge
        checkBadge(user, "pet_owner", () -> {
            long petCount = petRepository.findByOwnerId(user.getId()).size();
            return petCount >= 1;
        });
        
        // Multi Pet Owner Badge
        checkBadge(user, "multi_pet_owner", () -> {
            long petCount = petRepository.findByOwnerId(user.getId()).size();
            return petCount >= 3;
        });
    }
    
    private void checkMessageBadges(User user) {
        // First Message Badge
        checkBadge(user, "first_message", () -> {
            long messageCount = messageRepository.findBySenderId(user.getId()).size();
            return messageCount >= 1;
        });
        
        // Chatty Badge
        checkBadge(user, "chatty", () -> {
            long messageCount = messageRepository.findBySenderId(user.getId()).size();
            return messageCount >= 100;
        });
        
        // Social Butterfly Badge
        checkBadge(user, "social_butterfly", () -> {
            long messageCount = messageRepository.findBySenderId(user.getId()).size();
            return messageCount >= 500;
        });
    }
    
    private void checkPaymentBadges(User user) {
        // First Payment Badge
        checkBadge(user, "first_payment", () -> {
            long paymentCount = paymentRepository.findByUserAndStatus(user, PaymentStatus.COMPLETED).size();
            return paymentCount >= 1;
        });
        
        // Generous Badge
        checkBadge(user, "generous", () -> {
            java.math.BigDecimal totalPaid = paymentRepository.getTotalPaidByUser(user);
            return totalPaid != null && totalPaid.compareTo(new java.math.BigDecimal("1000")) >= 0;
        });
        
        // Philanthropist Badge
        checkBadge(user, "philanthropist", () -> {
            java.math.BigDecimal totalPaid = paymentRepository.getTotalPaidByUser(user);
            return totalPaid != null && totalPaid.compareTo(new java.math.BigDecimal("5000")) >= 0;
        });
    }
    
    private void checkTimeBasedBadges(User user) {
        // Early Bird Badge
        checkBadge(user, "early_bird", () -> {
            LocalDateTime oneWeekAgo = LocalDateTime.now().minusWeeks(1);
            return user.getCreatedAt().isAfter(oneWeekAgo);
        });
        
        // Veteran Badge
        checkBadge(user, "veteran", () -> {
            LocalDateTime oneYearAgo = LocalDateTime.now().minusYears(1);
            return user.getCreatedAt().isBefore(oneYearAgo);
        });
        
        // Daily User Badge
        checkBadge(user, "daily_user", () -> {
            LocalDateTime oneDayAgo = LocalDateTime.now().minusDays(1);
            long recentMessages = messageRepository.findBySenderIdAndCreatedAtAfter(user.getId(), oneDayAgo).size();
            return recentMessages >= 5;
        });
    }
    
    private void checkSocialBadges(User user) {
        // Helper Badge
        checkBadge(user, "helper", () -> {
            long lostPetReports = 0; // TODO: Implement lost pet reports
            return lostPetReports >= 1;
        });
        
        // Community Leader Badge
        checkBadge(user, "community_leader", () -> {
            long totalActivity = adoptionListingRepository.findByOwnerId(user.getId()).size() +
                                adoptionApplicationRepository.findByApplicantId(user.getId()).size() +
                                messageRepository.findBySenderId(user.getId()).size();
            return totalActivity >= 100;
        });
    }
    
    private void checkBadge(User user, String badgeName, BadgeCheckFunction checkFunction) {
        Optional<Badge> badgeOpt = badgeRepository.findByNameAndIsActiveTrue(badgeName);
        if (badgeOpt.isEmpty()) return;
        
        Badge badge = badgeOpt.get();
        Optional<UserBadge> userBadgeOpt = userBadgeRepository.findByUserAndBadge(user, badge);
        
        UserBadge userBadge;
        if (userBadgeOpt.isPresent()) {
            userBadge = userBadgeOpt.get();
            if (userBadge.isEarned()) return; // Already earned
        } else {
            userBadge = new UserBadge(user, badge);
            userBadgeRepository.save(userBadge);
        }
        
        // Check if badge should be earned
        if (checkFunction.check()) {
            userBadge.setEarned(true);
            userBadgeRepository.save(userBadge);
            
            // Send notification
            notificationService.createNotification(
                    user, 
                    "Yeni Rozet Kazandınız! 🏆", 
                    badge.getDisplayName() + " rozetini kazandınız: " + badge.getDescription(),
                    NotificationType.SYSTEM_ANNOUNCEMENT,
                    "/badges",
                    null
            );
        }
    }
    
    public List<UserBadge> getUserBadges(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return userBadgeRepository.findByUserOrderByEarnedAtDesc(user);
    }
    
    public List<UserBadge> getEarnedBadges(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return userBadgeRepository.findByUserAndIsEarnedTrueOrderByEarnedAtDesc(user);
    }
    
    public List<UserBadge> getProgressBadges(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return userBadgeRepository.findProgressBadgesByUser(user);
    }
    
    public List<Badge> getAllBadges() {
        return badgeRepository.findByIsActiveTrueOrderBySortOrderAsc();
    }
    
    public List<Badge> getBadgesByType(BadgeType type) {
        return badgeRepository.findByTypeAndIsActiveTrueOrderBySortOrderAsc(type);
    }
    
    public List<Badge> getBadgesByRarity(BadgeRarity rarity) {
        return badgeRepository.findByRarityAndIsActiveTrueOrderBySortOrderAsc(rarity);
    }
    
    public BadgeStatistics getBadgeStatistics(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        BadgeStatistics stats = new BadgeStatistics();
        stats.setTotalBadges(badgeRepository.count());
        stats.setEarnedBadges(userBadgeRepository.countEarnedBadgesByUser(user));
        stats.setProgressBadges(userBadgeRepository.findProgressBadgesByUser(user).size());
        stats.setCompletionPercentage(calculateCompletionPercentage(user));
        
        return stats;
    }
    
    private double calculateCompletionPercentage(User user) {
        long totalBadges = badgeRepository.count();
        long earnedBadges = userBadgeRepository.countEarnedBadgesByUser(user);
        
        if (totalBadges == 0) return 0.0;
        return (double) earnedBadges / totalBadges * 100;
    }
    
    public void initializeUserBadges(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Badge> allBadges = badgeRepository.findByIsActiveTrueOrderBySortOrderAsc();
        
        for (Badge badge : allBadges) {
            Optional<UserBadge> existingUserBadge = userBadgeRepository.findByUserAndBadge(user, badge);
            if (existingUserBadge.isEmpty()) {
                UserBadge userBadge = new UserBadge(user, badge);
                userBadgeRepository.save(userBadge);
            }
        }
        
        // Check for badges that might already be earned
        checkAndAwardBadges(userId);
    }
    
    // Functional interface for badge checking
    @FunctionalInterface
    private interface BadgeCheckFunction {
        boolean check();
    }
    
    // Data class for statistics
    public static class BadgeStatistics {
        private long totalBadges;
        private long earnedBadges;
        private long progressBadges;
        private double completionPercentage;
        
        // Getters and setters
        public long getTotalBadges() { return totalBadges; }
        public void setTotalBadges(long totalBadges) { this.totalBadges = totalBadges; }
        
        public long getEarnedBadges() { return earnedBadges; }
        public void setEarnedBadges(long earnedBadges) { this.earnedBadges = earnedBadges; }
        
        public long getProgressBadges() { return progressBadges; }
        public void setProgressBadges(long progressBadges) { this.progressBadges = progressBadges; }
        
        public double getCompletionPercentage() { return completionPercentage; }
        public void setCompletionPercentage(double completionPercentage) { this.completionPercentage = completionPercentage; }
    }
}
