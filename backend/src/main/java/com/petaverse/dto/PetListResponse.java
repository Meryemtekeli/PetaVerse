package com.petaverse.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

@Schema(description = "Evcil hayvan listesi response DTO'su")
public class PetListResponse {
    
    @Schema(description = "Evcil hayvan listesi")
    @JsonProperty("content")
    private List<PetDto> content;
    
    @Schema(description = "Toplam eleman sayısı")
    @JsonProperty("totalElements")
    private long totalElements;
    
    @Schema(description = "Toplam sayfa sayısı")
    @JsonProperty("totalPages")
    private int totalPages;
    
    @Schema(description = "Sayfa boyutu")
    @JsonProperty("size")
    private int size;
    
    @Schema(description = "Mevcut sayfa numarası")
    @JsonProperty("number")
    private int number;
    
    @Schema(description = "İlk sayfa mı?")
    @JsonProperty("first")
    private boolean first;
    
    @Schema(description = "Son sayfa mı?")
    @JsonProperty("last")
    private boolean last;
    
    @Schema(description = "Toplam eleman sayısı (sayfa bazında)")
    @JsonProperty("numberOfElements")
    private int numberOfElements;
    
    public PetListResponse() {}
    
    public PetListResponse(List<PetDto> content, long totalElements, int totalPages, int size, int number) {
        this.content = content;
        this.totalElements = totalElements;
        this.totalPages = totalPages;
        this.size = size;
        this.number = number;
        this.first = number == 0;
        this.last = number == totalPages - 1 || totalPages == 0;
        this.numberOfElements = content.size();
    }
    
    // Getters and Setters
    public List<PetDto> getContent() {
        return content;
    }
    
    public void setContent(List<PetDto> content) {
        this.content = content;
    }
    
    public long getTotalElements() {
        return totalElements;
    }
    
    public void setTotalElements(long totalElements) {
        this.totalElements = totalElements;
    }
    
    public int getTotalPages() {
        return totalPages;
    }
    
    public void setTotalPages(int totalPages) {
        this.totalPages = totalPages;
    }
    
    public int getSize() {
        return size;
    }
    
    public void setSize(int size) {
        this.size = size;
    }
    
    public int getNumber() {
        return number;
    }
    
    public void setNumber(int number) {
        this.number = number;
    }
    
    public boolean isFirst() {
        return first;
    }
    
    public void setFirst(boolean first) {
        this.first = first;
    }
    
    public boolean isLast() {
        return last;
    }
    
    public void setLast(boolean last) {
        this.last = last;
    }
    
    public int getNumberOfElements() {
        return numberOfElements;
    }
    
    public void setNumberOfElements(int numberOfElements) {
        this.numberOfElements = numberOfElements;
    }
    
    @Override
    public String toString() {
        return "PetListResponse{" +
                "content=" + content +
                ", totalElements=" + totalElements +
                ", totalPages=" + totalPages +
                ", size=" + size +
                ", number=" + number +
                ", first=" + first +
                ", last=" + last +
                ", numberOfElements=" + numberOfElements +
                '}';
    }
}
