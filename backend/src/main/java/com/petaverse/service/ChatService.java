package com.petaverse.service;

import com.petaverse.dto.ChatMessageDto;
import com.petaverse.dto.ChatRoomDto;
import com.petaverse.entity.*;
import com.petaverse.repository.ChatRoomRepository;
import com.petaverse.repository.MessageRepository;
import com.petaverse.repository.UserRepository;
import com.petaverse.repository.AdoptionListingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class ChatService {
    
    @Autowired
    private ChatRoomRepository chatRoomRepository;
    
    @Autowired
    private MessageRepository messageRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private AdoptionListingRepository adoptionListingRepository;
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    public ChatRoomDto createOrGetChatRoom(Long adoptionListingId, Long interestedUserId) {
        AdoptionListing adoptionListing = adoptionListingRepository.findById(adoptionListingId)
                .orElseThrow(() -> new RuntimeException("Adoption listing not found"));
        
        User interestedUser = userRepository.findById(interestedUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Check if chat room already exists
        Optional<ChatRoom> existingChatRoom = chatRoomRepository
                .findByAdoptionListingAndUser(adoptionListingId, interestedUserId);
        
        if (existingChatRoom.isPresent()) {
            return convertToDto(existingChatRoom.get());
        }
        
        // Create new chat room
        ChatRoom chatRoom = new ChatRoom();
        chatRoom.setName(adoptionListing.getTitle() + " - " + interestedUser.getFirstName());
        chatRoom.setAdoptionListing(adoptionListing);
        chatRoom.setOwner(adoptionListing.getOwner());
        chatRoom.setInterestedUser(interestedUser);
        chatRoom.setActive(true);
        chatRoom.setCreatedAt(LocalDateTime.now());
        
        chatRoom = chatRoomRepository.save(chatRoom);
        
        return convertToDto(chatRoom);
    }
    
    public ChatMessageDto sendMessage(Long chatRoomId, Long senderId, String content) {
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new RuntimeException("Chat room not found"));
        
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        
        // Determine receiver
        User receiver = chatRoom.getOwner().getId().equals(senderId) 
                ? chatRoom.getInterestedUser() 
                : chatRoom.getOwner();
        
        // Create message
        Message message = new Message();
        message.setContent(content);
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setAdoptionListing(chatRoom.getAdoptionListing());
        message.setChatRoom(chatRoom);
        message.setType(MessageType.TEXT);
        message.setStatus(MessageStatus.SENT);
        message.setCreatedAt(LocalDateTime.now());
        message.setRead(false);
        
        message = messageRepository.save(message);
        
        // Update chat room last message
        chatRoom.updateLastMessage(content, LocalDateTime.now());
        chatRoomRepository.save(chatRoom);
        
        // Convert to DTO
        ChatMessageDto messageDto = convertToDto(message);
        
        // Send via WebSocket
        messagingTemplate.convertAndSendToUser(
                receiver.getId().toString(),
                "/queue/messages",
                messageDto
        );
        
        // Also send to chat room topic
        messagingTemplate.convertAndSend("/topic/chat/" + chatRoomId, messageDto);
        
        return messageDto;
    }
    
    public List<ChatRoomDto> getUserChatRooms(Long userId) {
        List<ChatRoom> chatRooms = chatRoomRepository.findByUserIdOrderByLastMessage(userId);
        return chatRooms.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<ChatMessageDto> getChatRoomMessages(Long chatRoomId, Long userId) {
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new RuntimeException("Chat room not found"));
        
        // Check if user has access to this chat room
        if (!chatRoom.getOwner().getId().equals(userId) && 
            !chatRoom.getInterestedUser().getId().equals(userId)) {
            throw new RuntimeException("Access denied to chat room");
        }
        
        List<Message> messages = messageRepository.findByChatRoomOrderByCreatedAtAsc(chatRoom);
        
        // Mark messages as read
        messages.stream()
                .filter(msg -> !msg.getSender().getId().equals(userId) && !msg.isRead())
                .forEach(msg -> {
                    msg.setRead(true);
                    msg.setReadAt(LocalDateTime.now());
                    msg.setStatus(MessageStatus.READ);
                });
        messageRepository.saveAll(messages);
        
        return messages.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public void markMessagesAsRead(Long chatRoomId, Long userId) {
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new RuntimeException("Chat room not found"));
        
        List<Message> unreadMessages = messageRepository.findByChatRoomAndSenderNotAndIsReadFalse(
                chatRoom, userRepository.findById(userId).orElseThrow());
        
        unreadMessages.forEach(msg -> {
            msg.setRead(true);
            msg.setReadAt(LocalDateTime.now());
            msg.setStatus(MessageStatus.READ);
        });
        
        messageRepository.saveAll(unreadMessages);
    }
    
    private ChatRoomDto convertToDto(ChatRoom chatRoom) {
        ChatRoomDto dto = new ChatRoomDto();
        dto.setId(chatRoom.getId());
        dto.setName(chatRoom.getName());
        dto.setAdoptionListingId(chatRoom.getAdoptionListing().getId());
        dto.setAdoptionListingTitle(chatRoom.getAdoptionListing().getTitle());
        dto.setAdoptionListingImage(chatRoom.getAdoptionListing().getImages().isEmpty() ? 
                null : chatRoom.getAdoptionListing().getImages().get(0));
        dto.setOwnerId(chatRoom.getOwner().getId());
        dto.setOwnerName(chatRoom.getOwner().getFirstName() + " " + chatRoom.getOwner().getLastName());
        dto.setOwnerAvatar(chatRoom.getOwner().getProfileImage());
        dto.setInterestedUserId(chatRoom.getInterestedUser().getId());
        dto.setInterestedUserName(chatRoom.getInterestedUser().getFirstName() + " " + 
                chatRoom.getInterestedUser().getLastName());
        dto.setInterestedUserAvatar(chatRoom.getInterestedUser().getProfileImage());
        dto.setLastMessageTime(chatRoom.getLastMessageTime());
        dto.setLastMessage(chatRoom.getLastMessage());
        dto.setCreatedAt(chatRoom.getCreatedAt());
        dto.setActive(chatRoom.isActive());
        
        return dto;
    }
    
    private ChatMessageDto convertToDto(Message message) {
        ChatMessageDto dto = new ChatMessageDto();
        dto.setId(message.getId());
        dto.setContent(message.getContent());
        dto.setSenderId(message.getSender().getId());
        dto.setSenderName(message.getSender().getFirstName() + " " + message.getSender().getLastName());
        dto.setSenderAvatar(message.getSender().getProfileImage());
        dto.setReceiverId(message.getReceiver().getId());
        dto.setReceiverName(message.getReceiver().getFirstName() + " " + message.getReceiver().getLastName());
        dto.setReceiverAvatar(message.getReceiver().getProfileImage());
        dto.setAdoptionListingId(message.getAdoptionListing().getId());
        dto.setType(ChatMessageDto.MessageType.valueOf(message.getType().name()));
        dto.setStatus(ChatMessageDto.MessageStatus.valueOf(message.getStatus().name()));
        dto.setTimestamp(message.getCreatedAt());
        dto.setRead(message.isRead());
        
        return dto;
    }
}
