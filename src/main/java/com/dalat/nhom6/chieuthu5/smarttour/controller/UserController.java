package com.dalat.nhom6.chieuthu5.smarttour.controller;

import com.dalat.nhom6.chieuthu5.smarttour.entity.*;
import com.dalat.nhom6.chieuthu5.smarttour.repository.OrderRepository;
import com.dalat.nhom6.chieuthu5.smarttour.repository.ServiceRepository;
import com.dalat.nhom6.chieuthu5.smarttour.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    private User getUserFromSession(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null && session.getAttribute("USER_ID") != null) {
            Integer userId = (Integer) session.getAttribute("USER_ID");
            return userRepository.findById(userId).orElse(null);
        }
        return null;
    }

    // Lấy danh sách Dịch Vụ đã được Admin duyệt
    @GetMapping("/services")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getApprovedServices() {
        List<Service> approvedServices = serviceRepository.findAll().stream()
                .filter(s -> s.getIsApproved() != null && s.getIsApproved() && s.getIsActive() != null && s.getIsActive())
                .collect(Collectors.toList());

        List<Map<String, Object>> result = approvedServices.stream().map(s -> {
            Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", s.getId());
            map.put("name", s.getServiceName());
            map.put("type", s.getServiceType());
            map.put("price", s.getSalePrice());
            map.put("description", s.getDescription() != null ? s.getDescription() : "");
            map.put("imageUrl", s.getImageUrl() != null ? s.getImageUrl() : "https://via.placeholder.com/200");
            map.put("agencyName", s.getAgency().getAgencyName());
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

    // Đặt vòng lặp Order 1 Dịch vụ
    @PostMapping("/book/{serviceId}")
    @Transactional
    public ResponseEntity<?> bookSingleService(@PathVariable("serviceId") Integer serviceId, HttpServletRequest request) {
        User user = getUserFromSession(request);
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Vui lòng đăng nhập trước!"));
        }

        Service svc = serviceRepository.findById(serviceId).orElse(null);
        if (svc == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Dịch vụ không tồn tại"));
        }

        Order order = Order.builder()
                .user(user)
                .totalAmount(svc.getSalePrice())
                .status("PENDING")
                .build();
        
        OrderDetail detail = OrderDetail.builder()
                .order(order)
                .service(svc)
                .quantity(1)
                .actualPrice(svc.getSalePrice())
                .build();
                
        order.setOrderDetails(List.of(detail));
        
        orderRepository.save(order);

        return ResponseEntity.ok(Map.of("status", "success", "message", "Đã đặt thành công chờ Đại lý duyệt!"));
    }

    // Lấy danh sách các Đơn đặt của user hiện tại (Để chia tiền/thanh toán hóa đơn)
    @GetMapping("/orders")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getMyOrders(HttpServletRequest request) {
        User user = getUserFromSession(request);
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Vui lòng đăng nhập trước!"));
        }

        List<Order> orders = orderRepository.findByUserId(user.getId());
        
        List<Map<String, Object>> result = orders.stream().map(o -> {
            String serviceNames = o.getOrderDetails().stream()
                    .map(d -> d.getService().getServiceName() + " (x" + d.getQuantity() + ")")
                    .collect(Collectors.joining(", "));
            
            return Map.<String, Object>of(
                "id", o.getId(),
                "services", serviceNames,
                "totalAmount", o.getTotalAmount(),
                "status", o.getStatus(),
                "orderDate", o.getOrderDate() != null ? o.getOrderDate().toString() : ""
            );
        }).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleAllExceptions(Exception ex) {
        ex.printStackTrace();
        return ResponseEntity.status(500).body("Chi tiết lỗi từ Spring Boot: " + ex.getClass().getSimpleName() + " - " + ex.getMessage());
    }
}
