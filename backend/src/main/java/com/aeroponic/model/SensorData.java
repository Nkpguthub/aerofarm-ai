package com.aeroponic.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity @Table(name = "sensor_data")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class SensorData {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(name = "tower_id") private String towerId;
    private BigDecimal ph;
    private BigDecimal temperature;
    private BigDecimal humidity;
    @Column(name = "water_level") private BigDecimal waterLevel;
    private BigDecimal ec;
    @Column(name = "light_intensity") private Integer lightIntensity;
    @Column(name = "pump_status") private Boolean pumpStatus;
    @Column(name = "recorded_at") private LocalDateTime recordedAt;
    @PrePersist protected void onCreate() { recordedAt = LocalDateTime.now(); }
}
