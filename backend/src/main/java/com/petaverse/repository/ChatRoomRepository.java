package com.petaverse.repository;

import com.petaverse.entity.ChatRoom;
import com.petaverse.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    
    @Query("SELECT cr FROM ChatRoom cr WHERE " +
           "(cr.owner = :user1 AND cr.interestedUser = :user2) OR " +
           "(cr.owner = :user2 AND cr.interestedUser = :user1)")
    Optional<ChatRoom> findByUsers(@Param("user1") User user1, @Param("user2") User user2);
    
    @Query("SELECT cr FROM ChatRoom cr WHERE cr.adoptionListing.id = :adoptionListingId " +
           "AND ((cr.owner.id = :userId) OR (cr.interestedUser.id = :userId))")
    Optional<ChatRoom> findByAdoptionListingAndUser(@Param("adoptionListingId") Long adoptionListingId, 
                                                   @Param("userId") Long userId);
    
    @Query("SELECT cr FROM ChatRoom cr WHERE " +
           "(cr.owner.id = :userId OR cr.interestedUser.id = :userId) " +
           "AND cr.isActive = true " +
           "ORDER BY cr.lastMessageTime DESC NULLS LAST, cr.createdAt DESC")
    List<ChatRoom> findByUserIdOrderByLastMessage(@Param("userId") Long userId);
    
    @Query("SELECT cr FROM ChatRoom cr WHERE cr.owner.id = :userId OR cr.interestedUser.id = :userId")
    List<ChatRoom> findByUserId(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(cr) FROM ChatRoom cr WHERE " +
           "(cr.owner.id = :userId OR cr.interestedUser.id = :userId) " +
           "AND cr.isActive = true")
    long countActiveChatRoomsByUserId(@Param("userId") Long userId);
}
