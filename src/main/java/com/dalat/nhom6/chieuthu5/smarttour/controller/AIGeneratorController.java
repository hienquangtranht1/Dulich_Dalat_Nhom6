package com.dalat.nhom6.chieuthu5.smarttour.controller;

import com.dalat.nhom6.chieuthu5.smarttour.entity.Location;
import com.dalat.nhom6.chieuthu5.smarttour.entity.Service;
import com.dalat.nhom6.chieuthu5.smarttour.repository.LocationRepository;
import com.dalat.nhom6.chieuthu5.smarttour.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user/ai")
public class AIGeneratorController {

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    @PostMapping("/generate")
    public ResponseEntity<?> generateItinerary(
            @RequestParam("budget") String budget,
            @RequestParam("days") Integer days,
            @RequestParam("transport") String transport,
            @RequestParam("preferences") String preferences) {
            
        // "Học" từ dữ liệu mới: Lấy các địa điểm và dịch vụ có sẵn trong DB
        List<Location> allLocations = locationRepository.findAll();
        List<Service> allServices = serviceRepository.findAll().stream()
                .filter(s -> s.getIsApproved() != null && s.getIsApproved())
                .collect(Collectors.toList());

        // Nếu có Gemini thật, ta sẽ prompt: "Tạo lịch trình dựa trên danh sách địa điểm này: " + allLocations
        // Ở đây mô phỏng AI (Mock AI): Xây dựng chuỗi JSON trả về
        List<Map<String, Object>> itinerary = new ArrayList<>();
        
        Random rand = new Random();
        for (int i = 1; i <= days; i++) {
            // Lấy ramdom 2 địa điểm và 1 service cho mỗi ngày
            String loc1 = allLocations.isEmpty() ? "Check-in Quảng Trường Lâm Viên" : allLocations.get(rand.nextInt(allLocations.size())).getName();
            String loc2 = allLocations.size() > 1 ? allLocations.get(rand.nextInt(allLocations.size())).getName() : "Dạo Quanh Hồ Xuân Hương";
            String svcName = allServices.isEmpty() ? "Ăn Quán Lẩu Rau / Gà nướng" : allServices.get(rand.nextInt(allServices.size())).getServiceName();
            
            itinerary.add(Map.of(
                "title", "Ngày " + i + ": Khám phá " + preferences.split(",")[0],
                "morning", "Sáng: Di chuyển bằng " + transport + " đến " + loc1,
                "afternoon", "Trưa: " + svcName,
                "evening", "Tối: " + loc2 + " và nghỉ ngơi."
            ));
        }

        return ResponseEntity.ok(Map.of(
            "status", "success",
            "message", "AI đã phân tích dựa trên " + allLocations.size() + " địa điểm mới được cung cấp!",
            "itinerary", itinerary
        ));
    }
}
