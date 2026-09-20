/**
 * Centralized API Base URL for BajriX Backend.
 * Configured with Vite environment variable fallback to default local Spring Boot server.
 */
export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';
