package com.chickiestudio.common.config;

import com.chickiestudio.category.repository.CategoryRepository;
import com.chickiestudio.user.entity.Role;
import com.chickiestudio.user.entity.User;
import com.chickiestudio.user.entity.UserStatus;
import com.chickiestudio.user.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DataInitializerTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private DataInitializer dataInitializer;

    @Test
    @DisplayName("run_whenUsersDoNotExist_shouldCreateAdminAndStaff")
    void run_whenUsersDoNotExist_shouldCreateAdminAndStaff() {
        when(userRepository.findByUsernameOrEmail("admin")).thenReturn(Optional.empty());
        when(userRepository.findByUsernameOrEmail("staff")).thenReturn(Optional.empty());
        when(categoryRepository.count()).thenReturn(5L);

        dataInitializer.run();

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository, times(2)).save(userCaptor.capture());

        User admin = userCaptor.getAllValues().get(0);
        assertEquals("admin", admin.getUsername());
        assertEquals("admin@chickiestudio.vn", admin.getEmail());
        assertEquals(DataInitializer.DEFAULT_ADMIN_PASSWORD_HASH, admin.getPasswordHash());
        assertEquals(Role.ROLE_ADMIN, admin.getRole());
        assertEquals(UserStatus.ACTIVE, admin.getStatus());

        User staff = userCaptor.getAllValues().get(1);
        assertEquals("staff", staff.getUsername());
        assertEquals("staff@chickiestudio.vn", staff.getEmail());
        assertEquals(DataInitializer.DEFAULT_STAFF_PASSWORD_HASH, staff.getPasswordHash());
        assertEquals(Role.ROLE_STAFF, staff.getRole());
    }

    @Test
    @DisplayName("run_whenAdminHasLegacyInvalidHash_shouldUpdateToStandardHash")
    void run_whenAdminHasLegacyInvalidHash_shouldUpdateToStandardHash() {
        User legacyAdmin = User.builder()
                .username("admin")
                .email("admin@chickiestudio.vn")
                .passwordHash("$2a$10$w09b4vM2j5O8L4q7i3d7OuhX8yC0y8a7m2y6T4o1s3e5r7u9i1a2C")
                .role(Role.ROLE_ADMIN)
                .status(UserStatus.ACTIVE)
                .build();

        User staff = User.builder()
                .username("staff")
                .email("staff@chickiestudio.vn")
                .passwordHash(DataInitializer.DEFAULT_STAFF_PASSWORD_HASH)
                .role(Role.ROLE_STAFF)
                .status(UserStatus.ACTIVE)
                .build();

        when(userRepository.findByUsernameOrEmail("admin")).thenReturn(Optional.of(legacyAdmin));
        when(userRepository.findByUsernameOrEmail("staff")).thenReturn(Optional.of(staff));
        when(categoryRepository.count()).thenReturn(5L);

        dataInitializer.run();

        verify(userRepository).save(legacyAdmin);
        assertEquals(DataInitializer.DEFAULT_ADMIN_PASSWORD_HASH, legacyAdmin.getPasswordHash());
    }

    @Test
    @DisplayName("run_whenAdminHasCustomHash_shouldNotOverwrite")
    void run_whenAdminHasCustomHash_shouldNotOverwrite() {
        String customHash = "$2a$10$customValidHashString1234567890123456789012345678901234";
        User customAdmin = User.builder()
                .username("admin")
                .email("admin@chickiestudio.vn")
                .passwordHash(customHash)
                .role(Role.ROLE_ADMIN)
                .status(UserStatus.ACTIVE)
                .build();

        User staff = User.builder()
                .username("staff")
                .email("staff@chickiestudio.vn")
                .passwordHash(DataInitializer.DEFAULT_STAFF_PASSWORD_HASH)
                .role(Role.ROLE_STAFF)
                .status(UserStatus.ACTIVE)
                .build();

        when(userRepository.findByUsernameOrEmail("admin")).thenReturn(Optional.of(customAdmin));
        when(userRepository.findByUsernameOrEmail("staff")).thenReturn(Optional.of(staff));
        when(categoryRepository.count()).thenReturn(5L);

        dataInitializer.run();

        verify(userRepository, never()).save(any(User.class));
        assertEquals(customHash, customAdmin.getPasswordHash());
    }

    @Test
    @DisplayName("run_whenCategoriesEmpty_shouldSeedCategories")
    void run_whenCategoriesEmpty_shouldSeedCategories() {
        when(userRepository.findByUsernameOrEmail("admin")).thenReturn(Optional.empty());
        when(userRepository.findByUsernameOrEmail("staff")).thenReturn(Optional.empty());
        when(categoryRepository.count()).thenReturn(0L);

        dataInitializer.run();

        verify(categoryRepository).saveAll(any());
    }
}
