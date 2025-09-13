package com.petaverse.service;

import com.petaverse.entity.*;
import com.petaverse.repository.PaymentRepository;
import com.petaverse.repository.AdoptionListingRepository;
import com.petaverse.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PaymentService {
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private AdoptionListingRepository adoptionListingRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private NotificationService notificationService;
    
    @Value("${app.payment.stripe.secret-key:}")
    private String stripeSecretKey;
    
    @Value("${app.payment.paypal.client-id:}")
    private String paypalClientId;
    
    @Value("${app.payment.paypal.client-secret:}")
    private String paypalClientSecret;
    
    public Payment createPayment(Long userId, Long adoptionListingId, PaymentMethod paymentMethod) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        AdoptionListing listing = adoptionListingRepository.findById(adoptionListingId)
                .orElseThrow(() -> new RuntimeException("Adoption listing not found"));
        
        if (listing.getAdoptionFee() == null || listing.getAdoptionFee().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("This adoption listing is free");
        }
        
        // Check if user already has a pending payment for this listing
        List<Payment> existingPayments = paymentRepository.findByUserAndStatusOrderByCreatedAtDesc(
                user, PaymentStatus.PENDING);
        
        for (Payment existingPayment : existingPayments) {
            if (existingPayment.getAdoptionListing().getId().equals(adoptionListingId)) {
                throw new RuntimeException("You already have a pending payment for this listing");
            }
        }
        
        Payment payment = new Payment(user, listing, listing.getAdoptionFee(), paymentMethod);
        payment.setDescription("Adoption fee for " + listing.getTitle());
        
        return paymentRepository.save(payment);
    }
    
    public Payment processStripePayment(Long paymentId, String stripeToken) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        
        if (payment.getStatus() != PaymentStatus.PENDING) {
            throw new RuntimeException("Payment is not in pending status");
        }
        
        try {
            payment.setStatus(PaymentStatus.PROCESSING);
            payment.setPaymentProvider("stripe");
            paymentRepository.save(payment);
            
            // Simulate Stripe payment processing
            // In real implementation, you would call Stripe API here
            String stripeTransactionId = "stripe_" + System.currentTimeMillis();
            
            // Simulate successful payment
            payment.setStatus(PaymentStatus.COMPLETED);
            payment.setPaymentProviderId(stripeTransactionId);
            payment.setProcessedAt(LocalDateTime.now());
            
            Payment savedPayment = paymentRepository.save(payment);
            
            // Send notification
            notificationService.sendPaymentConfirmationNotification(
                    payment.getUser().getId(), 
                    payment.getAmount(), 
                    payment.getAdoptionListing().getTitle()
            );
            
            return savedPayment;
            
        } catch (Exception e) {
            payment.setStatus(PaymentStatus.FAILED);
            payment.setFailureReason(e.getMessage());
            paymentRepository.save(payment);
            throw new RuntimeException("Payment processing failed: " + e.getMessage());
        }
    }
    
    public Payment processPayPalPayment(Long paymentId, String paypalOrderId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        
        if (payment.getStatus() != PaymentStatus.PENDING) {
            throw new RuntimeException("Payment is not in pending status");
        }
        
        try {
            payment.setStatus(PaymentStatus.PROCESSING);
            payment.setPaymentProvider("paypal");
            paymentRepository.save(payment);
            
            // Simulate PayPal payment processing
            // In real implementation, you would call PayPal API here
            
            // Simulate successful payment
            payment.setStatus(PaymentStatus.COMPLETED);
            payment.setPaymentProviderId(paypalOrderId);
            payment.setProcessedAt(LocalDateTime.now());
            
            Payment savedPayment = paymentRepository.save(payment);
            
            // Send notification
            notificationService.sendPaymentConfirmationNotification(
                    payment.getUser().getId(), 
                    payment.getAmount(), 
                    payment.getAdoptionListing().getTitle()
            );
            
            return savedPayment;
            
        } catch (Exception e) {
            payment.setStatus(PaymentStatus.FAILED);
            payment.setFailureReason(e.getMessage());
            paymentRepository.save(payment);
            throw new RuntimeException("Payment processing failed: " + e.getMessage());
        }
    }
    
    public Payment refundPayment(Long paymentId, BigDecimal refundAmount, String reason) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        
        if (payment.getStatus() != PaymentStatus.COMPLETED) {
            throw new RuntimeException("Only completed payments can be refunded");
        }
        
        if (refundAmount.compareTo(payment.getAmount()) > 0) {
            throw new RuntimeException("Refund amount cannot exceed payment amount");
        }
        
        try {
            // Simulate refund processing
            // In real implementation, you would call payment provider's refund API
            
            if (refundAmount.compareTo(payment.getAmount()) == 0) {
                payment.setStatus(PaymentStatus.REFUNDED);
            } else {
                payment.setStatus(PaymentStatus.PARTIALLY_REFUNDED);
            }
            
            payment.setRefundAmount(refundAmount);
            payment.setRefundReason(reason);
            payment.setRefundedAt(LocalDateTime.now());
            
            Payment savedPayment = paymentRepository.save(payment);
            
            // Send notification
            notificationService.sendRefundNotification(
                    payment.getUser().getId(), 
                    refundAmount, 
                    payment.getAdoptionListing().getTitle()
            );
            
            return savedPayment;
            
        } catch (Exception e) {
            throw new RuntimeException("Refund processing failed: " + e.getMessage());
        }
    }
    
    public List<Payment> getUserPayments(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return paymentRepository.findByUserOrderByCreatedAtDesc(user);
    }
    
    public List<Payment> getAdoptionListingPayments(Long adoptionListingId) {
        return paymentRepository.findByAdoptionListingIdOrderByCreatedAtDesc(adoptionListingId);
    }
    
    public Optional<Payment> getPaymentByProviderId(String providerId) {
        return paymentRepository.findByPaymentProviderId(providerId);
    }
    
    public void cancelPendingPayments() {
        LocalDateTime timeout = LocalDateTime.now().minusHours(24);
        List<Payment> timedOutPayments = paymentRepository.findTimedOutPayments(timeout);
        
        for (Payment payment : timedOutPayments) {
            payment.setStatus(PaymentStatus.CANCELLED);
            payment.setFailureReason("Payment timeout");
            paymentRepository.save(payment);
        }
    }
    
    public PaymentStatistics getPaymentStatistics() {
        LocalDateTime oneMonthAgo = LocalDateTime.now().minusMonths(1);
        
        PaymentStatistics stats = new PaymentStatistics();
        stats.setTotalCompletedPayments(paymentRepository.countCompletedPaymentsSince(oneMonthAgo));
        stats.setTotalRevenue(paymentRepository.getTotalRevenueSince(oneMonthAgo));
        stats.setAveragePaymentAmount(calculateAveragePaymentAmount(oneMonthAgo));
        
        return stats;
    }
    
    private BigDecimal calculateAveragePaymentAmount(LocalDateTime since) {
        List<Payment> completedPayments = paymentRepository.findByStatusAndCreatedAtAfter(
                PaymentStatus.COMPLETED, since);
        
        if (completedPayments.isEmpty()) {
            return BigDecimal.ZERO;
        }
        
        BigDecimal total = completedPayments.stream()
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        return total.divide(BigDecimal.valueOf(completedPayments.size()), 2, BigDecimal.ROUND_HALF_UP);
    }
    
    // Data class for statistics
    public static class PaymentStatistics {
        private Long totalCompletedPayments;
        private BigDecimal totalRevenue;
        private BigDecimal averagePaymentAmount;
        
        // Getters and setters
        public Long getTotalCompletedPayments() { return totalCompletedPayments; }
        public void setTotalCompletedPayments(Long totalCompletedPayments) { this.totalCompletedPayments = totalCompletedPayments; }
        
        public BigDecimal getTotalRevenue() { return totalRevenue; }
        public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }
        
        public BigDecimal getAveragePaymentAmount() { return averagePaymentAmount; }
        public void setAveragePaymentAmount(BigDecimal averagePaymentAmount) { this.averagePaymentAmount = averagePaymentAmount; }
    }
}
