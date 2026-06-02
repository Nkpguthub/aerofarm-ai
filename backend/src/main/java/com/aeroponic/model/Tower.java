package com.aeroponic.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name = "towers")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Tower {
    @Id private String id;
    @Column(name = "farmer_id") private Long farmerId;
    private String name;
    private String location;
    @Enumerated(EnumType.STRING) private Status status;
    @Builder.Default @Column(name = "total_slots") private int totalSlots = 48;
    @Column(name = "created_at") private LocalDateTime createdAt;
    @PrePersist protected void onCreate() { createdAt = LocalDateTime.now(); }
    public enum Status { active, offline, maintenance }
}
