package com.petaverse.service;

import com.petaverse.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private JwtService jwtService;

    public void sendVerificationEmail(User user) {
        String token = jwtService.generateToken(user.getUsername());
        String verificationUrl = "http://localhost:3000/verify-email?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("PetaVerse - E-posta Doğrulama");
        message.setText("Merhaba " + user.getUsername() + ",\n\n" +
                "PetaVerse hesabınızı doğrulamak için aşağıdaki linke tıklayın:\n\n" +
                verificationUrl + "\n\n" +
                "Bu link 24 saat geçerlidir.\n\n" +
                "Teşekkürler,\n" +
                "PetaVerse Ekibi");

        mailSender.send(message);
    }

    public void sendPasswordResetEmail(User user, String resetToken) {
        String resetUrl = "http://localhost:3000/reset-password?token=" + resetToken;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("PetaVerse - Şifre Sıfırlama");
        message.setText("Merhaba " + user.getUsername() + ",\n\n" +
                "Şifrenizi sıfırlamak için aşağıdaki linke tıklayın:\n\n" +
                resetUrl + "\n\n" +
                "Bu link 1 saat geçerlidir.\n\n" +
                "Eğer bu isteği siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz.\n\n" +
                "Teşekkürler,\n" +
                "PetaVerse Ekibi");

        mailSender.send(message);
    }

    public void sendWelcomeEmail(User user) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("PetaVerse'e Hoş Geldiniz!");
        message.setText("Merhaba " + user.getUsername() + ",\n\n" +
                "PetaVerse ailesine hoş geldiniz! 🐾\n\n" +
                "Artık evcil hayvan sahiplendirme platformumuzun tüm özelliklerinden yararlanabilirsiniz:\n" +
                "• Evcil hayvan profilleri oluşturma\n" +
                "• Sahiplendirme ilanları verme\n" +
                "• Kayıp hayvan bildirimi\n" +
                "• Veteriner ve pet hizmetleri\n" +
                "• Topluluk forumu\n\n" +
                "Herhangi bir sorunuz olursa bizimle iletişime geçebilirsiniz.\n\n" +
                "Teşekkürler,\n" +
                "PetaVerse Ekibi");

        mailSender.send(message);
    }

    public void sendAdoptionNotification(User user, String petName) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("PetaVerse - Sahiplendirme Başvurusu");
        message.setText("Merhaba " + user.getUsername() + ",\n\n" +
                petName + " için yeni bir sahiplendirme başvurusu aldınız.\n\n" +
                "Başvuruyu incelemek için PetaVerse uygulamanıza giriş yapın.\n\n" +
                "Teşekkürler,\n" +
                "PetaVerse Ekibi");

        mailSender.send(message);
    }

    public void sendLostPetAlert(User user, String petName, String location) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("PetaVerse - Kayıp Hayvan Uyarısı");
        message.setText("Merhaba " + user.getUsername() + ",\n\n" +
                "Yakınınızda kayıp bir hayvan bildirildi:\n\n" +
                "Hayvan: " + petName + "\n" +
                "Konum: " + location + "\n\n" +
                "Detayları görmek için PetaVerse uygulamanıza giriş yapın.\n\n" +
                "Teşekkürler,\n" +
                "PetaVerse Ekibi");

        mailSender.send(message);
    }
    
    public void sendEmail(String to, String subject, String content) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(content);
        mailSender.send(message);
    }
} 