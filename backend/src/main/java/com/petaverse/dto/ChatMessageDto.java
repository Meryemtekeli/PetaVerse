package com.petaverse.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageDto {
    private Long id;
    private String content;
    private Long senderId;
    private String senderName;
    private String senderAvatar;
    private Long receiverId;
    private String receiverName;
    private Long adoptionListingId;
    private MessageType type;
    private MessageStatus status;
    private LocalDateTime timestamp;
    private boolean isRead;
    
    public enum MessageType {
        TEXT, IMAGE, FILE, SYSTEM
    }
    
    public enum MessageStatus {
        SENT, DELIVERED, READ
    }
}
