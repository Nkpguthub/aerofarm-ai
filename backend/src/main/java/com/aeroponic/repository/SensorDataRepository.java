package com.aeroponic.repository;

import com.aeroponic.model.SensorData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface SensorDataRepository extends JpaRepository<SensorData, Long> {
    Optional<SensorData> findTopByTowerIdOrderByRecordedAtDesc(String towerId);

    @Query("SELECT s FROM SensorData s WHERE s.towerId = :towerId ORDER BY s.recordedAt DESC LIMIT :limit")
    List<SensorData> findRecentByTowerId(String towerId, int limit);
}
