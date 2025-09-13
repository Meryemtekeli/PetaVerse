package com.petaverse.service;

import com.petaverse.entity.*;
import com.petaverse.repository.NotificationRepository;
import com.petaverse.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class NotificationService {
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private EmailService emailService;
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    public Notification createNotification(Long userId, String title, String message, 
                                         NotificationType type, String actionUrl, String actionData) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Notification notification = new Notification(user, title, message, type);
        notification.setActionUrl(actionUrl);
        notification.setActionData(actionData);
        
        return notificationRepository.save(notification);
    }
    
    public Notification createNotification(User user, String title, String message, 
                                         NotificationType type, String actionUrl, String actionData) {
        Notification notification = new Notification(user, title, message, type);
        notification.setActionUrl(actionUrl);
        notification.setActionData(actionData);
        
        return notificationRepository.save(notification);
    }
    
    public List<Notification> getUserNotifications(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return notificationRepository.findByUserOrderByCreatedAtDesc(user);
    }
    
    public Page<Notification> getUserNotifications(Long userId, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return notificationRepository.findByUserOrderByCreatedAtDesc(user, pageable);
    }
    
    public List<Notification> getUnreadNotifications(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return notificationRepository.findUnreadByUser(user);
    }
    
    public long getUnreadCount(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return notificationRepository.countUnreadByUser(user);
    }
    
    public void markAsRead(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        
        if (!notification.getUser().getId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }
        
        notification.setRead(true);
        notification.setStatus(NotificationStatus.READ);
        notificationRepository.save(notification);
    }
    
    public void markAllAsRead(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Notification> unreadNotifications = notificationRepository.findUnreadByUser(user);
        unreadNotifications.forEach(notification -> {
            notification.setRead(true);
            notification.setStatus(NotificationStatus.READ);
        });
        notificationRepository.saveAll(unreadNotifications);
    }
    
    public void deleteNotification(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        
        if (!notification.getUser().getId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }
        
        notificationRepository.delete(notification);
    }
    
    public void sendNotification(Notification notification) {
        try {
            // Send via WebSocket
            messagingTemplate.convertAndSendToUser(
                    notification.getUser().getId().toString(),
                    "/queue/notifications",
                    notification
            );
            
            // Send email if user has email notifications enabled
            if (shouldSendEmail(notification)) {
                emailService.sendNotificationEmail(
                        notification.getUser().getEmail(),
                        notification.getTitle(),
                        notification.getMessage(),
                        notification.getActionUrl()
                );
            }
            
            // Mark as sent
            notification.setSent(true);
            notification.setStatus(NotificationStatus.SENT);
            notificationRepository.save(notification);
            
        } catch (Exception e) {
            notification.setStatus(NotificationStatus.FAILED);
            notificationRepository.save(notification);
            throw new RuntimeException("Failed to send notification", e);
        }
    }
    
    public void sendBulkNotifications(List<Notification> notifications) {
        for (Notification notification : notifications) {
            try {
                sendNotification(notification);
            } catch (Exception e) {
                // Log error but continue with other notifications
                System.err.println("Failed to send notification " + notification.getId() + ": " + e.getMessage());
            }
        }
    }
    
    // Specific notification methods
    public void sendAdoptionRequestNotification(Long ownerId, Long interestedUserId, Long adoptionListingId) {
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Owner not found"));
        
        User interestedUser = userRepository.findById(interestedUserId)
                .orElseThrow(() -> new RuntimeException("Interested user not found"));
        
        String title = "Yeni Sahiplendirme Talebi";
        String message = interestedUser.getFirstName() + " " + interestedUser.getLastName() + 
                        " hayvanınızı sahiplenmek istiyor.";
        String actionUrl = "/adoption/" + adoptionListingId + "/applications";
        
        Notification notification = createNotification(owner, title, message, 
                NotificationType.ADOPTION_REQUEST, actionUrl, null);
        sendNotification(notification);
    }
    
    public void sendNewMessageNotification(Long receiverId, Long senderId, String senderName) {
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));
        
        String title = "Yeni Mesaj";
        String message = senderName + " size yeni bir mesaj gönderdi.";
        String actionUrl = "/chat";
        
        Notification notification = createNotification(receiver, title, message, 
                NotificationType.NEW_MESSAGE, actionUrl, null);
        sendNotification(notification);
    }
    
    public void sendLostPetFoundNotification(Long ownerId, String petName, String finderName) {
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Owner not found"));
        
        String title = "Hayvanınız Bulundu!";
        String message = petName + " adlı hayvanınız " + finderName + " tarafından bulundu.";
        String actionUrl = "/lost-pets";
        
        Notification notification = createNotification(owner, title, message, 
                NotificationType.LOST_PET_FOUND, actionUrl, null);
        sendNotification(notification);
    }
    
    public void sendVaccinationReminder(Long userId, String petName, String vaccineName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        String title = "Aşı Hatırlatması";
        String message = petName + " için " + vaccineName + " aşısı zamanı geldi.";
        String actionUrl = "/pets";
        
        Notification notification = createNotification(user, title, message, 
                NotificationType.VACCINATION_REMINDER, actionUrl, null);
        sendNotification(notification);
    }
    
    public void sendWelcomeNotification(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        String title = "PetaVerse'e Hoş Geldiniz!";
        String message = "Evcil hayvan dünyasına hoş geldiniz. İlk hayvanınızı ekleyerek başlayabilirsiniz.";
        String actionUrl = "/pets/create";
        
        Notification notification = createNotification(user, title, message, 
                NotificationType.WELCOME, actionUrl, null);
        sendNotification(notification);
    }
    
    public void cleanupOldNotifications() {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(30);
        List<User> users = userRepository.findAll();
        
        for (User user : users) {
            notificationRepository.deleteOldReadNotifications(user, cutoffDate);
        }
    }
    
    private boolean shouldSendEmail(Notification notification) {
        // Check user preferences, notification type, etc.
        return notification.getType() != NotificationType.NEW_MESSAGE; // Don't send email for every message
    }
}