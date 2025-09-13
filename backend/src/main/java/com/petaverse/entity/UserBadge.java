package com.petaverse.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_badges")
@EntityListeners(AuditingEntityListener.class)
public class UserBadge {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "badge_id", nullable = false)
    private Badge badge;
    
    @Column(name = "progress")
    private Integer progress = 0;
    
    @Column(name = "is_earned")
    private boolean isEarned = false;
    
    @Column(name = "earned_at")
    private LocalDateTime earnedAt;
    
    @Column(name = "is_displayed")
    private boolean isDisplayed = true;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    // Constructors
    public UserBadge() {}
    
    public UserBadge(User user, Badge badge) {
        this.user = user;
        this.badge = badge;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public Badge getBadge() {
        return badge;
    }
    
    public void setBadge(Badge badge) {
        this.badge = badge;
    }
    
    public Integer getProgress() {
        return progress;
    }
    
    public void setProgress(Integer progress) {
        this.progress = progress;
    }
    
    public boolean isEarned() {
        return isEarned;
    }
    
    public void setEarned(boolean earned) {
        isEarned = earned;
        if (earned && earnedAt == null) {
            earnedAt = LocalDateTime.now();
        }
    }
    
    public LocalDateTime getEarnedAt() {
        return earnedAt;
    }
    
    public void setEarnedAt(LocalDateTime earnedAt) {
        this.earnedAt = earnedAt;
    }
    
    public boolean isDisplayed() {
        return isDisplayed;
    }
    
    public void setDisplayed(boolean displayed) {
        isDisplayed = displayed;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
