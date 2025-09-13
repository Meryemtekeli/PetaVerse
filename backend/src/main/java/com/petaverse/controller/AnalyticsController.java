package com.petaverse.controller;

import com.petaverse.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@Tag(name = "Analytics", description = "Analytics and statistics endpoints")
public class AnalyticsController {
    
    @Autowired
    private AnalyticsService analyticsService;
    
    @GetMapping("/dashboard")
    @Operation(summary = "Get dashboard statistics")
    public ResponseEntity<AnalyticsService.DashboardStats> getDashboardStats() {
        AnalyticsService.DashboardStats stats = analyticsService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/user/{userId}")
    @Operation(summary = "Get user analytics")
    public ResponseEntity<AnalyticsService.UserAnalytics> getUserAnalytics(@PathVariable Long userId) {
        AnalyticsService.UserAnalytics analytics = analyticsService.getUserAnalytics(userId);
        return ResponseEntity.ok(analytics);
    }
    
    @GetMapping("/monthly")
    @Operation(summary = "Get monthly statistics")
    public ResponseEntity<List<AnalyticsService.MonthlyStats>> getMonthlyStats(
            @RequestParam(defaultValue = "12") int months) {
        List<AnalyticsService.MonthlyStats> stats = analyticsService.getMonthlyStats(months);
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/top-users")
    @Operation(summary = "Get top users")
    public ResponseEntity<List<AnalyticsService.TopUser>> getTopUsers(
            @RequestParam(defaultValue = "10") int limit) {
        List<AnalyticsService.TopUser> topUsers = analyticsService.getTopUsers(limit);
        return ResponseEntity.ok(topUsers);
    }
    
    @GetMapping("/pet-types")
    @Operation(summary = "Get pet type statistics")
    public ResponseEntity<List<AnalyticsService.PetTypeStats>> getPetTypeStats() {
        List<AnalyticsService.PetTypeStats> stats = analyticsService.getPetTypeStats();
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/locations")
    @Operation(summary = "Get location statistics")
    public ResponseEntity<List<AnalyticsService.LocationStats>> getLocationStats() {
        List<AnalyticsService.LocationStats> stats = analyticsService.getLocationStats();
        return ResponseEntity.ok(stats);
    }
}
