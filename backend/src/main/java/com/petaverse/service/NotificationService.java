package com.petaverse.service;

import com.petaverse.entity.Message;
import com.petaverse.entity.MessageType;
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

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationService {
    
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    
    public void sendAdoptionApplicationNotification(Long listingId, Long applicantId, Long ownerId) {
        try {
            User applicant = userRepository.findById(applicantId)
                    .orElseThrow(() -> new RuntimeException("Applicant not found"));
            
            User owner = userRepository.findById(ownerId)
                    .orElseThrow(() -> new RuntimeException("Owner not found"));
            
            // Create in-app notification
            Message notification = new Message();
            notification.setSender(applicant);
            notification.setReceiver(owner);
            notification.setType(MessageType.ADOPTION_APPLICATION);
            notification.setContent("Yeni bir sahiplendirme başvurusu aldınız!");
            notification.setStatus(MessageStatus.UNREAD);
            notification.setCreatedAt(LocalDateTime.now());
            
            messageRepository.save(notification);
            
            // Send email notification
            String subject = "Yeni Sahiplendirme Başvurusu";
            String content = String.format(
                "Merhaba %s,\n\n%s adlı evcil hayvanınız için yeni bir sahiplendirme başvurusu aldınız.\n\n" +
                "Başvuruyu incelemek için uygulamaya giriş yapın.\n\n" +
                "Saygılarımızla,\nPetaVerse Ekibi",
                owner.getName(), "Pet Name" // TODO: Get actual pet name
            );
            
            emailService.sendEmail(owner.getEmail(), subject, content);
            
        } catch (Exception e) {
            // Log error but don't fail the main operation
            System.err.println("Failed to send adoption application notification: " + e.getMessage());
        }
    }
    
    public void sendAdoptionStatusUpdateNotification(Long applicationId, String status, Long applicantId) {
        try {
            User applicant = userRepository.findById(applicantId)
                    .orElseThrow(() -> new RuntimeException("Applicant not found"));
            
            // Create in-app notification
            Message notification = new Message();
            notification.setSender(null); // System notification
            notification.setReceiver(applicant);
            notification.setType(MessageType.ADOPTION_STATUS_UPDATE);
            notification.setContent("Sahiplendirme başvurunuzun durumu güncellendi: " + status);
            notification.setStatus(MessageStatus.UNREAD);
            notification.setCreatedAt(LocalDateTime.now());
            
            messageRepository.save(notification);
            
            // Send email notification
            String subject = "Sahiplendirme Başvuru Durumu Güncellendi";
            String content = String.format(
                "Merhaba %s,\n\nSahiplendirme başvurunuzun durumu güncellendi: %s\n\n" +
                "Detayları görmek için uygulamaya giriş yapın.\n\n" +
                "Saygılarımızla,\nPetaVerse Ekibi",
                applicant.getName(), status
            );
            
            emailService.sendEmail(applicant.getEmail(), subject, content);
            
        } catch (Exception e) {
            System.err.println("Failed to send adoption status update notification: " + e.getMessage());
        }
    }
    
    public void sendLostPetNotification(Long petId, String location, Long ownerId) {
        try {
            User owner = userRepository.findById(ownerId)
                    .orElseThrow(() -> new RuntimeException("Owner not found"));
            
            // Find users in the same location
            List<User> nearbyUsers = userRepository.findByLocationContainingIgnoreCase(location);
            
            for (User user : nearbyUsers) {
                if (!user.getId().equals(ownerId)) {
                    // Create in-app notification
                    Message notification = new Message();
                    notification.setSender(owner);
                    notification.setReceiver(user);
                    notification.setType(MessageType.LOST_PET_ALERT);
                    notification.setContent("Yakınınızda kayıp bir evcil hayvan var! Yardım edebilir misiniz?");
                    notification.setStatus(MessageStatus.UNREAD);
                    notification.setCreatedAt(LocalDateTime.now());
                    
                    messageRepository.save(notification);
                }
            }
            
        } catch (Exception e) {
            System.err.println("Failed to send lost pet notification: " + e.getMessage());
        }
    }
    
    public void sendReminderNotification(Long reminderId, String message, Long userId) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Create in-app notification
            Message notification = new Message();
            notification.setSender(null); // System notification
            notification.setReceiver(user);
            notification.setType(MessageType.REMINDER);
            notification.setContent(message);
            notification.setStatus(MessageStatus.UNREAD);
            notification.setCreatedAt(LocalDateTime.now());
            
            messageRepository.save(notification);
            
            // Send email reminder
            String subject = "PetaVerse Hatırlatması";
            String content = String.format(
                "Merhaba %s,\n\n%s\n\n" +
                "Detayları görmek için uygulamaya giriş yapın.\n\n" +
                "Saygılarımızla,\nPetaVerse Ekibi",
                user.getName(), message
            );
            
            emailService.sendEmail(user.getEmail(), subject, content);
            
        } catch (Exception e) {
            System.err.println("Failed to send reminder notification: " + e.getMessage());
        }
    }
    
    public List<Message> getUserNotifications(Long userId) {
        return messageRepository.findByReceiverIdOrderByCreatedAtDesc(userId);
    }
    
    public Optional<Message> getNotificationById(Long notificationId) {
        return messageRepository.findById(notificationId);
    }
    
    public void markNotificationAsRead(Long notificationId) {
        messageRepository.findById(notificationId).ifPresent(notification -> {
            notification.setStatus(MessageStatus.READ);
            messageRepository.save(notification);
        });
    }
    
    public void markAllNotificationsAsRead(Long userId) {
        List<Message> unreadNotifications = messageRepository.findByReceiverIdAndStatus(userId, MessageStatus.UNREAD);
        unreadNotifications.forEach(notification -> {
            notification.setStatus(MessageStatus.READ);
            messageRepository.save(notification);
        });
    }
    
    public long getUnreadNotificationCount(Long userId) {
        return messageRepository.countByReceiverIdAndStatus(userId, MessageStatus.UNREAD);
    }
}
