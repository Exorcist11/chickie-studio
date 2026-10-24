package com.chickiestudio.auth.util;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class TokenHashUtilsTest {

    @Test
    @DisplayName("hash_whenTokenIsNull_shouldReturnNull")
    void hash_whenTokenIsNull_shouldReturnNull() {
        assertNull(TokenHashUtils.hash(null));
    }

    @Test
    @DisplayName("hash_whenValidString_shouldReturnSha256HexString")
    void hash_whenValidString_shouldReturnSha256HexString() {
        String token = "sample-refresh-token-123456";
        String hash1 = TokenHashUtils.hash(token);
        String hash2 = TokenHashUtils.hash(token);

        assertNotNull(hash1);
        assertEquals(64, hash1.length());
        assertEquals(hash1, hash2);
    }
}
