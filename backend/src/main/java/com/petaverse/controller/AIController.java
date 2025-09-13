package com.petaverse.controller;

import com.petaverse.service.AIService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ai")
@Tag(name = "AI", description = "AI-powered features and recommendations")
public class AIController {
    
    @Autowired
    private AIService aiService;
    
    @PostMapping("/matches")
    @Operation(summary = "Find pet matches based on user preferences")
    public ResponseEntity<List<AIService.PetMatch>> findPetMatches(
            @RequestParam Long userId,
            @RequestBody AIService.PetPreferences preferences) {
        List<AIService.PetMatch> matches = aiService.findPetMatches(userId, preferences);
        return ResponseEntity.ok(matches);
    }
    
    @GetMapping("/breeding-matches/{petId}")
    @Operation(summary = "Find breeding matches for a pet")
    public ResponseEntity<List<AIService.BreedingMatch>> findBreedingMatches(@PathVariable Long petId) {
        List<AIService.BreedingMatch> matches = aiService.findBreedingMatches(petId);
        return ResponseEntity.ok(matches);
    }
    
    @GetMapping("/recommendations/{userId}")
    @Operation(summary = "Get AI-powered adoption recommendations")
    public ResponseEntity<List<AIService.AdoptionRecommendation>> getAdoptionRecommendations(@PathVariable Long userId) {
        List<AIService.AdoptionRecommendation> recommendations = aiService.getAdoptionRecommendations(userId);
        return ResponseEntity.ok(recommendations);
    }
    
    @PostMapping("/smart-search")
    @Operation(summary = "Perform AI-powered smart search")
    public ResponseEntity<List<AIService.SmartSearchResult>> performSmartSearch(
            @RequestParam String query,
            @RequestParam Long userId) {
        List<AIService.SmartSearchResult> results = aiService.performSmartSearch(query, userId);
        return ResponseEntity.ok(results);
    }
    
    @PostMapping("/chatbot")
    @Operation(summary = "Get AI chatbot response")
    public ResponseEntity<AIService.ChatBotResponse> generateChatBotResponse(
            @RequestParam String message,
            @RequestParam Long userId) {
        AIService.ChatBotResponse response = aiService.generateChatBotResponse(message, userId);
        return ResponseEntity.ok(response);
    }
}
