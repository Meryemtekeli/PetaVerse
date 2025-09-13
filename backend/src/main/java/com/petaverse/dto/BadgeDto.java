package com.petaverse.dto;

import com.petaverse.entity.BadgeType;
import com.petaverse.entity.BadgeRarity;

public class BadgeDto {
    private Long id;
    private String name;
    private String description;
    private String icon;
    private BadgeType type;
    private BadgeRarity rarity;
    private Integer points;
    private Integer requiredCount;

    // Constructors
    public BadgeDto() {}

    public BadgeDto(Long id, String name, String description, String icon, BadgeType type, BadgeRarity rarity, Integer points, Integer requiredCount) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.icon = icon;
        this.type = type;
        this.rarity = rarity;
        this.points = points;
        this.requiredCount = requiredCount;
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

    public Integer getPoints() {
        return points;
    }

    public void setPoints(Integer points) {
        this.points = points;
    }

    public Integer getRequiredCount() {
        return requiredCount;
    }

    public void setRequiredCount(Integer requiredCount) {
        this.requiredCount = requiredCount;
    }
}
