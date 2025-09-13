package com.petaverse.controller;

import com.petaverse.dto.UserDto;
import com.petaverse.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {
    
    private final UserService userService;
    
    @GetMapping("/profile")
    public ResponseEntity<UserDto> getCurrentUserProfile(Authentication authentication) {
        String email = authentication.getName();
        Optional<UserDto> user = userService.getUserByEmail(email);
        return user.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/profile")
    public ResponseEntity<UserDto> updateUserProfile(
            @RequestBody UserDto userDto,
            Authentication authentication) {
        String email = authentication.getName();
        Optional<UserDto> updatedUser = userService.updateUserProfile(email, userDto);
        return updatedUser.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        UserDto user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }
    
    @GetMapping
    public ResponseEntity<List<UserDto>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        List<UserDto> users = userService.getAllUsers(page, size);
        return ResponseEntity.ok(users);
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<UserDto> updateUserStatus(
            @PathVariable Long id,
            @RequestParam String status,
            Authentication authentication) {
        Optional<UserDto> updatedUser = userService.updateUserStatus(id, status, authentication);
        return updatedUser.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(
            @PathVariable Long id,
            Authentication authentication) {
        boolean deleted = userService.deleteUser(id, authentication);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<UserDto>> searchUsers(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String role) {
        List<UserDto> users = userService.searchUsers(name, location, role);
        return ResponseEntity.ok(users);
    }
    
    @PostMapping("/{id}/follow")
    public ResponseEntity<Void> followUser(
            @PathVariable Long id,
            Authentication authentication) {
        String followerEmail = authentication.getName();
        boolean followed = userService.followUser(followerEmail, id);
        if (followed) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }
    
    @DeleteMapping("/{id}/follow")
    public ResponseEntity<Void> unfollowUser(
            @PathVariable Long id,
            Authentication authentication) {
        String followerEmail = authentication.getName();
        boolean unfollowed = userService.unfollowUser(followerEmail, id);
        if (unfollowed) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }
    
    @GetMapping("/{id}/followers")
    public ResponseEntity<List<UserDto>> getUserFollowers(@PathVariable Long id) {
        List<UserDto> followers = userService.getUserFollowers(id);
        return ResponseEntity.ok(followers);
    }
    
    @GetMapping("/{id}/following")
    public ResponseEntity<List<UserDto>> getUserFollowing(@PathVariable Long id) {
        List<UserDto> following = userService.getUserFollowing(id);
        return ResponseEntity.ok(following);
    }
}
