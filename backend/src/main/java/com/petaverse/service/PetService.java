package com.petaverse.service;

import com.petaverse.dto.PetDto;
import com.petaverse.dto.CreatePetRequest;
import com.petaverse.dto.UpdatePetRequest;
import com.petaverse.entity.Pet;
import com.petaverse.entity.PetStatus;
import com.petaverse.entity.User;
import com.petaverse.repository.PetRepository;
import com.petaverse.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.ArrayList;
import com.petaverse.dto.UserDto;
import java.util.HashMap;

@Service
@Transactional
public class PetService {

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileUploadService fileUploadService;

    public Page<PetDto> getAllPets(String type, String breed, String city, String status, Pageable pageable) {
        Page<Pet> pets;
        
        if (type != null && !type.isEmpty()) {
            pets = petRepository.findByType(com.petaverse.entity.PetType.valueOf(type), pageable);
        } else if (breed != null && !breed.isEmpty()) {
            pets = petRepository.findByBreedContainingIgnoreCase(breed, pageable);
        } else if (city != null && !city.isEmpty()) {
            pets = petRepository.findByOwnerCityContainingIgnoreCase(city, pageable);
        } else if (status != null && !status.isEmpty()) {
            pets = petRepository.findByStatus(PetStatus.valueOf(status), pageable);
        } else {
            pets = petRepository.findAll(pageable);
        }
        
        return pets.map(this::convertToDto);
    }

    public PetDto getPetById(Long id) {
        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Evcil hayvan bulunamadı"));
        return convertToDto(pet);
    }

    public List<PetDto> getPetsByOwner(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
        
        List<Pet> pets = petRepository.findByOwnerId(user.getId());
        return pets.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    public PetDto createPet(CreatePetRequest request, Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        Pet pet = new Pet();
        pet.setName(request.getName());
        pet.setType(request.getType());
        pet.setBreed(request.getBreed());
        pet.setColor(request.getColor());
        pet.setBirthDate(request.getBirthDate());
        pet.setWeight(request.getWeight());
        pet.setGender(request.getGender());
        pet.setSize(request.getSize());
        pet.setDescription(request.getDescription());
        pet.setNeutered(request.isNeutered());
        pet.setVaccinated(request.isVaccinated());
        pet.setHealthNotes(request.getHealthNotes());
        pet.setBehaviorNotes(request.getBehaviorNotes());
        pet.setSpecialNeeds(request.getSpecialNeeds());
        pet.setMicrochipped(request.isMicrochipped());
        pet.setMicrochipNumber(request.getMicrochipNumber());
        pet.setOwner(user);
        pet.setStatus(PetStatus.ACTIVE);
        pet.setCreatedAt(LocalDateTime.now());
        pet.setUpdatedAt(LocalDateTime.now());

        // Yaş hesaplama
        if (request.getBirthDate() != null) {
            int age = Period.between(request.getBirthDate(), LocalDate.now()).getYears();
            pet.setAge(age);
        }

        Pet savedPet = petRepository.save(pet);
        return convertToDto(savedPet);
    }

    public PetDto updatePet(Long id, UpdatePetRequest request, Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Evcil hayvan bulunamadı"));

        // Sadece sahibi güncelleyebilir
        if (!pet.getOwner().getId().equals(user.getId())) {
            throw new RuntimeException("Bu evcil hayvanı güncelleme yetkiniz yok");
        }

        // Güncellenebilir alanları güncelle
        if (request.getName() != null) pet.setName(request.getName());
        if (request.getType() != null) pet.setType(request.getType());
        if (request.getBreed() != null) pet.setBreed(request.getBreed());
        if (request.getColor() != null) pet.setColor(request.getColor());
        if (request.getBirthDate() != null) {
            pet.setBirthDate(request.getBirthDate());
            // Yaş hesaplama
            int age = Period.between(request.getBirthDate(), LocalDate.now()).getYears();
            pet.setAge(age);
        }
        if (request.getWeight() != null) pet.setWeight(request.getWeight());
        if (request.getGender() != null) pet.setGender(request.getGender());
        if (request.getSize() != null) pet.setSize(request.getSize());
        if (request.getDescription() != null) pet.setDescription(request.getDescription());
        if (request.getIsNeutered() != null) pet.setNeutered(request.getIsNeutered());
        if (request.getIsVaccinated() != null) pet.setVaccinated(request.getIsVaccinated());
        if (request.getHealthNotes() != null) pet.setHealthNotes(request.getHealthNotes());
        if (request.getBehaviorNotes() != null) pet.setBehaviorNotes(request.getBehaviorNotes());
        if (request.getSpecialNeeds() != null) pet.setSpecialNeeds(request.getSpecialNeeds());
        if (request.getIsMicrochipped() != null) pet.setMicrochipped(request.getIsMicrochipped());
        if (request.getMicrochipNumber() != null) pet.setMicrochipNumber(request.getMicrochipNumber());

        pet.setUpdatedAt(LocalDateTime.now());

        Pet updatedPet = petRepository.save(pet);
        return convertToDto(updatedPet);
    }

    public void deletePet(Long id, Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Evcil hayvan bulunamadı"));

        // Sadece sahibi silebilir
        if (!pet.getOwner().getId().equals(user.getId())) {
            throw new RuntimeException("Bu evcil hayvanı silme yetkiniz yok");
        }

        petRepository.delete(pet);
    }

    public String uploadPetImage(Long id, MultipartFile file, Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Evcil hayvan bulunamadı"));

        // Sadece sahibi resim yükleyebilir
        if (!pet.getOwner().getId().equals(user.getId())) {
            throw new RuntimeException("Bu evcil hayvana resim yükleme yetkiniz yok");
        }

        String imageUrl = fileUploadService.uploadFile(file, "pets/" + id + "/images");
        
        // Ana resim olarak ayarla
        pet.setMainImageUrl(imageUrl);
        petRepository.save(pet);

        return imageUrl;
    }

    public void deletePetImage(Long id, int imageIndex, Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Evcil hayvan bulunamadı"));

        // Sadece sahibi resim silebilir
        if (!pet.getOwner().getId().equals(user.getId())) {
            throw new RuntimeException("Bu evcil hayvandan resim silme yetkiniz yok");
        }

        // TODO: Resim silme işlemi
        petRepository.save(pet);
    }

    public String uploadPetVideo(Long id, MultipartFile file, Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Evcil hayvan bulunamadı"));

        // Sadece sahibi video yükleyebilir
        if (!pet.getOwner().getId().equals(user.getId())) {
            throw new RuntimeException("Bu evcil hayvana video yükleme yetkiniz yok");
        }

        String videoUrl = fileUploadService.uploadFile(file, "pets/" + id + "/videos");
        
        // Video URL'ini listeye ekle
        if (pet.getVideoUrls() == null) {
            pet.setVideoUrls(new ArrayList<>());
        }
        pet.getVideoUrls().add(videoUrl);
        petRepository.save(pet);

        return videoUrl;
    }

    public void deletePetVideo(Long id, int videoIndex, Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Evcil hayvan bulunamadı"));

        // Sadece sahibi video silebilir
        if (!pet.getOwner().getId().equals(user.getId())) {
            throw new RuntimeException("Bu evcil hayvandan video silme yetkiniz yok");
        }

        // TODO: Video silme işlemi
        petRepository.save(pet);
    }

    public List<PetDto> searchPets(String name, String type, String breed, String gender, 
                                   String size, String city, Integer minAge, Integer maxAge, 
                                   Boolean isNeutered, Boolean isVaccinated) {
        List<Pet> pets = petRepository.findAll();
        
        return pets.stream()
                .filter(pet -> name == null || pet.getName().toLowerCase().contains(name.toLowerCase()))
                .filter(pet -> type == null || pet.getType().name().equals(type))
                .filter(pet -> breed == null || pet.getBreed().toLowerCase().contains(breed.toLowerCase()))
                .filter(pet -> gender == null || pet.getGender().equals(gender))
                .filter(pet -> size == null || pet.getSize().equals(size))
                .filter(pet -> city == null || pet.getOwner().getCity().toLowerCase().contains(city.toLowerCase()))
                .filter(pet -> minAge == null || pet.getAge() >= minAge)
                .filter(pet -> maxAge == null || pet.getAge() <= maxAge)
                .filter(pet -> isNeutered == null || pet.isNeutered() == isNeutered)
                .filter(pet -> isVaccinated == null || pet.isVaccinated() == isVaccinated)
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<String> getBreedsByType(String type) {
        return petRepository.findDistinctBreedsByType(com.petaverse.entity.PetType.valueOf(type));
    }

    public Object getPetStats() {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("totalPets", petRepository.count());
        stats.put("activePets", petRepository.countByStatus(PetStatus.ACTIVE));
        stats.put("adoptedPets", petRepository.countByStatus(PetStatus.ADOPTED));
        stats.put("petsByType", petRepository.countByType());
        
        return stats;
    }

    public PetDto updatePetStatus(Long id, String status, Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Evcil hayvan bulunamadı"));

        // Sadece sahibi durum güncelleyebilir
        if (!pet.getOwner().getId().equals(user.getId())) {
            throw new RuntimeException("Bu evcil hayvanın durumunu güncelleme yetkiniz yok");
        }

        pet.setStatus(PetStatus.valueOf(status));
        pet.setUpdatedAt(LocalDateTime.now());

        Pet updatedPet = petRepository.save(pet);
        return convertToDto(updatedPet);
    }

    private PetDto convertToDto(Pet pet) {
        PetDto dto = new PetDto();
        dto.setId(pet.getId());
        dto.setName(pet.getName());
        dto.setType(pet.getType());
        dto.setBreed(pet.getBreed());
        dto.setColor(pet.getColor());
        dto.setBirthDate(pet.getBirthDate());
        dto.setAge(pet.getAge());
        dto.setWeight(pet.getWeight());
        dto.setGender(pet.getGender());
        dto.setSize(pet.getSize());
        dto.setDescription(pet.getDescription());
        dto.setMainImageUrl(pet.getMainImageUrl());
        dto.setImageUrls(pet.getImageUrls());
        dto.setVideoUrls(pet.getVideoUrls());
        dto.setStatus(pet.getStatus());
        dto.setNeutered(pet.isNeutered());
        dto.setVaccinated(pet.isVaccinated());
        dto.setHealthNotes(pet.getHealthNotes());
        dto.setBehaviorNotes(pet.getBehaviorNotes());
        dto.setSpecialNeeds(pet.getSpecialNeeds());
        dto.setMicrochipped(pet.isMicrochipped());
        dto.setMicrochipNumber(pet.getMicrochipNumber());
        dto.setCreatedAt(pet.getCreatedAt());
        dto.setUpdatedAt(pet.getUpdatedAt());
        
        // Owner bilgilerini de ekle
        if (pet.getOwner() != null) {
            UserDto ownerDto = new UserDto();
            ownerDto.setId(pet.getOwner().getId());
            ownerDto.setUsername(pet.getOwner().getUsername());
            ownerDto.setFirstName(pet.getOwner().getFirstName());
            ownerDto.setLastName(pet.getOwner().getLastName());
            ownerDto.setEmail(pet.getOwner().getEmail());
            ownerDto.setCity(pet.getOwner().getCity());
            dto.setOwner(ownerDto);
        }
        
        return dto;
    }
} 