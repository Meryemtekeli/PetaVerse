package com.petaverse.controller;

import com.petaverse.dto.BadgeDto;
import com.petaverse.dto.UserBadgeDto;
import com.petaverse.entity.Badge;
import com.petaverse.entity.UserBadge;
import com.petaverse.service.BadgeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/badges")
@CrossOrigin(origins = "*")
public class BadgeController {

    @Autowired
    private BadgeService badgeService;

    @GetMapping
    public ResponseEntity<List<BadgeDto>> getAllBadges() {
        List<Badge> badges = badgeService.getAllBadges();
        List<BadgeDto> badgeDtos = badges.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(badgeDtos);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UserBadgeDto>> getUserBadges(@PathVariable Long userId) {
        List<UserBadge> userBadges = badgeService.getUserBadges(userId);
        List<UserBadgeDto> userBadgeDtos = userBadges.stream()
                .map(this::convertToUserBadgeDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(userBadgeDtos);
    }

    @PostMapping("/award")
    public ResponseEntity<UserBadgeDto> awardBadge(@RequestParam Long userId, @RequestParam Long badgeId) {
        UserBadge userBadge = badgeService.awardBadge(userId, badgeId);
        return ResponseEntity.ok(convertToUserBadgeDto(userBadge));
    }

    @GetMapping("/check-achievements/{userId}")
    public ResponseEntity<List<BadgeDto>> checkAchievements(@PathVariable Long userId) {
        List<Badge> newBadges = badgeService.checkAndAwardAchievements(userId);
        List<BadgeDto> badgeDtos = newBadges.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(badgeDtos);
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<List<UserBadgeDto>> getLeaderboard() {
        List<UserBadge> leaderboard = badgeService.getLeaderboard();
        List<UserBadgeDto> userBadgeDtos = leaderboard.stream()
                .map(this::convertToUserBadgeDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(userBadgeDtos);
    }

    private BadgeDto convertToDto(Badge badge) {
        BadgeDto dto = new BadgeDto();
        dto.setId(badge.getId());
        dto.setName(badge.getName());
        dto.setDescription(badge.getDescription());
        dto.setIcon(badge.getIcon());
        dto.setType(badge.getType());
        dto.setRarity(badge.getRarity());
        dto.setPoints(badge.getPoints());
        dto.setRequiredCount(badge.getRequiredCount());
        return dto;
    }

    private UserBadgeDto convertToUserBadgeDto(UserBadge userBadge) {
        UserBadgeDto dto = new UserBadgeDto();
        dto.setId(userBadge.getId());
        dto.setUserId(userBadge.getUser().getId());
        dto.setBadgeId(userBadge.getBadge().getId());
        dto.setEarnedAt(userBadge.getEarnedAt());
        dto.setBadge(convertToDto(userBadge.getBadge()));
        return dto;
    }
}
