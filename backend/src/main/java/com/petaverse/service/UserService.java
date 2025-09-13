package com.petaverse.service;

import com.petaverse.dto.UserDto;
import com.petaverse.entity.User;
import com.petaverse.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public UserDto getCurrentUser(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
        return convertToDto(user);
    }

    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
        return convertToDto(user);
    }

    public UserDto getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
        return convertToDto(user);
    }

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public UserDto updateProfile(Authentication authentication, UserDto userDto) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        // Güncellenebilir alanları güncelle
        if (userDto.getFirstName() != null) {
            user.setFirstName(userDto.getFirstName());
        }
        if (userDto.getLastName() != null) {
            user.setLastName(userDto.getLastName());
        }
        if (userDto.getPhoneNumber() != null) {
            user.setPhoneNumber(userDto.getPhoneNumber());
        }
        if (userDto.getBio() != null) {
            user.setBio(userDto.getBio());
        }
        if (userDto.getAddress() != null) {
            user.setAddress(userDto.getAddress());
        }
        if (userDto.getCity() != null) {
            user.setCity(userDto.getCity());
        }
        if (userDto.getCountry() != null) {
            user.setCountry(userDto.getCountry());
        }
        if (userDto.getLatitude() != null) {
            user.setLatitude(userDto.getLatitude());
        }
        if (userDto.getLongitude() != null) {
            user.setLongitude(userDto.getLongitude());
        }

        user.setUpdatedAt(LocalDateTime.now());
        User updatedUser = userRepository.save(user);
        return convertToDto(updatedUser);
    }

    public void updateProfileImage(Authentication authentication, String imageUrl) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        user.setProfileImageUrl(imageUrl);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
        userRepository.delete(user);
    }

    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public List<UserDto> getUsersByCity(String city) {
        return userRepository.findByCity(city).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<UserDto> getUsersByLocationRange(Double minLat, Double maxLat, Double minLng, Double maxLng) {
        return userRepository.findByLocationRange(minLat, maxLat, minLng, maxLng).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private UserDto convertToDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setBio(user.getBio());
        dto.setProfileImageUrl(user.getProfileImageUrl());
        dto.setRole(user.getRole());
        dto.setStatus(user.getStatus());
        dto.setEmailVerified(user.isEmailVerified());
        dto.setPhoneVerified(user.isPhoneVerified());
        dto.setAddress(user.getAddress());
        dto.setCity(user.getCity());
        dto.setCountry(user.getCountry());
        dto.setLatitude(user.getLatitude());
        dto.setLongitude(user.getLongitude());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setLastLoginAt(user.getLastLoginAt());
        return dto;
    }
    
    public Optional<UserDto> getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(this::convertToDto);
    }
    
    public List<UserDto> getAllUsers(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return userRepository.findAll(pageable).getContent().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public Optional<UserDto> updateUserProfile(String email, UserDto userDto) {
        return userRepository.findByEmail(email)
                .map(user -> {
                    if (userDto.getFirstName() != null) user.setFirstName(userDto.getFirstName());
                    if (userDto.getLastName() != null) user.setLastName(userDto.getLastName());
                    if (userDto.getPhoneNumber() != null) user.setPhoneNumber(userDto.getPhoneNumber());
                    if (userDto.getBio() != null) user.setBio(userDto.getBio());
                    if (userDto.getAddress() != null) user.setAddress(userDto.getAddress());
                    if (userDto.getCity() != null) user.setCity(userDto.getCity());
                    if (userDto.getCountry() != null) user.setCountry(userDto.getCountry());
                    if (userDto.getLatitude() != null) user.setLatitude(userDto.getLatitude());
                    if (userDto.getLongitude() != null) user.setLongitude(userDto.getLongitude());
                    
                    user.setUpdatedAt(LocalDateTime.now());
                    User updatedUser = userRepository.save(user);
                    return convertToDto(updatedUser);
                });
    }
    
    public Optional<UserDto> updateUserStatus(Long id, String status, Authentication authentication) {
        // Check if user has admin role
        String currentUserEmail = authentication.getName();
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new RuntimeException("Current user not found"));
        
        if (!currentUser.getRole().name().equals("ADMIN")) {
            throw new RuntimeException("Insufficient permissions");
        }
        
        return userRepository.findById(id)
                .map(user -> {
                    user.setStatus(com.petaverse.entity.UserStatus.valueOf(status));
                    user.setUpdatedAt(LocalDateTime.now());
                    User updatedUser = userRepository.save(user);
                    return convertToDto(updatedUser);
                });
    }
    
    public boolean deleteUser(Long id, Authentication authentication) {
        String currentUserEmail = authentication.getName();
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new RuntimeException("Current user not found"));
        
        // Only admin or the user themselves can delete
        if (!currentUser.getRole().name().equals("ADMIN") && !currentUser.getId().equals(id)) {
            return false;
        }
        
        return userRepository.findById(id)
                .map(user -> {
                    userRepository.delete(user);
                    return true;
                })
                .orElse(false);
    }
    
    public List<UserDto> searchUsers(String name, String location, String role) {
        return userRepository.searchUsers(name, location, role).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public boolean followUser(String followerEmail, Long userId) {
        User follower = userRepository.findByEmail(followerEmail)
                .orElseThrow(() -> new RuntimeException("Follower not found"));
        User userToFollow = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User to follow not found"));
        
        // Implementation for following user
        // This would typically involve a separate Follow entity
        return true;
    }
    
    public boolean unfollowUser(String followerEmail, Long userId) {
        User follower = userRepository.findByEmail(followerEmail)
                .orElseThrow(() -> new RuntimeException("Follower not found"));
        User userToUnfollow = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User to unfollow not found"));
        
        // Implementation for unfollowing user
        return true;
    }
    
    public List<UserDto> getUserFollowers(Long userId) {
        // Implementation for getting followers
        return List.of();
    }
    
    public List<UserDto> getUserFollowing(Long userId) {
        // Implementation for getting following
        return List.of();
    }
} 