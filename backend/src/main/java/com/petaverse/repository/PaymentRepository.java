package com.petaverse.repository;

import com.petaverse.entity.Payment;
import com.petaverse.entity.PaymentStatus;
import com.petaverse.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    
    List<Payment> findByUserOrderByCreatedAtDesc(User user);
    
    Page<Payment> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
    
    List<Payment> findByUserAndStatusOrderByCreatedAtDesc(User user, PaymentStatus status);
    
    List<Payment> findByAdoptionListingIdOrderByCreatedAtDesc(Long adoptionListingId);
    
    @Query("SELECT p FROM Payment p WHERE p.paymentProviderId = :providerId")
    Optional<Payment> findByPaymentProviderId(@Param("providerId") String providerId);
    
    @Query("SELECT p FROM Payment p WHERE p.status = :status AND p.createdAt < :before")
    List<Payment> findPendingPaymentsOlderThan(@Param("status") PaymentStatus status, @Param("before") LocalDateTime before);
    
    @Query("SELECT p FROM Payment p WHERE p.user = :user AND p.status = 'COMPLETED' AND p.createdAt >= :since")
    List<Payment> findCompletedPaymentsByUserSince(@Param("user") User user, @Param("since") LocalDateTime since);
    
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.user = :user AND p.status = 'COMPLETED'")
    java.math.BigDecimal getTotalPaidByUser(@Param("user") User user);
    
    @Query("SELECT COUNT(p) FROM Payment p WHERE p.status = 'COMPLETED' AND p.createdAt >= :since")
    Long countCompletedPaymentsSince(@Param("since") LocalDateTime since);
    
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'COMPLETED' AND p.createdAt >= :since")
    java.math.BigDecimal getTotalRevenueSince(@Param("since") LocalDateTime since);
    
    @Query("SELECT p FROM Payment p WHERE p.status IN ('PENDING', 'PROCESSING') AND p.createdAt < :timeout")
    List<Payment> findTimedOutPayments(@Param("timeout") LocalDateTime timeout);
}
