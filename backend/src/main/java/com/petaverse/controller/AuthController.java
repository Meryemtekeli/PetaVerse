package com.petaverse.controller;

import com.petaverse.dto.LoginRequest;
import com.petaverse.dto.RegisterRequest;
import com.petaverse.dto.AuthResponse;
import com.petaverse.dto.UserDto;
import com.petaverse.service.AuthService;
import com.petaverse.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Kimlik doğrulama işlemleri")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    @Operation(summary = "Kullanıcı kaydı", description = "Yeni kullanıcı kaydı oluşturur")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    @Operation(summary = "Kullanıcı girişi", description = "Kullanıcı girişi yapar ve JWT token döner")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    @Operation(summary = "Mevcut kullanıcı bilgileri", description = "Giriş yapmış kullanıcının bilgilerini döner")
    public ResponseEntity<UserDto> getCurrentUser(Authentication authentication) {
        UserDto user = userService.getCurrentUser(authentication);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/refresh")
    @Operation(summary = "Token yenileme", description = "JWT token'ı yeniler")
    public ResponseEntity<AuthResponse> refreshToken(@RequestHeader("Authorization") String token) {
        AuthResponse response = authService.refreshToken(token);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    @Operation(summary = "Çıkış yapma", description = "Kullanıcı çıkışı yapar")
    public ResponseEntity<String> logout(Authentication authentication) {
        authService.logout(authentication);
        return ResponseEntity.ok("Başarıyla çıkış yapıldı");
    }

    @PostMapping("/forgot-password")
    @Operation(summary = "Şifre sıfırlama", description = "Şifre sıfırlama e-postası gönderir")
    public ResponseEntity<String> forgotPassword(@RequestParam String email) {
        authService.forgotPassword(email);
        return ResponseEntity.ok("Şifre sıfırlama e-postası gönderildi");
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Şifre sıfırlama", description = "Token ile şifre sıfırlar")
    public ResponseEntity<String> resetPassword(@RequestParam String token, @RequestParam String newPassword) {
        authService.resetPassword(token, newPassword);
        return ResponseEntity.ok("Şifre başarıyla sıfırlandı");
    }

    @PostMapping("/verify-email")
    @Operation(summary = "E-posta doğrulama", description = "E-posta doğrulama token'ını kontrol eder")
    public ResponseEntity<String> verifyEmail(@RequestParam String token) {
        authService.verifyEmail(token);
        return ResponseEntity.ok("E-posta başarıyla doğrulandı");
    }

    @PostMapping("/resend-verification")
    @Operation(summary = "Doğrulama e-postası yeniden gönder", description = "E-posta doğrulama e-postasını yeniden gönderir")
    public ResponseEntity<String> resendVerificationEmail(@RequestParam String email) {
        authService.resendVerificationEmail(email);
        return ResponseEntity.ok("Doğrulama e-postası yeniden gönderildi");
    }
} 