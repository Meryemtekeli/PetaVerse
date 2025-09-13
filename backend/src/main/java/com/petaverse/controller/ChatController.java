package com.petaverse.controller;

import com.petaverse.dto.ChatMessageDto;
import com.petaverse.dto.ChatRoomDto;
import com.petaverse.service.ChatService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@Tag(name = "Chat", description = "Chat and messaging endpoints")
public class ChatController {
    
    @Autowired
    private ChatService chatService;
    
    @PostMapping("/rooms")
    @Operation(summary = "Create or get chat room for adoption listing")
    public ResponseEntity<ChatRoomDto> createOrGetChatRoom(
            @RequestParam Long adoptionListingId,
            @RequestParam Long interestedUserId) {
        ChatRoomDto chatRoom = chatService.createOrGetChatRoom(adoptionListingId, interestedUserId);
        return ResponseEntity.ok(chatRoom);
    }
    
    @GetMapping("/rooms")
    @Operation(summary = "Get user's chat rooms")
    public ResponseEntity<List<ChatRoomDto>> getUserChatRooms(@RequestParam Long userId) {
        List<ChatRoomDto> chatRooms = chatService.getUserChatRooms(userId);
        return ResponseEntity.ok(chatRooms);
    }
    
    @GetMapping("/rooms/{chatRoomId}/messages")
    @Operation(summary = "Get chat room messages")
    public ResponseEntity<List<ChatMessageDto>> getChatRoomMessages(
            @PathVariable Long chatRoomId,
            @RequestParam Long userId) {
        List<ChatMessageDto> messages = chatService.getChatRoomMessages(chatRoomId, userId);
        return ResponseEntity.ok(messages);
    }
    
    @PostMapping("/rooms/{chatRoomId}/read")
    @Operation(summary = "Mark messages as read")
    public ResponseEntity<Void> markMessagesAsRead(
            @PathVariable Long chatRoomId,
            @RequestParam Long userId) {
        chatService.markMessagesAsRead(chatRoomId, userId);
        return ResponseEntity.ok().build();
    }
    
    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload ChatMessageDto chatMessage, SimpMessageHeaderAccessor headerAccessor) {
        Authentication auth = (Authentication) headerAccessor.getUser();
        if (auth != null && auth.getPrincipal() instanceof org.springframework.security.core.userdetails.UserDetails) {
            // Extract user ID from authentication
            // This would need to be implemented based on your authentication setup
            Long userId = 1L; // Placeholder - implement proper user ID extraction
            
            ChatMessageDto sentMessage = chatService.sendMessage(
                chatMessage.getAdoptionListingId(), // This should be chatRoomId in real implementation
                userId,
                chatMessage.getContent()
            );
        }
    }
    
    @MessageMapping("/chat.addUser")
    public void addUser(@Payload ChatMessageDto chatMessage, SimpMessageHeaderAccessor headerAccessor) {
        // Add user to WebSocket session
        headerAccessor.getSessionAttributes().put("username", chatMessage.getSenderName());
    }
}
