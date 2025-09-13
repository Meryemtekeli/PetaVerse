package com.petaverse.repository;

import com.petaverse.entity.Notification;
import com.petaverse.entity.NotificationStatus;
import com.petaverse.entity.NotificationType;
import com.petaverse.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    List<Notification> findByUserOrderByCreatedAtDesc(User user);
    
    Page<Notification> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
    
    List<Notification> findByUserAndIsReadFalseOrderByCreatedAtDesc(User user);
    
    List<Notification> findByUserAndTypeOrderByCreatedAtDesc(User user, NotificationType type);
    
    List<Notification> findByUserAndStatusOrderByCreatedAtDesc(User user, NotificationStatus status);
    
    @Query("SELECT n FROM Notification n WHERE n.user = :user AND n.isRead = false")
    List<Notification> findUnreadByUser(@Param("user") User user);
    
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.user = :user AND n.isRead = false")
    long countUnreadByUser(@Param("user") User user);
    
    @Query("SELECT n FROM Notification n WHERE n.user = :user AND n.type = :type AND n.isRead = false")
    List<Notification> findUnreadByUserAndType(@Param("user") User user, @Param("type") NotificationType type);
    
    @Query("SELECT n FROM Notification n WHERE n.isSent = false AND n.createdAt <= :before ORDER BY n.createdAt ASC")
    List<Notification> findPendingNotifications(@Param("before") LocalDateTime before);
    
    @Query("SELECT n FROM Notification n WHERE n.user = :user AND n.createdAt >= :since ORDER BY n.createdAt DESC")
    List<Notification> findByUserAndCreatedAtAfter(@Param("user") User user, @Param("since") LocalDateTime since);
    
    @Query("SELECT n FROM Notification n WHERE n.user = :user AND n.type = :type AND n.createdAt >= :since ORDER BY n.createdAt DESC")
    List<Notification> findByUserAndTypeAndCreatedAtAfter(@Param("user") User user, @Param("type") NotificationType type, @Param("since") LocalDateTime since);
    
    @Query("DELETE FROM Notification n WHERE n.user = :user AND n.isRead = true AND n.createdAt < :before")
    void deleteOldReadNotifications(@Param("user") User user, @Param("before") LocalDateTime before);
    
    @Query("SELECT n FROM Notification n WHERE n.user = :user AND n.actionUrl IS NOT NULL ORDER BY n.createdAt DESC")
    List<Notification> findNotificationsWithActions(@Param("user") User user);
}
