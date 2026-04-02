package com.dalat.nhom6.chieuthu5.smarttour;

import com.dalat.nhom6.chieuthu5.smarttour.entity.Role;
import com.dalat.nhom6.chieuthu5.smarttour.entity.User;
import com.dalat.nhom6.chieuthu5.smarttour.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("====== Kiểm tra và Đồng bộ Database ======");
        
        // Update ép cứng password về dạng text thường để dọn dẹp các mã hash cũ
        createOrUpdateUser("admin", "123456", "admin@smarttour.com", Role.ADMIN);
        createOrUpdateUser("staff", "123456", "agency@smarttour.com", Role.STAFF);
        createOrUpdateUser("demo", "123", "guest@smarttour.com", Role.USER);
            
        System.out.println("====== ĐÃ RESET MẬT KHẨU 3 TÀI KHOẢN VỀ CHUẨN TEXT: admin (123456) | staff (123456) | demo (123)");
    }

    @Autowired
    private com.dalat.nhom6.chieuthu5.smarttour.repository.AgencyRepository agencyRepository;

    private void createOrUpdateUser(String username, String rawPassword, String email, Role role) {
        User user = userRepository.findByUsername(username).orElse(
            User.builder()
                .username(username)
                .email(email)
                .role(role)
                .isLocked(false)
                .createdAt(LocalDateTime.now())
                .build()
        );
        
        user.setPassword(rawPassword);
        user = userRepository.save(user);

        if (role == Role.STAFF && !agencyRepository.findByUserId(user.getId()).isPresent()) {
            com.dalat.nhom6.chieuthu5.smarttour.entity.Agency agency = com.dalat.nhom6.chieuthu5.smarttour.entity.Agency.builder()
                .user(user)
                .agencyName("Du Lịch " + username.toUpperCase())
                .businessLicense("GP-" + System.currentTimeMillis())
                .address("Đà Lạt, Lâm Đồng")
                .isApproved(true)
                .build();
            agencyRepository.save(agency);
        }
    }
}
