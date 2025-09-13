package com.petaverse.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "badges")
@EntityListeners(AuditingEntityListener.class)
public class Badge {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Column(nullable = false, unique = true)
    private String name;
    
    @NotBlank
    @Column(nullable = false)
    private String displayName;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @NotBlank
    @Column(nullable = false)
    private String icon; // Icon name or emoji
    
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BadgeType type;
    
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BadgeRarity rarity;
    
    @Column(name = "required_count")
    private Integer requiredCount; // For counting badges
    
    @Column(name = "required_days")
    private Integer requiredDays; // For time-based badges
    
    @Column(name = "required_amount")
    private java.math.BigDecimal requiredAmount; // For amount-based badges
    
    @Column(name = "is_active")
    private boolean isActive = true;
    
    @Column(name = "sort_order")
    private Integer sortOrder = 0;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    // Constructors
    public Badge() {}
    
    public Badge(String name, String displayName, String description, String icon, 
                 BadgeType type, BadgeRarity rarity) {
        this.name = name;
        this.displayName = displayName;
        this.description = description;
        this.icon = icon;
        this.type = type;
        this.rarity = rarity;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getDisplayName() {
        return displayName;
    }
    
    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getIcon() {
        return icon;
    }
    
    public void setIcon(String icon) {
        this.icon = icon;
    }
    
    public BadgeType getType() {
        return type;
    }
    
    public void setType(BadgeType type) {
        this.type = type;
    }
    
    public BadgeRarity getRarity() {
        return rarity;
    }
    
    public void setRarity(BadgeRarity rarity) {
        this.rarity = rarity;
    }
    
    public Integer getRequiredCount() {
        return requiredCount;
    }
    
    public void setRequiredCount(Integer requiredCount) {
        this.requiredCount = requiredCount;
    }
    
    public Integer getRequiredDays() {
        return requiredDays;
    }
    
    public void setRequiredDays(Integer requiredDays) {
        this.requiredDays = requiredDays;
    }
    
    public java.math.BigDecimal getRequiredAmount() {
        return requiredAmount;
    }
    
    public void setRequiredAmount(java.math.BigDecimal requiredAmount) {
        this.requiredAmount = requiredAmount;
    }
    
    public boolean isActive() {
        return isActive;
    }
    
    public void setActive(boolean active) {
        isActive = active;
    }
    
    public Integer getSortOrder() {
        return sortOrder;
    }
    
    public void setSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
