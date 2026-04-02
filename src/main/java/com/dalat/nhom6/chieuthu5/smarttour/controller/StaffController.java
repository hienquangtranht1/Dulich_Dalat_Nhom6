package com.dalat.nhom6.chieuthu5.smarttour.controller;

import com.dalat.nhom6.chieuthu5.smarttour.entity.*;
import com.dalat.nhom6.chieuthu5.smarttour.repository.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/staff")
public class StaffController {

    @Autowired
    private AgencyRepository agencyRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private OrderRepository orderRepository;

    private Agency getAgencyFromSession(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) return null;
        Integer userId = (Integer) session.getAttribute("USER_ID");
        if (userId == null) return null;
        return agencyRepository.findByUserId(userId).orElse(null);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMyAgency(HttpServletRequest request) {
        Agency agency = getAgencyFromSession(request);
        if (agency == null) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(Map.of(
            "agencyName", agency.getAgencyName(),
            "license", agency.getBusinessLicense(),
            "isApproved", agency.getIsApproved()
        ));
    }

    @GetMapping("/services")
    public ResponseEntity<?> getServices(HttpServletRequest request) {
        Agency agency = getAgencyFromSession(request);
        if (agency == null) return ResponseEntity.status(403).build();
        
        List<Map<String, Object>> result = serviceRepository.findByAgencyId(agency.getId()).stream()
            .map(s -> Map.<String, Object>of(
                "id", s.getId(),
                "serviceName", s.getServiceName(),
                "serviceType", s.getServiceType(),
                "salePrice", s.getSalePrice(),
                "isApproved", s.getIsApproved(),
                "imageUrl", s.getImageUrl() != null ? s.getImageUrl() : "https://via.placeholder.com/150"
            )).collect(Collectors.toList());
            
        return ResponseEntity.ok(result);
    }

    @PostMapping("/services")
    public ResponseEntity<?> createService(
            @RequestParam("name") String name,
            @RequestParam("type") String type,
            @RequestParam("price") BigDecimal price,
            @RequestParam("description") String description,
            @RequestParam(value = "maxPeople", required = false) Integer maxPeople,
            @RequestParam(value = "durationDays", required = false) Integer durationDays,
            @RequestParam(value = "transportation", required = false) String transportation,
            @RequestParam(value = "openingTime", required = false) String openingTime,
            @RequestParam(value = "closingTime", required = false) String closingTime,
            @RequestParam(value = "mapPoints", required = false) String mapPoints,
            @RequestParam(value = "image", required = false) org.springframework.web.multipart.MultipartFile image,
            HttpServletRequest request) {
            
        Agency agency = getAgencyFromSession(request);
        if (agency == null) return ResponseEntity.status(403).build();

        try {
            String filename = "https://images.unsplash.com/photo-1542314831-c6a4d27160c9"; // Default image
            if (image != null && !image.isEmpty()) {
                String uploadDir = "uploads/";
                java.nio.file.Path uploadPath = java.nio.file.Paths.get(uploadDir);
                if (!java.nio.file.Files.exists(uploadPath)) {
                    java.nio.file.Files.createDirectories(uploadPath);
                }
                String originalName = image.getOriginalFilename();
                String ext = originalName.contains(".") ? originalName.substring(originalName.lastIndexOf(".")) : ".jpg";
                String newFileName = System.currentTimeMillis() + ext;
                java.nio.file.Path filePath = uploadPath.resolve(newFileName);
                java.nio.file.Files.copy(image.getInputStream(), filePath, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
                filename = "/uploads/" + newFileName; // Đường dẫn web
            }

            Service svc = Service.builder()
                    .agency(agency)
                    .serviceName(name)
                    .serviceType(type)
                    .originalPrice(price)
                    .salePrice(price)
                    .description(description)
                    .maxPeople(maxPeople)
                    .durationDays(durationDays)
                    .transportation(transportation)
                    .openingTime(openingTime)
                    .closingTime(closingTime)
                    .mapPoints(mapPoints)
                    .imageUrl(filename)
                    .isApproved(false)
                    .isActive(true)
                    .build();

                    
            serviceRepository.save(svc);
            return ResponseEntity.ok(Map.of("status", "success", "message", "Đã tải lên kèm ảnh! Chờ duyệt."));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(e.getMessage() != null ? e.getMessage() : e.toString());
        }
    }

    @PostMapping("/upload-image")
    public ResponseEntity<?> uploadImage(@RequestParam("file") org.springframework.web.multipart.MultipartFile image) {
        try {
            if (image != null && !image.isEmpty()) {
                String uploadDir = "uploads/";
                java.nio.file.Path uploadPath = java.nio.file.Paths.get(uploadDir);
                if (!java.nio.file.Files.exists(uploadPath)) { java.nio.file.Files.createDirectories(uploadPath); }
                String originalName = image.getOriginalFilename();
                String ext = originalName.contains(".") ? originalName.substring(originalName.lastIndexOf(".")) : ".jpg";
                String newFileName = "point_" + System.currentTimeMillis() + ext;
                java.nio.file.Path filePath = uploadPath.resolve(newFileName);
                java.nio.file.Files.copy(image.getInputStream(), filePath, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
                return ResponseEntity.ok(Map.of("url", "/uploads/" + newFileName));
            }
            return ResponseEntity.badRequest().body(Map.of("error", "Không có file upload"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage() != null ? e.getMessage() : e.toString()));
        }
    }

    @GetMapping("/orders")
    @Transactional
    public ResponseEntity<?> getOrders(HttpServletRequest request) {
        Agency agency = getAgencyFromSession(request);
        if (agency == null) return ResponseEntity.status(403).build();
        
        List<Map<String, Object>> response = new ArrayList<>();
        
        for (Order o : orderRepository.findAll()) {
            boolean hasMyService = o.getOrderDetails().stream()
                    .anyMatch(d -> d.getService().getAgency().getId().equals(agency.getId()));
            
            if (hasMyService) {
                String serviceNames = o.getOrderDetails().stream()
                    .filter(d -> d.getService().getAgency().getId().equals(agency.getId()))
                    .map(d -> d.getService().getServiceName() + " (x" + d.getQuantity() + ")")
                    .collect(Collectors.joining(", "));
                    
                response.add(Map.of(
                    "id", o.getId(),
                    "customer", o.getUser().getUsername() + " (" + o.getUser().getEmail() + ")",
                    "services", serviceNames,
                    "totalAmount", o.getTotalAmount(),
                    "status", o.getStatus()
                ));
            }
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/orders/{id}/approve")
    public ResponseEntity<?> approveOrder(@PathVariable("id") Integer id) {
        Order order = orderRepository.findById(id).orElse(null);
        if (order != null) {
            order.setStatus("APPROVED");
            orderRepository.save(order);
            return ResponseEntity.ok(Map.of("status", "success"));
        }
        return ResponseEntity.badRequest().build();
    }

    @PostMapping("/locations")
    public ResponseEntity<?> createLocation(
            @RequestParam("name") String name,
            @RequestParam("coordinates") String coordinates) {
            
        Location loc = Location.builder()
                .name(name)
                .category("KHAC")
                .latitude(11.940)
                .longitude(108.450)
                .description("Cập nhật bởi Đại lý")
                .build();
                
        locationRepository.save(loc);
        return ResponseEntity.ok(Map.of("status", "success"));
    }

    @org.springframework.web.bind.annotation.ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleAllExceptions(Exception ex) {
        ex.printStackTrace();
        return ResponseEntity.status(500).body("Chi tiết lỗi từ Spring Boot: " + ex.getClass().getSimpleName() + " - " + ex.getMessage());
    }
}
