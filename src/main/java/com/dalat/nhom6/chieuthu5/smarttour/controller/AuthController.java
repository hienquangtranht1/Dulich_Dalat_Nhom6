package com.dalat.nhom6.chieuthu5.smarttour.controller;

import com.dalat.nhom6.chieuthu5.smarttour.entity.Role;
import com.dalat.nhom6.chieuthu5.smarttour.entity.User;
import com.dalat.nhom6.chieuthu5.smarttour.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam("username") String username, @RequestParam("password") String password, HttpServletRequest request) {
        username = username.trim();
        password = password.trim();
        System.out.println("==> AI ĐÓ ĐANG CỐ ĐĂNG NHẬP: [" + username + "] / [" + password + "]");

        Optional<User> userOpt = userRepository.findByUsername(username);
        
        if (userOpt.isPresent() && userOpt.get().getPassword().equals(password)) {
            User user = userOpt.get();
            
            if (user.getIsLocked() != null && user.getIsLocked()) {
                return ResponseEntity.status(403).body(Map.of("status", "error", "message", "Tài khoản đã bị khóa!"));
            }

            // Lưu Session thủ công
            HttpSession session = request.getSession(true);
            session.setAttribute("USER_ID", user.getId());
            session.setAttribute("USER_ROLE", user.getRole().name());

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("status", "success");
            responseBody.put("role", user.getRole().name());
            responseBody.put("redirect", "/" + user.getRole().name().toLowerCase() + ".html");

            return ResponseEntity.ok(responseBody);
        } else {
            return ResponseEntity.status(401).body(Map.of("status", "error", "message", "Sai tài khoản hoặc mật khẩu"));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestParam("username") String username,
            @RequestParam("password") String password,
            @RequestParam("email") String email,
            @RequestParam(value = "role", defaultValue = "USER") String role) {
        
        if (userRepository.existsByUsername(username)) {
            return ResponseEntity.badRequest().body("Tài khoản đã tồn tại");
        }
        
        User newUser = User.builder()
                .username(username)
                .password(password) // Lưu plain text
                .email(email)
                .role(Role.valueOf(role.toUpperCase()))
                .build();
                
        userRepository.save(newUser);
        return ResponseEntity.ok("Đăng ký thành công!");
    }
}
