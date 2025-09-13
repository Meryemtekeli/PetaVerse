package com.petaverse.service;

import com.petaverse.entity.AdoptionListing;
import com.petaverse.entity.LostPetReport;
import com.petaverse.entity.User;
import com.petaverse.repository.AdoptionListingRepository;
import com.petaverse.repository.LostPetReportRepository;
import com.petaverse.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MapService {
    
    @Autowired
    private AdoptionListingRepository adoptionListingRepository;
    
    @Autowired
    private LostPetReportRepository lostPetReportRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public List<MapMarker> getAdoptionMarkers() {
        List<AdoptionListing> listings = adoptionListingRepository.findByStatusAndLatitudeIsNotNullAndLongitudeIsNotNull(
            com.petaverse.entity.AdoptionStatus.ACTIVE
        );
        
        return listings.stream()
                .map(this::convertToMapMarker)
                .collect(Collectors.toList());
    }
    
    public List<MapMarker> getLostPetMarkers() {
        List<LostPetReport> reports = lostPetReportRepository.findByStatusAndLatitudeIsNotNullAndLongitudeIsNotNull(
            com.petaverse.entity.PetStatus.LOST
        );
        
        return reports.stream()
                .map(this::convertToMapMarker)
                .collect(Collectors.toList());
    }
    
    public List<MapMarker> getVeterinarianMarkers() {
        List<User> veterinarians = userRepository.findByRoleAndLatitudeIsNotNullAndLongitudeIsNotNull(
            com.petaverse.entity.UserRole.VETERINARIAN
        );
        
        return veterinarians.stream()
                .map(this::convertToMapMarker)
                .collect(Collectors.toList());
    }
    
    public List<MapMarker> getAllMarkers() {
        List<MapMarker> markers = getAdoptionMarkers();
        markers.addAll(getLostPetMarkers());
        markers.addAll(getVeterinarianMarkers());
        return markers;
    }
    
    public List<MapMarker> getMarkersByType(String type) {
        switch (type.toLowerCase()) {
            case "adoption":
                return getAdoptionMarkers();
            case "lost":
                return getLostPetMarkers();
            case "vet":
            case "veterinarian":
                return getVeterinarianMarkers();
            default:
                return getAllMarkers();
        }
    }
    
    public List<MapMarker> getMarkersNearLocation(double latitude, double longitude, double radiusKm) {
        // This would require a more complex query with distance calculation
        // For now, return all markers - implement with PostGIS or similar for production
        return getAllMarkers();
    }
    
    private MapMarker convertToMapMarker(AdoptionListing listing) {
        MapMarker marker = new MapMarker();
        marker.setId("adoption_" + listing.getId());
        marker.setType("adoption");
        marker.setTitle(listing.getTitle());
        marker.setDescription(listing.getDescription());
        marker.setLatitude(listing.getLatitude());
        marker.setLongitude(listing.getLongitude());
        marker.setData(MapMarkerData.builder()
                .adoptionListingId(listing.getId())
                .petId(listing.getPet().getId())
                .petName(listing.getPet().getName())
                .adoptionFee(listing.getAdoptionFee())
                .ownerName(listing.getOwner().getFirstName() + " " + listing.getOwner().getLastName())
                .build());
        return marker;
    }
    
    private MapMarker convertToMapMarker(LostPetReport report) {
        MapMarker marker = new MapMarker();
        marker.setId("lost_" + report.getId());
        marker.setType("lost");
        marker.setTitle("Kayıp " + report.getPet().getName());
        marker.setDescription(report.getDescription());
        marker.setLatitude(report.getLatitude());
        marker.setLongitude(report.getLongitude());
        marker.setData(MapMarkerData.builder()
                .lostPetReportId(report.getId())
                .petId(report.getPet().getId())
                .petName(report.getPet().getName())
                .lastSeenDate(report.getLastSeenDate())
                .ownerName(report.getPet().getOwner().getFirstName() + " " + report.getPet().getOwner().getLastName())
                .build());
        return marker;
    }
    
    private MapMarker convertToMapMarker(User veterinarian) {
        MapMarker marker = new MapMarker();
        marker.setId("vet_" + veterinarian.getId());
        marker.setType("vet");
        marker.setTitle(veterinarian.getFirstName() + " " + veterinarian.getLastName());
        marker.setDescription(veterinarian.getBio());
        marker.setLatitude(veterinarian.getLatitude());
        marker.setLongitude(veterinarian.getLongitude());
        marker.setData(MapMarkerData.builder()
                .userId(veterinarian.getId())
                .phoneNumber(veterinarian.getPhoneNumber())
                .email(veterinarian.getEmail())
                .build());
        return marker;
    }
    
    // Inner classes for data transfer
    public static class MapMarker {
        private String id;
        private String type;
        private String title;
        private String description;
        private Double latitude;
        private Double longitude;
        private MapMarkerData data;
        
        // Getters and setters
        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        
        public Double getLatitude() { return latitude; }
        public void setLatitude(Double latitude) { this.latitude = latitude; }
        
        public Double getLongitude() { return longitude; }
        public void setLongitude(Double longitude) { this.longitude = longitude; }
        
        public MapMarkerData getData() { return data; }
        public void setData(MapMarkerData data) { this.data = data; }
    }
    
    public static class MapMarkerData {
        private Long adoptionListingId;
        private Long lostPetReportId;
        private Long petId;
        private Long userId;
        private String petName;
        private String ownerName;
        private java.math.BigDecimal adoptionFee;
        private java.time.LocalDateTime lastSeenDate;
        private String phoneNumber;
        private String email;
        
        // Builder pattern
        public static Builder builder() {
            return new Builder();
        }
        
        public static class Builder {
            private MapMarkerData data = new MapMarkerData();
            
            public Builder adoptionListingId(Long id) { data.adoptionListingId = id; return this; }
            public Builder lostPetReportId(Long id) { data.lostPetReportId = id; return this; }
            public Builder petId(Long id) { data.petId = id; return this; }
            public Builder userId(Long id) { data.userId = id; return this; }
            public Builder petName(String name) { data.petName = name; return this; }
            public Builder ownerName(String name) { data.ownerName = name; return this; }
            public Builder adoptionFee(java.math.BigDecimal fee) { data.adoptionFee = fee; return this; }
            public Builder lastSeenDate(java.time.LocalDateTime date) { data.lastSeenDate = date; return this; }
            public Builder phoneNumber(String phone) { data.phoneNumber = phone; return this; }
            public Builder email(String email) { data.email = email; return this; }
            
            public MapMarkerData build() { return data; }
        }
        
        // Getters
        public Long getAdoptionListingId() { return adoptionListingId; }
        public Long getLostPetReportId() { return lostPetReportId; }
        public Long getPetId() { return petId; }
        public Long getUserId() { return userId; }
        public String getPetName() { return petName; }
        public String getOwnerName() { return ownerName; }
        public java.math.BigDecimal getAdoptionFee() { return adoptionFee; }
        public java.time.LocalDateTime getLastSeenDate() { return lastSeenDate; }
        public String getPhoneNumber() { return phoneNumber; }
        public String getEmail() { return email; }
    }
}
