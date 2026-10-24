package com.chickiestudio.common.exception;

import com.chickiestudio.common.dto.ApiResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;

import static org.junit.jupiter.api.Assertions.*;

class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @Test
    @DisplayName("handleNotFound_shouldReturn404")
    void handleNotFound_shouldReturn404() {
        ResponseEntity<ApiResponse<Void>> response = handler.handleNotFound(new ResourceNotFoundException("Not found"));
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals(404, response.getBody().code());
    }

    @Test
    @DisplayName("handleConflict_shouldReturn409")
    void handleConflict_shouldReturn409() {
        ResponseEntity<ApiResponse<Void>> response = handler.handleConflict(new ConflictException("Conflict"));
        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
        assertEquals(409, response.getBody().code());
    }

    @Test
    @DisplayName("handleBadRequest_shouldReturn400")
    void handleBadRequest_shouldReturn400() {
        ResponseEntity<ApiResponse<Void>> response = handler.handleBadRequest(new BadRequestException("Bad request"));
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals(400, response.getBody().code());
    }

    @Test
    @DisplayName("handleUnauthorized_shouldReturn401")
    void handleUnauthorized_shouldReturn401() {
        ResponseEntity<ApiResponse<Void>> response = handler.handleUnauthorized(new UnauthorizedException("Unauthorized"));
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals(401, response.getBody().code());
    }

    @Test
    @DisplayName("handleForbidden_shouldReturn403")
    void handleForbidden_shouldReturn403() {
        ResponseEntity<ApiResponse<Void>> response = handler.handleForbidden(new ForbiddenException("Forbidden"));
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        assertEquals(403, response.getBody().code());
    }

    @Test
    @DisplayName("handleAccessDenied_shouldReturn403")
    void handleAccessDenied_shouldReturn403() {
        ResponseEntity<ApiResponse<Void>> response = handler.handleAccessDenied(new AccessDeniedException("Access denied"));
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        assertEquals(403, response.getBody().code());
    }

    @Test
    @DisplayName("handleAuthentication_shouldReturn401")
    void handleAuthentication_shouldReturn401() {
        ResponseEntity<ApiResponse<Void>> response = handler.handleAuthentication(new BadCredentialsException("Auth error"));
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals(401, response.getBody().code());
    }

    @Test
    @DisplayName("handleNoResourceFound_shouldReturn404")
    void handleNoResourceFound_shouldReturn404() {
        org.springframework.web.servlet.resource.NoResourceFoundException ex =
                new org.springframework.web.servlet.resource.NoResourceFoundException(org.springframework.http.HttpMethod.GET, "api/admin/unknown");
        ResponseEntity<ApiResponse<Void>> response = handler.handleNoResourceFound(ex);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals(404, response.getBody().code());
    }

    @Test
    @DisplayName("handleHttpMessageNotReadable_shouldReturn400")
    void handleHttpMessageNotReadable_shouldReturn400() {
        org.springframework.http.converter.HttpMessageNotReadableException ex =
                new org.springframework.http.converter.HttpMessageNotReadableException("Malformed JSON");
        ResponseEntity<ApiResponse<Void>> response = handler.handleHttpMessageNotReadable(ex);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals(400, response.getBody().code());
    }

    @Test
    @DisplayName("handleMaxUploadSizeExceeded_shouldReturn400")
    void handleMaxUploadSizeExceeded_shouldReturn400() {
        org.springframework.web.multipart.MaxUploadSizeExceededException ex =
                new org.springframework.web.multipart.MaxUploadSizeExceededException(10485760L);
        ResponseEntity<ApiResponse<Void>> response = handler.handleMaxUploadSizeExceeded(ex);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals(400, response.getBody().code());
    }

    @Test
    @DisplayName("handleGenericException_shouldReturn500")
    void handleGenericException_shouldReturn500() {
        ResponseEntity<ApiResponse<Void>> response = handler.handleGenericException(new RuntimeException("Crash"));
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals(500, response.getBody().code());
    }
}
