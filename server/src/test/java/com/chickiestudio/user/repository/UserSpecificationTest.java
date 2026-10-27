package com.chickiestudio.user.repository;

import com.chickiestudio.user.entity.Role;
import com.chickiestudio.user.entity.User;
import com.chickiestudio.user.entity.UserStatus;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.data.jpa.domain.Specification;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

class UserSpecificationTest {

    @Test
    @DisplayName("filterUsers với đầy đủ tham số tạo các Predicate tương ứng")
    void filterUsers_withAllParameters() {
        Root<User> root = mock(Root.class);
        CriteriaQuery<?> query = mock(CriteriaQuery.class);
        CriteriaBuilder cb = mock(CriteriaBuilder.class);

        Path usernamePath = mock(Path.class);
        Path fullNamePath = mock(Path.class);
        Path emailPath = mock(Path.class);
        Path phonePath = mock(Path.class);
        Path rolePath = mock(Path.class);
        Path statusPath = mock(Path.class);

        when(root.get("username")).thenReturn(usernamePath);
        when(root.get("fullName")).thenReturn(fullNamePath);
        when(root.get("email")).thenReturn(emailPath);
        when(root.get("phone")).thenReturn(phonePath);
        when(root.get("role")).thenReturn(rolePath);
        when(root.get("status")).thenReturn(statusPath);

        Predicate predicate = mock(Predicate.class);
        when(cb.equal(any(), any())).thenReturn(predicate);
        when(cb.like(any(), anyString())).thenReturn(predicate);
        when(cb.lower(any())).thenReturn(mock(Expression.class));
        when(cb.or(any(Predicate[].class))).thenReturn(predicate);
        when(cb.and(any(Predicate[].class))).thenReturn(predicate);

        Specification<User> spec = UserSpecification.filterUsers("maianh", Role.ROLE_STAFF, UserStatus.ACTIVE);
        Predicate result = spec.toPredicate(root, query, cb);

        assertThat(result).isNotNull();
        verify(cb).and(any(Predicate[].class));
    }

    @Test
    @DisplayName("filterUsers với tham số null hoặc rỗng tạo Predicate rỗng")
    void filterUsers_withNullParameters() {
        Root<User> root = mock(Root.class);
        CriteriaQuery<?> query = mock(CriteriaQuery.class);
        CriteriaBuilder cb = mock(CriteriaBuilder.class);

        Predicate predicate = mock(Predicate.class);
        when(cb.and(any(Predicate[].class))).thenReturn(predicate);

        Specification<User> spec = UserSpecification.filterUsers("   ", null, null);
        Predicate result = spec.toPredicate(root, query, cb);

        assertThat(result).isNotNull();
        verify(cb).and(new Predicate[0]);
    }
}
