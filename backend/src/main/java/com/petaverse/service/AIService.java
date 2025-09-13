package com.petaverse.service;

import com.petaverse.entity.*;
import com.petaverse.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AIService {
    
    @Autowired
    private PetRepository petRepository;
    
    @Autowired
    private AdoptionListingRepository adoptionListingRepository;
    
    @Autowired
    private AdoptionApplicationRepository adoptionApplicationRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private MessageRepository messageRepository;
    
    public List<PetMatch> findPetMatches(Long userId, PetPreferences preferences) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<AdoptionListing> availableListings = adoptionListingRepository.findByStatus(AdoptionStatus.ACTIVE);
        List<PetMatch> matches = new ArrayList<>();
        
        for (AdoptionListing listing : availableListings) {
            if (listing.getOwner().getId().equals(userId)) {
                continue; // Skip user's own listings
            }
            
            Pet pet = listing.getPet();
            double compatibilityScore = calculateCompatibilityScore(pet, preferences, user);
            
            if (compatibilityScore > 0.3) { // Minimum 30% compatibility
                PetMatch match = new PetMatch();
                match.setPet(pet);
                match.setAdoptionListing(listing);
                match.setCompatibilityScore(compatibilityScore);
                match.setMatchReasons(generateMatchReasons(pet, preferences, user));
                match.setDistance(calculateDistance(user, listing));
                
                matches.add(match);
            }
        }
        
        // Sort by compatibility score and distance
        matches.sort((a, b) -> {
            int scoreComparison = Double.compare(b.getCompatibilityScore(), a.getCompatibilityScore());
            if (scoreComparison != 0) return scoreComparison;
            return Double.compare(a.getDistance(), b.getDistance());
        });
        
        return matches.stream().limit(20).collect(Collectors.toList());
    }
    
    public List<BreedingMatch> findBreedingMatches(Long petId) {
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new RuntimeException("Pet not found"));
        
        if (pet.getGender() == null || pet.getAge() < 12) {
            return new ArrayList<>(); // Too young for breeding
        }
        
        List<Pet> potentialMatches = petRepository.findByPetTypeAndGenderNotAndAgeGreaterThan(
                pet.getPetType(), 
                pet.getGender(), 
                12
        );
        
        List<BreedingMatch> matches = new ArrayList<>();
        
        for (Pet potentialMatch : potentialMatches) {
            if (potentialMatch.getOwner().getId().equals(pet.getOwner().getId())) {
                continue; // Skip same owner
            }
            
            double compatibilityScore = calculateBreedingCompatibility(pet, potentialMatch);
            
            if (compatibilityScore > 0.4) { // Minimum 40% compatibility for breeding
                BreedingMatch match = new BreedingMatch();
                match.setPet1(pet);
                match.setPet2(potentialMatch);
                match.setCompatibilityScore(compatibilityScore);
                match.setBreedingReasons(generateBreedingReasons(pet, potentialMatch));
                match.setDistance(calculateDistance(pet.getOwner(), potentialMatch.getOwner()));
                
                matches.add(match);
            }
        }
        
        matches.sort((a, b) -> Double.compare(b.getCompatibilityScore(), a.getCompatibilityScore()));
        return matches.stream().limit(10).collect(Collectors.toList());
    }
    
    public List<AdoptionRecommendation> getAdoptionRecommendations(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<AdoptionRecommendation> recommendations = new ArrayList<>();
        
        // Get user's adoption history
        List<AdoptionApplication> userApplications = adoptionApplicationRepository.findByApplicantId(userId);
        List<AdoptionListing> userListings = adoptionListingRepository.findByOwnerId(userId);
        
        // Analyze user preferences based on history
        PetPreferences inferredPreferences = inferUserPreferences(user, userApplications, userListings);
        
        // Get matches based on inferred preferences
        List<PetMatch> matches = findPetMatches(userId, inferredPreferences);
        
        for (PetMatch match : matches) {
            AdoptionRecommendation recommendation = new AdoptionRecommendation();
            recommendation.setPet(match.getPet());
            recommendation.setAdoptionListing(match.getAdoptionListing());
            recommendation.setCompatibilityScore(match.getCompatibilityScore());
            recommendation.setRecommendationReasons(match.getMatchReasons());
            recommendation.setConfidenceLevel(calculateConfidenceLevel(match, user));
            
            recommendations.add(recommendation);
        }
        
        return recommendations.stream().limit(5).collect(Collectors.toList());
    }
    
    public List<SmartSearchResult> performSmartSearch(String query, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<SmartSearchResult> results = new ArrayList<>();
        
        // Parse query for pet characteristics
        PetSearchCriteria criteria = parseSearchQuery(query);
        
        // Search pets based on criteria
        List<AdoptionListing> listings = adoptionListingRepository.findByStatus(AdoptionStatus.ACTIVE);
        
        for (AdoptionListing listing : listings) {
            Pet pet = listing.getPet();
            double relevanceScore = calculateRelevanceScore(pet, criteria, user);
            
            if (relevanceScore > 0.2) {
                SmartSearchResult result = new SmartSearchResult();
                result.setPet(pet);
                result.setAdoptionListing(listing);
                result.setRelevanceScore(relevanceScore);
                result.setSearchHighlights(generateSearchHighlights(pet, criteria));
                
                results.add(result);
            }
        }
        
        results.sort((a, b) -> Double.compare(b.getRelevanceScore(), a.getRelevanceScore()));
        return results.stream().limit(15).collect(Collectors.toList());
    }
    
    public ChatBotResponse generateChatBotResponse(String userMessage, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Simple rule-based chatbot for now
        String response = generateRuleBasedResponse(userMessage, user);
        
        ChatBotResponse chatResponse = new ChatBotResponse();
        chatResponse.setResponse(response);
        chatResponse.setResponseType(determineResponseType(userMessage));
        chatResponse.setSuggestedActions(generateSuggestedActions(userMessage, user));
        
        return chatResponse;
    }
    
    // Helper methods
    private double calculateCompatibilityScore(Pet pet, PetPreferences preferences, User user) {
        double score = 0.0;
        double totalWeight = 0.0;
        
        // Pet type compatibility
        if (preferences.getPreferredPetTypes().contains(pet.getPetType())) {
            score += 0.3;
        }
        totalWeight += 0.3;
        
        // Age compatibility
        if (preferences.getMinAge() <= pet.getAge() && pet.getAge() <= preferences.getMaxAge()) {
            score += 0.2;
        }
        totalWeight += 0.2;
        
        // Gender compatibility
        if (preferences.getPreferredGender() == null || preferences.getPreferredGender().equals(pet.getGender())) {
            score += 0.15;
        }
        totalWeight += 0.15;
        
        // Breed compatibility
        if (preferences.getPreferredBreeds().isEmpty() || 
            preferences.getPreferredBreeds().contains(pet.getBreed())) {
            score += 0.15;
        }
        totalWeight += 0.15;
        
        // Location compatibility
        double distance = calculateDistance(user, pet.getOwner());
        if (distance < 50) { // Within 50km
            score += 0.1;
        } else if (distance < 100) { // Within 100km
            score += 0.05;
        }
        totalWeight += 0.1;
        
        // User experience compatibility
        if (user.getRole() == UserRole.VETERINARIAN) {
            score += 0.1; // Veterinarians get bonus
        }
        totalWeight += 0.1;
        
        return totalWeight > 0 ? score / totalWeight : 0.0;
    }
    
    private double calculateBreedingCompatibility(Pet pet1, Pet pet2) {
        double score = 0.0;
        
        // Age compatibility (both should be mature)
        if (pet1.getAge() >= 12 && pet2.getAge() >= 12) {
            score += 0.3;
        }
        
        // Breed compatibility
        if (pet1.getBreed().equals(pet2.getBreed())) {
            score += 0.4;
        } else if (areCompatibleBreeds(pet1.getBreed(), pet2.getBreed())) {
            score += 0.2;
        }
        
        // Health compatibility (simplified)
        if (pet1.getHealthStatus() == PetStatus.HEALTHY && pet2.getHealthStatus() == PetStatus.HEALTHY) {
            score += 0.3;
        }
        
        return score;
    }
    
    private List<String> generateMatchReasons(Pet pet, PetPreferences preferences, User user) {
        List<String> reasons = new ArrayList<>();
        
        if (preferences.getPreferredPetTypes().contains(pet.getPetType())) {
            reasons.add("İstediğiniz pet türü: " + pet.getPetType());
        }
        
        if (preferences.getMinAge() <= pet.getAge() && pet.getAge() <= preferences.getMaxAge()) {
            reasons.add("Yaş aralığınıza uygun: " + pet.getAge() + " yaşında");
        }
        
        if (preferences.getPreferredGender() == null || preferences.getPreferredGender().equals(pet.getGender())) {
            reasons.add("Cinsiyet tercihinize uygun: " + pet.getGender());
        }
        
        double distance = calculateDistance(user, pet.getOwner());
        if (distance < 50) {
            reasons.add("Yakın konumda: " + String.format("%.1f km", distance));
        }
        
        if (user.getRole() == UserRole.VETERINARIAN) {
            reasons.add("Veteriner deneyiminiz bu pet için uygun");
        }
        
        return reasons;
    }
    
    private List<String> generateBreedingReasons(Pet pet1, Pet pet2) {
        List<String> reasons = new ArrayList<>();
        
        if (pet1.getBreed().equals(pet2.getBreed())) {
            reasons.add("Aynı ırk: " + pet1.getBreed());
        } else if (areCompatibleBreeds(pet1.getBreed(), pet2.getBreed())) {
            reasons.add("Uyumlu ırklar: " + pet1.getBreed() + " x " + pet2.getBreed());
        }
        
        if (pet1.getAge() >= 12 && pet2.getAge() >= 12) {
            reasons.add("Her iki pet de üreme yaşında");
        }
        
        if (pet1.getHealthStatus() == PetStatus.HEALTHY && pet2.getHealthStatus() == PetStatus.HEALTHY) {
            reasons.add("Her iki pet de sağlıklı");
        }
        
        return reasons;
    }
    
    private PetPreferences inferUserPreferences(User user, List<AdoptionApplication> applications, List<AdoptionListing> listings) {
        PetPreferences preferences = new PetPreferences();
        preferences.setPreferredPetTypes(new ArrayList<>());
        preferences.setPreferredBreeds(new ArrayList<>());
        preferences.setMinAge(0);
        preferences.setMaxAge(20);
        
        // Analyze applications to infer preferences
        for (AdoptionApplication application : applications) {
            Pet pet = application.getAdoptionListing().getPet();
            if (!preferences.getPreferredPetTypes().contains(pet.getPetType())) {
                preferences.getPreferredPetTypes().add(pet.getPetType());
            }
            if (!preferences.getPreferredBreeds().contains(pet.getBreed())) {
                preferences.getPreferredBreeds().add(pet.getBreed());
            }
        }
        
        // If no applications, use default preferences
        if (preferences.getPreferredPetTypes().isEmpty()) {
            preferences.getPreferredPetTypes().add(PetType.DOG);
            preferences.getPreferredPetTypes().add(PetType.CAT);
        }
        
        return preferences;
    }
    
    private double calculateConfidenceLevel(PetMatch match, User user) {
        double confidence = match.getCompatibilityScore();
        
        // Increase confidence if user has similar pets
        List<Pet> userPets = petRepository.findByOwnerId(user.getId());
        for (Pet userPet : userPets) {
            if (userPet.getPetType() == match.getPet().getPetType()) {
                confidence += 0.1;
                break;
            }
        }
        
        return Math.min(confidence, 1.0);
    }
    
    private PetSearchCriteria parseSearchQuery(String query) {
        PetSearchCriteria criteria = new PetSearchCriteria();
        criteria.setQuery(query);
        criteria.setPetTypes(new ArrayList<>());
        criteria.setBreeds(new ArrayList<>());
        criteria.setMinAge(0);
        criteria.setMaxAge(20);
        
        String lowerQuery = query.toLowerCase();
        
        // Parse pet types
        if (lowerQuery.contains("köpek") || lowerQuery.contains("dog")) {
            criteria.getPetTypes().add(PetType.DOG);
        }
        if (lowerQuery.contains("kedi") || lowerQuery.contains("cat")) {
            criteria.getPetTypes().add(PetType.CAT);
        }
        if (lowerQuery.contains("kuş") || lowerQuery.contains("bird")) {
            criteria.getPetTypes().add(PetType.BIRD);
        }
        
        // Parse age
        if (lowerQuery.contains("yavru") || lowerQuery.contains("puppy") || lowerQuery.contains("kitten")) {
            criteria.setMaxAge(2);
        }
        if (lowerQuery.contains("yaşlı") || lowerQuery.contains("senior")) {
            criteria.setMinAge(7);
        }
        
        return criteria;
    }
    
    private double calculateRelevanceScore(Pet pet, PetSearchCriteria criteria, User user) {
        double score = 0.0;
        
        // Text matching in pet name and description
        String searchText = criteria.getQuery().toLowerCase();
        if (pet.getName().toLowerCase().contains(searchText)) {
            score += 0.4;
        }
        if (pet.getDescription() != null && pet.getDescription().toLowerCase().contains(searchText)) {
            score += 0.3;
        }
        
        // Pet type matching
        if (criteria.getPetTypes().isEmpty() || criteria.getPetTypes().contains(pet.getPetType())) {
            score += 0.2;
        }
        
        // Age matching
        if (pet.getAge() >= criteria.getMinAge() && pet.getAge() <= criteria.getMaxAge()) {
            score += 0.1;
        }
        
        return score;
    }
    
    private List<String> generateSearchHighlights(Pet pet, PetSearchCriteria criteria) {
        List<String> highlights = new ArrayList<>();
        String searchText = criteria.getQuery().toLowerCase();
        
        if (pet.getName().toLowerCase().contains(searchText)) {
            highlights.add("İsim eşleşmesi: " + pet.getName());
        }
        
        if (pet.getDescription() != null && pet.getDescription().toLowerCase().contains(searchText)) {
            highlights.add("Açıklama eşleşmesi");
        }
        
        if (criteria.getPetTypes().contains(pet.getPetType())) {
            highlights.add("Pet türü: " + pet.getPetType());
        }
        
        return highlights;
    }
    
    private String generateRuleBasedResponse(String userMessage, User user) {
        String lowerMessage = userMessage.toLowerCase();
        
        if (lowerMessage.contains("merhaba") || lowerMessage.contains("selam")) {
            return "Merhaba! Size nasıl yardımcı olabilirim? Evcil hayvan sahiplendirme konusunda sorularınızı yanıtlayabilirim.";
        }
        
        if (lowerMessage.contains("sahiplendirme") || lowerMessage.contains("adopt")) {
            return "Sahiplendirme süreci hakkında bilgi verebilirim. Hangi konuda yardıma ihtiyacınız var?";
        }
        
        if (lowerMessage.contains("köpek") || lowerMessage.contains("kedi")) {
            return "Köpek ve kedi sahiplendirme konusunda size yardımcı olabilirim. Hangi tür hakkında bilgi almak istiyorsunuz?";
        }
        
        if (lowerMessage.contains("yaş") || lowerMessage.contains("age")) {
            return "Pet yaşı sahiplendirme kararında önemli bir faktördür. Yavru, yetişkin veya yaşlı pet tercihiniz var mı?";
        }
        
        return "Anladığım kadarıyla evcil hayvan sahiplendirme konusunda yardıma ihtiyacınız var. Daha spesifik sorular sorabilirsiniz.";
    }
    
    private String determineResponseType(String userMessage) {
        String lowerMessage = userMessage.toLowerCase();
        
        if (lowerMessage.contains("nasıl") || lowerMessage.contains("how")) {
            return "HOW_TO";
        }
        
        if (lowerMessage.contains("ne") || lowerMessage.contains("what")) {
            return "INFORMATION";
        }
        
        if (lowerMessage.contains("nerede") || lowerMessage.contains("where")) {
            return "LOCATION";
        }
        
        return "GENERAL";
    }
    
    private List<String> generateSuggestedActions(String userMessage, User user) {
        List<String> actions = new ArrayList<>();
        
        actions.add("Sahiplendirme ilanlarını görüntüle");
        actions.add("Pet arama yap");
        actions.add("Profilimi güncelle");
        
        return actions;
    }
    
    private double calculateDistance(User user1, User user2) {
        if (user1.getLatitude() == null || user1.getLongitude() == null ||
            user2.getLatitude() == null || user2.getLongitude() == null) {
            return 999.0; // Unknown distance
        }
        
        // Simple distance calculation (not accurate for large distances)
        double lat1 = user1.getLatitude();
        double lon1 = user1.getLongitude();
        double lat2 = user2.getLatitude();
        double lon2 = user2.getLongitude();
        
        double distance = Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lon2 - lon1, 2)) * 111.0; // Rough km conversion
        return distance;
    }
    
    private boolean areCompatibleBreeds(String breed1, String breed2) {
        // Simplified breed compatibility logic
        Set<String> compatibleBreeds = Set.of(
            "Golden Retriever", "Labrador", "German Shepherd",
            "Persian", "British Shorthair", "Maine Coon"
        );
        
        return compatibleBreeds.contains(breed1) && compatibleBreeds.contains(breed2);
    }
    
    // Data classes
    public static class PetMatch {
        private Pet pet;
        private AdoptionListing adoptionListing;
        private double compatibilityScore;
        private List<String> matchReasons;
        private double distance;
        
        // Getters and setters
        public Pet getPet() { return pet; }
        public void setPet(Pet pet) { this.pet = pet; }
        
        public AdoptionListing getAdoptionListing() { return adoptionListing; }
        public void setAdoptionListing(AdoptionListing adoptionListing) { this.adoptionListing = adoptionListing; }
        
        public double getCompatibilityScore() { return compatibilityScore; }
        public void setCompatibilityScore(double compatibilityScore) { this.compatibilityScore = compatibilityScore; }
        
        public List<String> getMatchReasons() { return matchReasons; }
        public void setMatchReasons(List<String> matchReasons) { this.matchReasons = matchReasons; }
        
        public double getDistance() { return distance; }
        public void setDistance(double distance) { this.distance = distance; }
    }
    
    public static class BreedingMatch {
        private Pet pet1;
        private Pet pet2;
        private double compatibilityScore;
        private List<String> breedingReasons;
        private double distance;
        
        // Getters and setters
        public Pet getPet1() { return pet1; }
        public void setPet1(Pet pet1) { this.pet1 = pet1; }
        
        public Pet getPet2() { return pet2; }
        public void setPet2(Pet pet2) { this.pet2 = pet2; }
        
        public double getCompatibilityScore() { return compatibilityScore; }
        public void setCompatibilityScore(double compatibilityScore) { this.compatibilityScore = compatibilityScore; }
        
        public List<String> getBreedingReasons() { return breedingReasons; }
        public void setBreedingReasons(List<String> breedingReasons) { this.breedingReasons = breedingReasons; }
        
        public double getDistance() { return distance; }
        public void setDistance(double distance) { this.distance = distance; }
    }
    
    public static class AdoptionRecommendation {
        private Pet pet;
        private AdoptionListing adoptionListing;
        private double compatibilityScore;
        private List<String> recommendationReasons;
        private double confidenceLevel;
        
        // Getters and setters
        public Pet getPet() { return pet; }
        public void setPet(Pet pet) { this.pet = pet; }
        
        public AdoptionListing getAdoptionListing() { return adoptionListing; }
        public void setAdoptionListing(AdoptionListing adoptionListing) { this.adoptionListing = adoptionListing; }
        
        public double getCompatibilityScore() { return compatibilityScore; }
        public void setCompatibilityScore(double compatibilityScore) { this.compatibilityScore = compatibilityScore; }
        
        public List<String> getRecommendationReasons() { return recommendationReasons; }
        public void setRecommendationReasons(List<String> recommendationReasons) { this.recommendationReasons = recommendationReasons; }
        
        public double getConfidenceLevel() { return confidenceLevel; }
        public void setConfidenceLevel(double confidenceLevel) { this.confidenceLevel = confidenceLevel; }
    }
    
    public static class SmartSearchResult {
        private Pet pet;
        private AdoptionListing adoptionListing;
        private double relevanceScore;
        private List<String> searchHighlights;
        
        // Getters and setters
        public Pet getPet() { return pet; }
        public void setPet(Pet pet) { this.pet = pet; }
        
        public AdoptionListing getAdoptionListing() { return adoptionListing; }
        public void setAdoptionListing(AdoptionListing adoptionListing) { this.adoptionListing = adoptionListing; }
        
        public double getRelevanceScore() { return relevanceScore; }
        public void setRelevanceScore(double relevanceScore) { this.relevanceScore = relevanceScore; }
        
        public List<String> getSearchHighlights() { return searchHighlights; }
        public void setSearchHighlights(List<String> searchHighlights) { this.searchHighlights = searchHighlights; }
    }
    
    public static class ChatBotResponse {
        private String response;
        private String responseType;
        private List<String> suggestedActions;
        
        // Getters and setters
        public String getResponse() { return response; }
        public void setResponse(String response) { this.response = response; }
        
        public String getResponseType() { return responseType; }
        public void setResponseType(String responseType) { this.responseType = responseType; }
        
        public List<String> getSuggestedActions() { return suggestedActions; }
        public void setSuggestedActions(List<String> suggestedActions) { this.suggestedActions = suggestedActions; }
    }
    
    public static class PetPreferences {
        private List<PetType> preferredPetTypes;
        private List<String> preferredBreeds;
        private Integer preferredGender;
        private int minAge;
        private int maxAge;
        
        // Getters and setters
        public List<PetType> getPreferredPetTypes() { return preferredPetTypes; }
        public void setPreferredPetTypes(List<PetType> preferredPetTypes) { this.preferredPetTypes = preferredPetTypes; }
        
        public List<String> getPreferredBreeds() { return preferredBreeds; }
        public void setPreferredBreeds(List<String> preferredBreeds) { this.preferredBreeds = preferredBreeds; }
        
        public Integer getPreferredGender() { return preferredGender; }
        public void setPreferredGender(Integer preferredGender) { this.preferredGender = preferredGender; }
        
        public int getMinAge() { return minAge; }
        public void setMinAge(int minAge) { this.minAge = minAge; }
        
        public int getMaxAge() { return maxAge; }
        public void setMaxAge(int maxAge) { this.maxAge = maxAge; }
    }
    
    public static class PetSearchCriteria {
        private String query;
        private List<PetType> petTypes;
        private List<String> breeds;
        private int minAge;
        private int maxAge;
        
        // Getters and setters
        public String getQuery() { return query; }
        public void setQuery(String query) { this.query = query; }
        
        public List<PetType> getPetTypes() { return petTypes; }
        public void setPetTypes(List<PetType> petTypes) { this.petTypes = petTypes; }
        
        public List<String> getBreeds() { return breeds; }
        public void setBreeds(List<String> breeds) { this.breeds = breeds; }
        
        public int getMinAge() { return minAge; }
        public void setMinAge(int minAge) { this.minAge = minAge; }
        
        public int getMaxAge() { return maxAge; }
        public void setMaxAge(int maxAge) { this.maxAge = maxAge; }
    }
}
