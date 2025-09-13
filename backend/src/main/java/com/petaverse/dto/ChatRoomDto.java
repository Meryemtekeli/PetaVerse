package com.petaverse.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoomDto {
    private Long id;
    private String name;
    private Long adoptionListingId;
    private String adoptionListingTitle;
    private String adoptionListingImage;
    private Long ownerId;
    private String ownerName;
    private String ownerAvatar;
    private Long interestedUserId;
    private String interestedUserName;
    private String interestedUserAvatar;
    private LocalDateTime lastMessageTime;
    private String lastMessage;
    private int unreadCount;
    private LocalDateTime createdAt;
    private boolean isActive;
    private List<ChatMessageDto> recentMessages;
}
