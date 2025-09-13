package com.petaverse.service;

import com.petaverse.entity.Message;
import com.petaverse.entity.MessageStatus;
import com.petaverse.entity.User;
import com.petaverse.repository.MessageRepository;
import com.petaverse.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class MessageService {
    
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    
    public List<Message> getUserConversations(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return messageRepository.findDistinctConversationsByUserId(user.getId());
    }
    
    public List<Message> getConversationMessages(String conversationId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return messageRepository.findByConversationIdAndUserId(conversationId, user.getId());
    }
    
    public Optional<Message> sendMessage(Message message, String senderEmail) {
        User sender = userRepository.findByEmail(senderEmail)
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        
        User receiver = userRepository.findById(message.getReceiver().getId())
                .orElseThrow(() -> new RuntimeException("Receiver not found"));
        
        // Generate conversation ID if not exists
        if (message.getConversationId() == null) {
            String conversationId = generateConversationId(sender.getId(), receiver.getId());
            message.setConversationId(conversationId);
        }
        
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setStatus(MessageStatus.UNREAD);
        message.setCreatedAt(LocalDateTime.now());
        
        Message savedMessage = messageRepository.save(message);
        return Optional.of(savedMessage);
    }
    
    public Optional<Message> markAsRead(Long messageId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return messageRepository.findById(messageId)
                .filter(message -> message.getReceiver().getId().equals(user.getId()))
                .map(message -> {
                    message.setStatus(MessageStatus.READ);
                    message.setReadAt(LocalDateTime.now());
                    return messageRepository.save(message);
                });
    }
    
    public boolean markConversationAsRead(String conversationId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Message> messages = messageRepository.findByConversationIdAndReceiverIdAndStatus(
                conversationId, user.getId(), MessageStatus.UNREAD);
        
        messages.forEach(message -> {
            message.setStatus(MessageStatus.READ);
            message.setReadAt(LocalDateTime.now());
            messageRepository.save(message);
        });
        
        return !messages.isEmpty();
    }
    
    public boolean deleteMessage(Long messageId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return messageRepository.findById(messageId)
                .filter(message -> message.getSender().getId().equals(user.getId()))
                .map(message -> {
                    messageRepository.delete(message);
                    return true;
                })
                .orElse(false);
    }
    
    public Long getUnreadMessageCount(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return messageRepository.countByReceiverIdAndStatus(user.getId(), MessageStatus.UNREAD);
    }
    
    public boolean blockConversation(String conversationId, String userEmail) {
        userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Implementation for blocking conversation
        // This would typically involve updating a conversation settings table
        return true;
    }
    
    public boolean unblockConversation(String conversationId, String userEmail) {
        userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Implementation for unblocking conversation
        return true;
    }
    
    private String generateConversationId(Long userId1, Long userId2) {
        // Generate a consistent conversation ID based on user IDs
        Long minId = Math.min(userId1, userId2);
        Long maxId = Math.max(userId1, userId2);
        return "conv_" + minId + "_" + maxId + "_" + UUID.randomUUID().toString().substring(0, 8);
    }
}
