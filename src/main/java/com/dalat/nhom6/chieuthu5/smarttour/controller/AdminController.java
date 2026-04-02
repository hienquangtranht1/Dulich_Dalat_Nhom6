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
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AgencyRepository agencyRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SystemConfigRepository configRepository;

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    private boolean isAdmin(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) return false;
        return "ADMIN".equals(session.getAttribute("USER_ROLE"));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard(HttpServletRequest request) {
        if (!isAdmin(request)) return ResponseEntity.status(403).build();

        long totalUsers = userRepository.count();
        long totalAgencies = agencyRepository.count();
        long totalOrders = orderRepository.count();
        
        // Thống kê Doanh thu tất cả dịch vụ (cho Admin)
        BigDecimal revenue = orderRepository.findAll().stream()
                .map(Order::getTotalAmount)
                .filter(java.util.Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Chiết khấu hoa hồng siêu tính nhẩm (10%)
        BigDecimal commission = revenue.multiply(new BigDecimal("0.10"));

        return ResponseEntity.ok(Map.of(
            "totalUsers", totalUsers,
            "totalAgencies", totalAgencies,
            "totalOrders", totalOrders,
            "revenue", revenue,
            "commission", commission
        ));
    }

    @GetMapping("/agencies")
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public ResponseEntity<?> getAgencies(HttpServletRequest request) {
        if (!isAdmin(request)) return ResponseEntity.status(403).build();
        // Trả về DTO thay vì raw entity để tránh lỗi Jackson serialize lazy-loaded User
        List<Map<String, Object>> result = agencyRepository.findAll().stream()
            .map(a -> {
                Map<String, Object> dto = new java.util.HashMap<>();
                dto.put("id", a.getId());
                dto.put("agencyName", a.getAgencyName());
                dto.put("businessLicense", a.getBusinessLicense() != null ? a.getBusinessLicense() : "");
                dto.put("address", a.getAddress() != null ? a.getAddress() : "");
                dto.put("isApproved", a.getIsApproved() != null ? a.getIsApproved() : false);
                dto.put("staffUsername", a.getUser() != null ? a.getUser().getUsername() : "");
                dto.put("staffEmail", a.getUser() != null ? a.getUser().getEmail() : "");
                return dto;
            }).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @PostMapping("/agencies/{id}/approve")
    public ResponseEntity<?> approveAgency(@PathVariable("id") Integer id, HttpServletRequest request) {
        if (!isAdmin(request)) return ResponseEntity.status(403).build();
        Agency a = agencyRepository.findById(id).orElse(null);
        if (a != null) {
            a.setIsApproved(true);
            agencyRepository.save(a);
            return ResponseEntity.ok(Map.of("status", "success"));
        }
        return ResponseEntity.badRequest().build();
    }

    @GetMapping("/services")
    public ResponseEntity<?> getServices(HttpServletRequest request) {
        if (!isAdmin(request)) return ResponseEntity.status(403).build();
        List<Map<String, Object>> result = serviceRepository.findAll().stream().map(s -> {
            Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", s.getId());
            map.put("name", s.getServiceName());
            map.put("agencyName", s.getAgency() != null ? s.getAgency().getAgencyName() : "N/A");
            map.put("type", s.getServiceType());
            map.put("price", s.getSalePrice() != null ? s.getSalePrice() : s.getOriginalPrice());
            map.put("isApproved", s.getIsApproved() != null ? s.getIsApproved() : false);
            map.put("imageUrl", s.getImageUrl() != null ? s.getImageUrl() : "https://via.placeholder.com/150");
            
            if ("TOUR".equals(s.getServiceType())) {
                map.put("maxPeople", s.getMaxPeople());
                map.put("durationDays", s.getDurationDays());
                map.put("transportation", s.getTransportation());
            } else {
                map.put("openingTime", s.getOpeningTime());
                map.put("closingTime", s.getClosingTime());
            }
            map.put("mapPoints", s.getMapPoints());
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @PostMapping("/services/{id}/approve")
    public ResponseEntity<?> approveService(@PathVariable("id") Integer id, HttpServletRequest request) {
        if (!isAdmin(request)) return ResponseEntity.status(403).build();
        Service s = serviceRepository.findById(id).orElse(null);
        if (s != null) {
            s.setIsApproved(true);
            serviceRepository.save(s);
            return ResponseEntity.ok(Map.of("status", "success"));
        }
        return ResponseEntity.badRequest().build();
    }

    /**
     * Xóa Agency theo thứ tự đảm bảo không vi phạm FK:
     * OrderDetail -> Service -> Agency
     */
    @PostMapping("/agencies/{id}/reject")
    @Transactional
    public ResponseEntity<?> rejectAgency(@PathVariable("id") Integer id, HttpServletRequest request) {
        if (!isAdmin(request)) return ResponseEntity.status(403).build();
        try {
            List<Service> services = serviceRepository.findByAgencyId(id);
            // B1: Xóa OrderDetail của từng service
            for (Service svc : services) {
                orderDetailRepository.deleteByServiceId(svc.getId());
            }
            // B2: Xóa tất cả Service (không có .flush() – để @Transactional tự commit)
            serviceRepository.deleteAllInBatch(services);
            // B3: Xóa Agency
            agencyRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("status", "success"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/services/{id}/reject")
    @Transactional
    public ResponseEntity<?> rejectService(@PathVariable("id") Integer id, HttpServletRequest request) {
        if (!isAdmin(request)) return ResponseEntity.status(403).build();
        try {
            // B1: Xóa OrderDetail liên kết trước (không .flush() – để @Transactional tự commit)
            orderDetailRepository.deleteByServiceId(id);
            // B2: Xóa Service – dùng deleteById sẽ tự flush + commit khi method kết thúc
            serviceRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("status", "success"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/configs")
    public ResponseEntity<?> getConfigs(HttpServletRequest request) {
        if (!isAdmin(request)) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(configRepository.findAll());
    }

    @PostMapping("/configs")
    public ResponseEntity<?> saveConfig(
            @RequestParam("key") String key,
            @RequestParam("value") String value,
            HttpServletRequest request) {
        if (!isAdmin(request)) return ResponseEntity.status(403).build();
        
        SystemConfig conf = configRepository.findByConfigKey(key).orElse(
            SystemConfig.builder().configKey(key).build()
        );
        conf.setConfigValue(value);
        conf.setDescription("Updated by Admin");
        configRepository.save(conf);
        
        return ResponseEntity.ok(Map.of("status", "success"));
    }
}
