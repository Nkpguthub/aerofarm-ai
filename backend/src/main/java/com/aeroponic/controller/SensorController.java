package com.aeroponic.controller;

import com.aeroponic.model.SensorData;
import com.aeroponic.repository.SensorDataRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sensors")
@RequiredArgsConstructor
public class SensorController {

    private final SensorDataRepository sensorRepo;

    @GetMapping("/{towerId}/latest")
    public ResponseEntity<?> getLatest(@PathVariable String towerId) {
        return sensorRepo.findTopByTowerIdOrderByRecordedAtDesc(towerId)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{towerId}/history")
    public List<SensorData> getHistory(@PathVariable String towerId,
                                        @RequestParam(defaultValue = "24") int limit) {
        return sensorRepo.findRecentByTowerId(towerId, limit);
    }

    @PostMapping("/{towerId}")
    public ResponseEntity<SensorData> saveSensorData(@PathVariable String towerId,
                                                      @RequestBody SensorData data) {
        data.setTowerId(towerId);
        return ResponseEntity.ok(sensorRepo.save(data));
    }
}
