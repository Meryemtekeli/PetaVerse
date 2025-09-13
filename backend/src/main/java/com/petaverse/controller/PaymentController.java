package com.petaverse.controller;

import com.petaverse.entity.Payment;
import com.petaverse.entity.PaymentMethod;
import com.petaverse.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
@Tag(name = "Payments", description = "Payment processing endpoints")
public class PaymentController {
    
    @Autowired
    private PaymentService paymentService;
    
    @PostMapping("/create")
    @Operation(summary = "Create a new payment")
    public ResponseEntity<Payment> createPayment(
            @RequestParam Long userId,
            @RequestParam Long adoptionListingId,
            @RequestParam PaymentMethod paymentMethod) {
        Payment payment = paymentService.createPayment(userId, adoptionListingId, paymentMethod);
        return ResponseEntity.ok(payment);
    }
    
    @PostMapping("/stripe/process")
    @Operation(summary = "Process Stripe payment")
    public ResponseEntity<Payment> processStripePayment(
            @RequestParam Long paymentId,
            @RequestParam String stripeToken) {
        Payment payment = paymentService.processStripePayment(paymentId, stripeToken);
        return ResponseEntity.ok(payment);
    }
    
    @PostMapping("/paypal/process")
    @Operation(summary = "Process PayPal payment")
    public ResponseEntity<Payment> processPayPalPayment(
            @RequestParam Long paymentId,
            @RequestParam String paypalOrderId) {
        Payment payment = paymentService.processPayPalPayment(paymentId, paypalOrderId);
        return ResponseEntity.ok(payment);
    }
    
    @PostMapping("/refund")
    @Operation(summary = "Refund a payment")
    public ResponseEntity<Payment> refundPayment(
            @RequestParam Long paymentId,
            @RequestParam BigDecimal refundAmount,
            @RequestParam String reason) {
        Payment payment = paymentService.refundPayment(paymentId, refundAmount, reason);
        return ResponseEntity.ok(payment);
    }
    
    @GetMapping("/user/{userId}")
    @Operation(summary = "Get user payments")
    public ResponseEntity<List<Payment>> getUserPayments(@PathVariable Long userId) {
        List<Payment> payments = paymentService.getUserPayments(userId);
        return ResponseEntity.ok(payments);
    }
    
    @GetMapping("/adoption-listing/{adoptionListingId}")
    @Operation(summary = "Get payments for an adoption listing")
    public ResponseEntity<List<Payment>> getAdoptionListingPayments(@PathVariable Long adoptionListingId) {
        List<Payment> payments = paymentService.getAdoptionListingPayments(adoptionListingId);
        return ResponseEntity.ok(payments);
    }
    
    @GetMapping("/statistics")
    @Operation(summary = "Get payment statistics")
    public ResponseEntity<PaymentService.PaymentStatistics> getPaymentStatistics() {
        PaymentService.PaymentStatistics stats = paymentService.getPaymentStatistics();
        return ResponseEntity.ok(stats);
    }
    
    @PostMapping("/cancel-pending")
    @Operation(summary = "Cancel pending payments (admin only)")
    public ResponseEntity<Void> cancelPendingPayments() {
        paymentService.cancelPendingPayments();
        return ResponseEntity.ok().build();
    }
}
