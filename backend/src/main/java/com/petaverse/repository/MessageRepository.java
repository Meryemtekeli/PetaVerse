package com.petaverse.repository;

import com.petaverse.entity.Message;
import com.petaverse.entity.MessageStatus;
import com.petaverse.entity.MessageType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    
    List<Message> findByReceiverIdOrderByCreatedAtDesc(Long receiverId);
    
    List<Message> findByReceiverIdAndStatus(Long receiverId, MessageStatus status);
    
    List<Message> findBySenderIdAndReceiverIdOrderByCreatedAtDesc(Long senderId, Long receiverId);
    
    List<Message> findByReceiverIdAndTypeOrderByCreatedAtDesc(Long receiverId, MessageType type);
    
    @Query("SELECT m FROM Message m WHERE (m.sender.id = :userId1 AND m.receiver.id = :userId2) OR (m.sender.id = :userId2 AND m.receiver.id = :userId1) ORDER BY m.createdAt DESC")
    List<Message> findConversationBetweenUsers(@Param("userId1") Long userId1, @Param("userId2") Long userId2);
    
    @Query("SELECT COUNT(m) FROM Message m WHERE m.receiver.id = :receiverId AND m.status = :status")
    long countByReceiverIdAndStatus(@Param("receiverId") Long receiverId, @Param("status") MessageStatus status);
    
    List<Message> findByReceiverIdAndTypeAndStatus(Long receiverId, MessageType type, MessageStatus status);
    
    @Query("SELECT m FROM Message m WHERE m.receiver.id = :receiverId AND m.createdAt >= :since ORDER BY m.createdAt DESC")
    List<Message> findByReceiverIdAndCreatedAtAfter(@Param("receiverId") Long receiverId, @Param("since") java.time.LocalDateTime since);
    
    @Query("SELECT DISTINCT m FROM Message m WHERE (m.sender.id = :userId OR m.receiver.id = :userId) ORDER BY m.createdAt DESC")
    List<Message> findDistinctConversationsByUserId(@Param("userId") Long userId);
    
    List<Message> findByConversationIdAndUserId(String conversationId, Long userId);
    
    List<Message> findByConversationIdAndReceiverIdAndStatus(String conversationId, Long receiverId, MessageStatus status);
}
