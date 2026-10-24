package com.chickiestudio.common.config;

import com.chickiestudio.user.entity.Role;
import com.chickiestudio.user.entity.User;
import com.chickiestudio.user.entity.UserStatus;
import com.chickiestudio.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            log.info("Seeding initial default accounts for Chickie Studio...");

            User admin = User.builder()
                    .username("admin")
                    .email("admin@chickiestudio.vn")
                    .passwordHash(passwordEncoder.encode("Admin@123456"))
                    .fullName("Quản Trị Viên Chickie")
                    .phone("0901234567")
                    .role(Role.ROLE_ADMIN)
                    .status(UserStatus.ACTIVE)
                    .build();

            User staff = User.builder()
                    .username("staff")
                    .email("staff@chickiestudio.vn")
                    .passwordHash(passwordEncoder.encode("Staff@123456"))
                    .fullName("Nhân Viên Vận Hành")
                    .phone("0907654321")
                    .role(Role.ROLE_STAFF)
                    .status(UserStatus.ACTIVE)
                    .build();

            userRepository.save(admin);
            userRepository.save(staff);
            log.info("Default accounts created: admin / Admin@123456 and staff / Staff@123456");
        }
    }
}
