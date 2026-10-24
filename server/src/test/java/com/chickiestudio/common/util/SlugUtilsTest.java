package com.chickiestudio.common.util;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class SlugUtilsTest {

    @Test
    @DisplayName("Chuyển chuỗi tiếng Việt có dấu và chữ đ sang slug chuẩn")
    void toSlug_vietnameseString_shouldConvertCorrectly() {
        assertEquals("dam-da-hoi-do-nhung-cao-cap", SlugUtils.toSlug("Đầm Dạ Hội Đỏ Nhung Cao Cấp"));
        assertEquals("vay-thiet-ke-di-tiec", SlugUtils.toSlug("  Váy Thiết Kế Đi Tiệc!@#  "));
        assertEquals("chup-ngoai-canh", SlugUtils.toSlug("Chụp --- Ngoại Cảnh"));
    }

    @Test
    @DisplayName("Chuỗi rỗng hoặc null trả về chuỗi rỗng")
    void toSlug_nullOrEmpty_shouldReturnEmpty() {
        assertEquals("", SlugUtils.toSlug(null));
        assertEquals("", SlugUtils.toSlug("   "));
        assertEquals("", SlugUtils.toSlug(""));
    }
}
