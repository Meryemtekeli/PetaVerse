package com.petaverse.service;

import com.petaverse.entity.*;
import com.petaverse.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class AnalyticsService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PetRepository petRepository;
    
    @Autowired
    private AdoptionListingRepository adoptionListingRepository;
    
    @Autowired
    private AdoptionApplicationRepository adoptionApplicationRepository;
    
    @Autowired
    private LostPetReportRepository lostPetReportRepository;
    
    @Autowired
    private MessageRepository messageRepository;
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    public DashboardStats getDashboardStats() {
        DashboardStats stats = new DashboardStats();
        
        // User statistics
        stats.setTotalUsers(userRepository.count());
        stats.setActiveUsers(userRepository.findByStatus(UserStatus.ACTIVE).size());
        stats.setNewUsersThisMonth(getNewUsersThisMonth());
        
        // Pet statistics
        stats.setTotalPets(petRepository.count());
        stats.setDogs(petRepository.findByPetType(PetType.DOG).size());
        stats.setCats(petRepository.findByPetType(PetType.CAT).size());
        stats.setOtherPets(petRepository.count() - stats.getDogs() - stats.getCats());
        
        // Adoption statistics
        stats.setTotalAdoptionListings(adoptionListingRepository.count());
        stats.setActiveAdoptionListings(adoptionListingRepository.findByStatus(AdoptionStatus.ACTIVE).size());
        stats.setSuccessfulAdoptions(getSuccessfulAdoptions());
        stats.setAdoptionSuccessRate(calculateAdoptionSuccessRate());
        
        // Lost pet statistics
        stats.setTotalLostPetReports(lostPetReportRepository.count());
        stats.setActiveLostPetReports(lostPetReportRepository.findByStatus(PetStatus.LOST).size());
        stats.setFoundPets(getFoundPets());
        
        // Communication statistics
        stats.setTotalMessages(messageRepository.count());
        stats.setMessagesThisMonth(getMessagesThisMonth());
        
        // Notification statistics
        stats.setTotalNotifications(notificationRepository.count());
        stats.setUnreadNotifications(notificationRepository.findByStatus(NotificationStatus.UNREAD).size());
        
        return stats;
    }
    
    public UserAnalytics getUserAnalytics(Long userId) {
        UserAnalytics analytics = new UserAnalytics();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // User's pets
        List<Pet> userPets = petRepository.findByOwnerId(userId);
        analytics.setTotalPets(userPets.size());
        analytics.setDogs((int) userPets.stream().filter(p -> p.getPetType() == PetType.DOG).count());
        analytics.setCats((int) userPets.stream().filter(p -> p.getPetType() == PetType.CAT).count());
        
        // User's adoption listings
        List<AdoptionListing> userListings = adoptionListingRepository.findByOwnerId(userId);
        analytics.setAdoptionListings(userListings.size());
        analytics.setActiveListings((int) userListings.stream().filter(AdoptionListing::isActive).count());
        
        // User's adoption applications
        List<AdoptionApplication> userApplications = adoptionApplicationRepository.findByApplicantId(userId);
        analytics.setAdoptionApplications(userApplications.size());
        analytics.setApprovedApplications((int) userApplications.stream()
                .filter(app -> app.getStatus() == AdoptionStatus.APPROVED).count());
        
        // User's lost pet reports
        List<LostPetReport> userLostReports = lostPetReportRepository.findByReporterId(userId);
        analytics.setLostPetReports(userLostReports.size());
        analytics.setFoundPets((int) userLostReports.stream()
                .filter(report -> report.getStatus() == PetStatus.FOUND).count());
        
        // User's messages
        List<Message> userMessages = messageRepository.findBySenderIdAndReceiverIdOrderByCreatedAtDesc(userId, userId);
        analytics.setTotalMessages(userMessages.size());
        analytics.setMessagesThisMonth(getUserMessagesThisMonth(userId));
        
        return analytics;
    }
    
    public List<MonthlyStats> getMonthlyStats(int months) {
        List<MonthlyStats> monthlyStats = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();
        
        for (int i = months - 1; i >= 0; i--) {
            LocalDateTime monthStart = now.minusMonths(i).withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
            LocalDateTime monthEnd = monthStart.plusMonths(1).minusSeconds(1);
            
            MonthlyStats stats = new MonthlyStats();
            stats.setMonth(monthStart.getMonth().name());
            stats.setYear(monthStart.getYear());
            
            // Count new users
            stats.setNewUsers(userRepository.findByCreatedAtBetween(monthStart, monthEnd).size());
            
            // Count new pets
            stats.setNewPets(petRepository.findByCreatedAtBetween(monthStart, monthEnd).size());
            
            // Count new adoption listings
            stats.setNewAdoptionListings(adoptionListingRepository.findByCreatedAtBetween(monthStart, monthEnd).size());
            
            // Count new lost pet reports
            stats.setNewLostPetReports(lostPetReportRepository.findByCreatedAtBetween(monthStart, monthEnd).size());
            
            // Count messages
            stats.setMessages(getMessagesInPeriod(monthStart, monthEnd));
            
            monthlyStats.add(stats);
        }
        
        return monthlyStats;
    }
    
    public List<TopUser> getTopUsers(int limit) {
        List<TopUser> topUsers = new ArrayList<>();
        List<User> users = userRepository.findAll();
        
        for (User user : users) {
            TopUser topUser = new TopUser();
            topUser.setUserId(user.getId());
            topUser.setUserName(user.getFirstName() + " " + user.getLastName());
            topUser.setUserEmail(user.getEmail());
            topUser.setPetCount(petRepository.findByOwnerId(user.getId()).size());
            topUser.setAdoptionListings(adoptionListingRepository.findByOwnerId(user.getId()).size());
            topUser.setAdoptionApplications(adoptionApplicationRepository.findByApplicantId(user.getId()).size());
            topUser.setScore(calculateUserScore(user.getId()));
            
            topUsers.add(topUser);
        }
        
        topUsers.sort((a, b) -> Integer.compare(b.getScore(), a.getScore()));
        return topUsers.stream().limit(limit).collect(java.util.stream.Collectors.toList());
    }
    
    public List<PetTypeStats> getPetTypeStats() {
        List<PetTypeStats> stats = new ArrayList<>();
        
        for (PetType type : PetType.values()) {
            PetTypeStats typeStats = new PetTypeStats();
            typeStats.setPetType(type.name());
            typeStats.setCount(petRepository.findByPetType(type).size());
            typeStats.setAdoptionListings(adoptionListingRepository.findByPetType(type.name()).size());
            typeStats.setLostReports(lostPetReportRepository.findByPetType(type.name()).size());
            
            stats.add(typeStats);
        }
        
        return stats;
    }
    
    public List<LocationStats> getLocationStats() {
        List<LocationStats> stats = new ArrayList<>();
        
        // Get all unique locations from adoption listings
        List<AdoptionListing> listings = adoptionListingRepository.findAll();
        Map<String, Integer> locationCounts = new HashMap<>();
        
        for (AdoptionListing listing : listings) {
            if (listing.getLocation() != null && !listing.getLocation().isEmpty()) {
                String city = extractCity(listing.getLocation());
                locationCounts.put(city, locationCounts.getOrDefault(city, 0) + 1);
            }
        }
        
        for (Map.Entry<String, Integer> entry : locationCounts.entrySet()) {
            LocationStats locationStats = new LocationStats();
            locationStats.setLocation(entry.getKey());
            locationStats.setAdoptionListings(entry.getValue());
            locationStats.setUsers(userRepository.findByLocationContainingIgnoreCase(entry.getKey()).size());
            
            stats.add(locationStats);
        }
        
        stats.sort((a, b) -> Integer.compare(b.getAdoptionListings(), a.getAdoptionListings()));
        return stats.stream().limit(10).collect(java.util.stream.Collectors.toList());
    }
    
    // Helper methods
    private long getNewUsersThisMonth() {
        LocalDateTime monthStart = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        return userRepository.findByCreatedAtBetween(monthStart, LocalDateTime.now()).size();
    }
    
    private long getSuccessfulAdoptions() {
        return adoptionApplicationRepository.findByStatus(AdoptionStatus.APPROVED).size();
    }
    
    private double calculateAdoptionSuccessRate() {
        long totalApplications = adoptionApplicationRepository.count();
        long successfulAdoptions = getSuccessfulAdoptions();
        return totalApplications > 0 ? (double) successfulAdoptions / totalApplications * 100 : 0;
    }
    
    private long getFoundPets() {
        return lostPetReportRepository.findByStatus(PetStatus.FOUND).size();
    }
    
    private long getMessagesThisMonth() {
        LocalDateTime monthStart = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        return getMessagesInPeriod(monthStart, LocalDateTime.now());
    }
    
    private long getUserMessagesThisMonth(Long userId) {
        LocalDateTime monthStart = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        return messageRepository.findBySenderIdAndCreatedAtAfter(userId, monthStart).size();
    }
    
    private long getMessagesInPeriod(LocalDateTime start, LocalDateTime end) {
        return messageRepository.findByCreatedAtBetween(start, end).size();
    }
    
    private int calculateUserScore(Long userId) {
        int score = 0;
        score += petRepository.findByOwnerId(userId).size() * 10;
        score += adoptionListingRepository.findByOwnerId(userId).size() * 15;
        score += adoptionApplicationRepository.findByApplicantId(userId).size() * 5;
        score += lostPetReportRepository.findByReporterId(userId).size() * 8;
        return score;
    }
    
    private String extractCity(String location) {
        if (location == null || location.isEmpty()) return "Unknown";
        String[] parts = location.split(",");
        return parts.length > 0 ? parts[0].trim() : location;
    }
    
    // Data classes
    public static class DashboardStats {
        private long totalUsers;
        private long activeUsers;
        private long newUsersThisMonth;
        private long totalPets;
        private long dogs;
        private long cats;
        private long otherPets;
        private long totalAdoptionListings;
        private long activeAdoptionListings;
        private long successfulAdoptions;
        private double adoptionSuccessRate;
        private long totalLostPetReports;
        private long activeLostPetReports;
        private long foundPets;
        private long totalMessages;
        private long messagesThisMonth;
        private long totalNotifications;
        private long unreadNotifications;
        
        // Getters and setters
        public long getTotalUsers() { return totalUsers; }
        public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }
        
        public long getActiveUsers() { return activeUsers; }
        public void setActiveUsers(long activeUsers) { this.activeUsers = activeUsers; }
        
        public long getNewUsersThisMonth() { return newUsersThisMonth; }
        public void setNewUsersThisMonth(long newUsersThisMonth) { this.newUsersThisMonth = newUsersThisMonth; }
        
        public long getTotalPets() { return totalPets; }
        public void setTotalPets(long totalPets) { this.totalPets = totalPets; }
        
        public long getDogs() { return dogs; }
        public void setDogs(long dogs) { this.dogs = dogs; }
        
        public long getCats() { return cats; }
        public void setCats(long cats) { this.cats = cats; }
        
        public long getOtherPets() { return otherPets; }
        public void setOtherPets(long otherPets) { this.otherPets = otherPets; }
        
        public long getTotalAdoptionListings() { return totalAdoptionListings; }
        public void setTotalAdoptionListings(long totalAdoptionListings) { this.totalAdoptionListings = totalAdoptionListings; }
        
        public long getActiveAdoptionListings() { return activeAdoptionListings; }
        public void setActiveAdoptionListings(long activeAdoptionListings) { this.activeAdoptionListings = activeAdoptionListings; }
        
        public long getSuccessfulAdoptions() { return successfulAdoptions; }
        public void setSuccessfulAdoptions(long successfulAdoptions) { this.successfulAdoptions = successfulAdoptions; }
        
        public double getAdoptionSuccessRate() { return adoptionSuccessRate; }
        public void setAdoptionSuccessRate(double adoptionSuccessRate) { this.adoptionSuccessRate = adoptionSuccessRate; }
        
        public long getTotalLostPetReports() { return totalLostPetReports; }
        public void setTotalLostPetReports(long totalLostPetReports) { this.totalLostPetReports = totalLostPetReports; }
        
        public long getActiveLostPetReports() { return activeLostPetReports; }
        public void setActiveLostPetReports(long activeLostPetReports) { this.activeLostPetReports = activeLostPetReports; }
        
        public long getFoundPets() { return foundPets; }
        public void setFoundPets(long foundPets) { this.foundPets = foundPets; }
        
        public long getTotalMessages() { return totalMessages; }
        public void setTotalMessages(long totalMessages) { this.totalMessages = totalMessages; }
        
        public long getMessagesThisMonth() { return messagesThisMonth; }
        public void setMessagesThisMonth(long messagesThisMonth) { this.messagesThisMonth = messagesThisMonth; }
        
        public long getTotalNotifications() { return totalNotifications; }
        public void setTotalNotifications(long totalNotifications) { this.totalNotifications = totalNotifications; }
        
        public long getUnreadNotifications() { return unreadNotifications; }
        public void setUnreadNotifications(long unreadNotifications) { this.unreadNotifications = unreadNotifications; }
    }
    
    public static class UserAnalytics {
        private int totalPets;
        private int dogs;
        private int cats;
        private int adoptionListings;
        private int activeListings;
        private int adoptionApplications;
        private int approvedApplications;
        private int lostPetReports;
        private int foundPets;
        private int totalMessages;
        private int messagesThisMonth;
        
        // Getters and setters
        public int getTotalPets() { return totalPets; }
        public void setTotalPets(int totalPets) { this.totalPets = totalPets; }
        
        public int getDogs() { return dogs; }
        public void setDogs(int dogs) { this.dogs = dogs; }
        
        public int getCats() { return cats; }
        public void setCats(int cats) { this.cats = cats; }
        
        public int getAdoptionListings() { return adoptionListings; }
        public void setAdoptionListings(int adoptionListings) { this.adoptionListings = adoptionListings; }
        
        public int getActiveListings() { return activeListings; }
        public void setActiveListings(int activeListings) { this.activeListings = activeListings; }
        
        public int getAdoptionApplications() { return adoptionApplications; }
        public void setAdoptionApplications(int adoptionApplications) { this.adoptionApplications = adoptionApplications; }
        
        public int getApprovedApplications() { return approvedApplications; }
        public void setApprovedApplications(int approvedApplications) { this.approvedApplications = approvedApplications; }
        
        public int getLostPetReports() { return lostPetReports; }
        public void setLostPetReports(int lostPetReports) { this.lostPetReports = lostPetReports; }
        
        public int getFoundPets() { return foundPets; }
        public void setFoundPets(int foundPets) { this.foundPets = foundPets; }
        
        public int getTotalMessages() { return totalMessages; }
        public void setTotalMessages(int totalMessages) { this.totalMessages = totalMessages; }
        
        public int getMessagesThisMonth() { return messagesThisMonth; }
        public void setMessagesThisMonth(int messagesThisMonth) { this.messagesThisMonth = messagesThisMonth; }
    }
    
    public static class MonthlyStats {
        private String month;
        private int year;
        private int newUsers;
        private int newPets;
        private int newAdoptionListings;
        private int newLostPetReports;
        private int messages;
        
        // Getters and setters
        public String getMonth() { return month; }
        public void setMonth(String month) { this.month = month; }
        
        public int getYear() { return year; }
        public void setYear(int year) { this.year = year; }
        
        public int getNewUsers() { return newUsers; }
        public void setNewUsers(int newUsers) { this.newUsers = newUsers; }
        
        public int getNewPets() { return newPets; }
        public void setNewPets(int newPets) { this.newPets = newPets; }
        
        public int getNewAdoptionListings() { return newAdoptionListings; }
        public void setNewAdoptionListings(int newAdoptionListings) { this.newAdoptionListings = newAdoptionListings; }
        
        public int getNewLostPetReports() { return newLostPetReports; }
        public void setNewLostPetReports(int newLostPetReports) { this.newLostPetReports = newLostPetReports; }
        
        public int getMessages() { return messages; }
        public void setMessages(int messages) { this.messages = messages; }
    }
    
    public static class TopUser {
        private Long userId;
        private String userName;
        private String userEmail;
        private int petCount;
        private int adoptionListings;
        private int adoptionApplications;
        private int score;
        
        // Getters and setters
        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
        
        public String getUserName() { return userName; }
        public void setUserName(String userName) { this.userName = userName; }
        
        public String getUserEmail() { return userEmail; }
        public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
        
        public int getPetCount() { return petCount; }
        public void setPetCount(int petCount) { this.petCount = petCount; }
        
        public int getAdoptionListings() { return adoptionListings; }
        public void setAdoptionListings(int adoptionListings) { this.adoptionListings = adoptionListings; }
        
        public int getAdoptionApplications() { return adoptionApplications; }
        public void setAdoptionApplications(int adoptionApplications) { this.adoptionApplications = adoptionApplications; }
        
        public int getScore() { return score; }
        public void setScore(int score) { this.score = score; }
    }
    
    public static class PetTypeStats {
        private String petType;
        private int count;
        private int adoptionListings;
        private int lostReports;
        
        // Getters and setters
        public String getPetType() { return petType; }
        public void setPetType(String petType) { this.petType = petType; }
        
        public int getCount() { return count; }
        public void setCount(int count) { this.count = count; }
        
        public int getAdoptionListings() { return adoptionListings; }
        public void setAdoptionListings(int adoptionListings) { this.adoptionListings = adoptionListings; }
        
        public int getLostReports() { return lostReports; }
        public void setLostReports(int lostReports) { this.lostReports = lostReports; }
    }
    
    public static class LocationStats {
        private String location;
        private int adoptionListings;
        private int users;
        
        // Getters and setters
        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }
        
        public int getAdoptionListings() { return adoptionListings; }
        public void setAdoptionListings(int adoptionListings) { this.adoptionListings = adoptionListings; }
        
        public int getUsers() { return users; }
        public void setUsers(int users) { this.users = users; }
    }
}
