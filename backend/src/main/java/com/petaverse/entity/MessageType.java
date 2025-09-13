package com.petaverse.entity;

public enum MessageType {
    TEXT,                   // Normal metin mesajı
    CHAT,                   // Normal sohbet mesajı
    ADOPTION_APPLICATION,   // Sahiplendirme başvurusu
    ADOPTION_STATUS_UPDATE, // Sahiplendirme durum güncellemesi
    LOST_PET_ALERT,        // Kayıp evcil hayvan uyarısı
    REMINDER,              // Hatırlatma
    SYSTEM_NOTIFICATION,   // Sistem bildirimi
    VET_APPOINTMENT,       // Veteriner randevusu
    EMERGENCY_ALERT        // Acil durum uyarısı
} 