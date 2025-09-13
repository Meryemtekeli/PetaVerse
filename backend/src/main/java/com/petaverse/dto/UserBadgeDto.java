package com.petaverse.dto;

import java.time.LocalDateTime;

public class UserBadgeDto {
    private Long id;
    private Long userId;
    private Long badgeId;
    private LocalDateTime earnedAt;
    private BadgeDto badge;

    // Constructors
    public UserBadgeDto() {}

    public UserBadgeDto(Long id, Long userId, Long badgeId, LocalDateTime earnedAt, BadgeDto badge) {
        this.id = id;
        this.userId = userId;
        this.badgeId = badgeId;
        this.earnedAt = earnedAt;
        this.badge = badge;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getBadgeId() {
        return badgeId;
    }

    public void setBadgeId(Long badgeId) {
        this.badgeId = badgeId;
    }

    public LocalDateTime getEarnedAt() {
        return earnedAt;
    }

    public void setEarnedAt(LocalDateTime earnedAt) {
        this.earnedAt = earnedAt;
    }

    public BadgeDto getBadge() {
        return badge;
    }

    public void setBadge(BadgeDto badge) {
        this.badge = badge;
    }
}
