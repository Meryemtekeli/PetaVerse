package com.petaverse.controller;

import com.petaverse.service.MapService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/map")
@Tag(name = "Map", description = "Map and location endpoints")
public class MapController {
    
    @Autowired
    private MapService mapService;
    
    @GetMapping("/markers")
    @Operation(summary = "Get all map markers")
    public ResponseEntity<List<MapService.MapMarker>> getAllMarkers() {
        List<MapService.MapMarker> markers = mapService.getAllMarkers();
        return ResponseEntity.ok(markers);
    }
    
    @GetMapping("/markers/{type}")
    @Operation(summary = "Get markers by type")
    public ResponseEntity<List<MapService.MapMarker>> getMarkersByType(@PathVariable String type) {
        List<MapService.MapMarker> markers = mapService.getMarkersByType(type);
        return ResponseEntity.ok(markers);
    }
    
    @GetMapping("/markers/nearby")
    @Operation(summary = "Get markers near a location")
    public ResponseEntity<List<MapService.MapMarker>> getMarkersNearby(
            @RequestParam double latitude,
            @RequestParam double longitude,
            @RequestParam(defaultValue = "10") double radiusKm) {
        List<MapService.MapMarker> markers = mapService.getMarkersNearLocation(latitude, longitude, radiusKm);
        return ResponseEntity.ok(markers);
    }
    
    @GetMapping("/markers/adoption")
    @Operation(summary = "Get adoption listing markers")
    public ResponseEntity<List<MapService.MapMarker>> getAdoptionMarkers() {
        List<MapService.MapMarker> markers = mapService.getAdoptionMarkers();
        return ResponseEntity.ok(markers);
    }
    
    @GetMapping("/markers/lost")
    @Operation(summary = "Get lost pet markers")
    public ResponseEntity<List<MapService.MapMarker>> getLostPetMarkers() {
        List<MapService.MapMarker> markers = mapService.getLostPetMarkers();
        return ResponseEntity.ok(markers);
    }
    
    @GetMapping("/markers/veterinarians")
    @Operation(summary = "Get veterinarian markers")
    public ResponseEntity<List<MapService.MapMarker>> getVeterinarianMarkers() {
        List<MapService.MapMarker> markers = mapService.getVeterinarianMarkers();
        return ResponseEntity.ok(markers);
    }
}
