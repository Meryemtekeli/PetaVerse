package com.petaverse.controller;

import com.petaverse.entity.Message;
import com.petaverse.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MessageController {
    
    private final MessageService messageService;
    
    @GetMapping("/conversations")
    public ResponseEntity<List<Message>> getUserConversations(Authentication authentication) {
        String userEmail = authentication.getName();
        List<Message> conversations = messageService.getUserConversations(userEmail);
        return ResponseEntity.ok(conversations);
    }
    
    @GetMapping("/conversations/{conversationId}")
    public ResponseEntity<List<Message>> getConversationMessages(
            @PathVariable String conversationId,
            Authentication authentication) {
        String userEmail = authentication.getName();
        List<Message> messages = messageService.getConversationMessages(conversationId, userEmail);
        return ResponseEntity.ok(messages);
    }
    
    @PostMapping
    public ResponseEntity<Message> sendMessage(
            @RequestBody Message message,
            Authentication authentication) {
        String senderEmail = authentication.getName();
        Optional<Message> sentMessage = messageService.sendMessage(message, senderEmail);
        return sentMessage.map(ResponseEntity::ok)
                .orElse(ResponseEntity.badRequest().build());
    }
    
    @PutMapping("/{id}/read")
    public ResponseEntity<Message> markMessageAsRead(
            @PathVariable Long id,
            Authentication authentication) {
        String userEmail = authentication.getName();
        Optional<Message> message = messageService.markAsRead(id, userEmail);
        return message.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/conversations/{conversationId}/read")
    public ResponseEntity<Void> markConversationAsRead(
            @PathVariable String conversationId,
            Authentication authentication) {
        String userEmail = authentication.getName();
        boolean marked = messageService.markConversationAsRead(conversationId, userEmail);
        if (marked) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMessage(
            @PathVariable Long id,
            Authentication authentication) {
        String userEmail = authentication.getName();
        boolean deleted = messageService.deleteMessage(id, userEmail);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadMessageCount(Authentication authentication) {
        String userEmail = authentication.getName();
        Long count = messageService.getUnreadMessageCount(userEmail);
        return ResponseEntity.ok(count);
    }
    
    @PostMapping("/conversations/{conversationId}/block")
    public ResponseEntity<Void> blockConversation(
            @PathVariable String conversationId,
            Authentication authentication) {
        String userEmail = authentication.getName();
        boolean blocked = messageService.blockConversation(conversationId, userEmail);
        if (blocked) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }
    
    @DeleteMapping("/conversations/{conversationId}/block")
    public ResponseEntity<Void> unblockConversation(
            @PathVariable String conversationId,
            Authentication authentication) {
        String userEmail = authentication.getName();
        boolean unblocked = messageService.unblockConversation(conversationId, userEmail);
        if (unblocked) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }
}
