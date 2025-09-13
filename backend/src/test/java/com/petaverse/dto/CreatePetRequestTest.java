package com.petaverse.dto;

import com.petaverse.entity.PetStatus;
import com.petaverse.entity.PetType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("CreatePetRequest DTO Testleri")
class CreatePetRequestTest {

    private Validator validator;
    private CreatePetRequest createPetRequest;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
        createPetRequest = new CreatePetRequest();
    }

    @Test
    @DisplayName("Geçerli bir CreatePetRequest oluşturulabilmeli")
    void shouldCreateValidCreatePetRequest() {
        // Given
        createPetRequest.setName("Pamuk");
        createPetRequest.setType(PetType.CAT);
        createPetRequest.setBreed("Tekir");
        createPetRequest.setColor("Gri");
        createPetRequest.setBirthDate(LocalDate.of(2020, 5, 15));
        createPetRequest.setWeight(4.5);
        createPetRequest.setGender("FEMALE");
        createPetRequest.setSize("MEDIUM");
        createPetRequest.setDescription("Sevimli bir tekir kedi");
        createPetRequest.setOwnerId(1L);

        // When
        Set<ConstraintViolation<CreatePetRequest>> violations = validator.validate(createPetRequest);

        // Then
        assertTrue(violations.isEmpty(), "Validasyon hatası olmamalı");
    }

    @Test
    @DisplayName("İsim boş olamaz")
    void nameShouldNotBeBlank() {
        // Given
        createPetRequest.setName("");
        createPetRequest.setType(PetType.DOG);
        createPetRequest.setOwnerId(1L);

        // When
        Set<ConstraintViolation<CreatePetRequest>> violations = validator.validate(createPetRequest);

        // Then
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream()
                .anyMatch(v -> v.getPropertyPath().toString().equals("name") && 
                        v.getMessage().equals("Evcil hayvan adı boş olamaz")));
    }

    @Test
    @DisplayName("İsim 100 karakterden uzun olamaz")
    void nameShouldNotExceed100Characters() {
        // Given
        createPetRequest.setName("a".repeat(101));
        createPetRequest.setType(PetType.DOG);
        createPetRequest.setOwnerId(1L);

        // When
        Set<ConstraintViolation<CreatePetRequest>> violations = validator.validate(createPetRequest);

        // Then
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream()
                .anyMatch(v -> v.getPropertyPath().toString().equals("name") && 
                        v.getMessage().equals("Evcil hayvan adı en fazla 100 karakter olabilir")));
    }

    @Test
    @DisplayName("Pet türü null olamaz")
    void petTypeShouldNotBeNull() {
        // Given
        createPetRequest.setName("Pamuk");
        createPetRequest.setType(null);
        createPetRequest.setOwnerId(1L);

        // When
        Set<ConstraintViolation<CreatePetRequest>> violations = validator.validate(createPetRequest);

        // Then
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream()
                .anyMatch(v -> v.getPropertyPath().toString().equals("type") && 
                        v.getMessage().equals("Evcil hayvan türü seçilmelidir")));
    }

    @Test
    @DisplayName("Doğum tarihi gelecek tarih olamaz")
    void birthDateShouldNotBeInFuture() {
        // Given
        createPetRequest.setName("Pamuk");
        createPetRequest.setType(PetType.CAT);
        createPetRequest.setBirthDate(LocalDate.now().plusDays(1));
        createPetRequest.setOwnerId(1L);

        // When
        Set<ConstraintViolation<CreatePetRequest>> violations = validator.validate(createPetRequest);

        // Then
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream()
                .anyMatch(v -> v.getPropertyPath().toString().equals("birthDate") && 
                        v.getMessage().equals("Doğum tarihi geçmiş bir tarih olmalıdır")));
    }

    @Test
    @DisplayName("Kilo pozitif olmalı")
    void weightShouldBePositive() {
        // Given
        createPetRequest.setName("Pamuk");
        createPetRequest.setType(PetType.CAT);
        createPetRequest.setWeight(-1.0);
        createPetRequest.setOwnerId(1L);

        // When
        Set<ConstraintViolation<CreatePetRequest>> violations = validator.validate(createPetRequest);

        // Then
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream()
                .anyMatch(v -> v.getPropertyPath().toString().equals("weight") && 
                        v.getMessage().equals("Kilo pozitif bir değer olmalıdır")));
    }

    @Test
    @DisplayName("Owner ID null olamaz")
    void ownerIdShouldNotBeNull() {
        // Given
        createPetRequest.setName("Pamuk");
        createPetRequest.setType(PetType.CAT);
        createPetRequest.setOwnerId(null);

        // When
        Set<ConstraintViolation<CreatePetRequest>> violations = validator.validate(createPetRequest);

        // Then
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream()
                .anyMatch(v -> v.getPropertyPath().toString().equals("ownerId") && 
                        v.getMessage().equals("Sahip ID'si gereklidir")));
    }

    @Test
    @DisplayName("Default değerler doğru atanmalı")
    void shouldHaveCorrectDefaultValues() {
        // Given
        CreatePetRequest request = new CreatePetRequest();

        // Then
        assertEquals(PetStatus.ACTIVE, request.getStatus());
        assertFalse(request.isNeutered());
        assertFalse(request.isVaccinated());
        assertFalse(request.isMicrochipped());
    }

    @Test
    @DisplayName("Resim ve video URL'leri eklenebilmeli")
    void shouldHandleImageAndVideoUrls() {
        // Given
        List<String> imageUrls = List.of("image1.jpg", "image2.jpg");
        List<String> videoUrls = List.of("video1.mp4");

        // When
        createPetRequest.setImageUrls(imageUrls);
        createPetRequest.setVideoUrls(videoUrls);

        // Then
        assertEquals(imageUrls, createPetRequest.getImageUrls());
        assertEquals(videoUrls, createPetRequest.getVideoUrls());
    }

    @Test
    @DisplayName("ToString method'u doğru çalışmalı")
    void toStringShouldWorkCorrectly() {
        // Given
        createPetRequest.setName("Pamuk");
        createPetRequest.setType(PetType.CAT);
        createPetRequest.setOwnerId(1L);

        // When
        String result = createPetRequest.toString();

        // Then
        assertTrue(result.contains("name='Pamuk'"));
        assertTrue(result.contains("type=CAT"));
        assertTrue(result.contains("ownerId=1"));
    }

    @Test
    @DisplayName("Tüm getter ve setter'lar çalışmalı")
    void allGettersAndSettersShouldWork() {
        // Given
        String name = "Pamuk";
        PetType type = PetType.CAT;
        String breed = "Tekir";
        String color = "Gri";
        LocalDate birthDate = LocalDate.of(2020, 5, 15);
        Double weight = 4.5;
        String gender = "FEMALE";
        String size = "MEDIUM";
        String description = "Sevimli bir tekir kedi";
        String mainImageUrl = "https://example.com/image.jpg";
        PetStatus status = PetStatus.ACTIVE;
        boolean isNeutered = true;
        boolean isVaccinated = true;
        String healthNotes = "Sağlıklı";
        String behaviorNotes = "Sakin";
        String specialNeeds = "Yok";
        boolean isMicrochipped = true;
        String microchipNumber = "123456789";
        Long ownerId = 1L;

        // When
        createPetRequest.setName(name);
        createPetRequest.setType(type);
        createPetRequest.setBreed(breed);
        createPetRequest.setColor(color);
        createPetRequest.setBirthDate(birthDate);
        createPetRequest.setWeight(weight);
        createPetRequest.setGender(gender);
        createPetRequest.setSize(size);
        createPetRequest.setDescription(description);
        createPetRequest.setMainImageUrl(mainImageUrl);
        createPetRequest.setStatus(status);
        createPetRequest.setNeutered(isNeutered);
        createPetRequest.setVaccinated(isVaccinated);
        createPetRequest.setHealthNotes(healthNotes);
        createPetRequest.setBehaviorNotes(behaviorNotes);
        createPetRequest.setSpecialNeeds(specialNeeds);
        createPetRequest.setMicrochipped(isMicrochipped);
        createPetRequest.setMicrochipNumber(microchipNumber);
        createPetRequest.setOwnerId(ownerId);

        // Then
        assertEquals(name, createPetRequest.getName());
        assertEquals(type, createPetRequest.getType());
        assertEquals(breed, createPetRequest.getBreed());
        assertEquals(color, createPetRequest.getColor());
        assertEquals(birthDate, createPetRequest.getBirthDate());
        assertEquals(weight, createPetRequest.getWeight());
        assertEquals(gender, createPetRequest.getGender());
        assertEquals(size, createPetRequest.getSize());
        assertEquals(description, createPetRequest.getDescription());
        assertEquals(mainImageUrl, createPetRequest.getMainImageUrl());
        assertEquals(status, createPetRequest.getStatus());
        assertEquals(isNeutered, createPetRequest.isNeutered());
        assertEquals(isVaccinated, createPetRequest.isVaccinated());
        assertEquals(healthNotes, createPetRequest.getHealthNotes());
        assertEquals(behaviorNotes, createPetRequest.getBehaviorNotes());
        assertEquals(specialNeeds, createPetRequest.getSpecialNeeds());
        assertEquals(isMicrochipped, createPetRequest.isMicrochipped());
        assertEquals(microchipNumber, createPetRequest.getMicrochipNumber());
        assertEquals(ownerId, createPetRequest.getOwnerId());
    }
}
