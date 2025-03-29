/**
 * API Client for handling HTTP requests to the FastAPI backend
 */
class ApiClient {
  constructor() {
    // Base URL for API requests - use REACT_APP_API_BASE_URL from environment
    this.baseUrl = process.env.REACT_APP_API_BASE_URL || "/api";
    console.log(`API Client: Base URL is ${this.baseUrl}`);

    // Detect if we're running in a development environment
    this.isDevelopment = process.env.NODE_ENV === "development";

    // API request configuration
    this.timeout = 5000; // 5 second timeout
    this.retryCount = 0;
    this.maxRetries = 1; // Only retry once
    this.serviceAvailable = true; // Track if service appears to be down
    this.failureCount = 0;
    this.maxFailureCount = 3; // After 3 consecutive failures, mark as unavailable
  }

  /**
   * Create query string from parameters object
   * @param {Object} params - Query parameters
   * @returns {string} URL-encoded query string
   */
  createQueryString(params) {
    if (!params || Object.keys(params).length === 0) return "";

    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value);
      }
    });

    return `?${queryParams.toString()}`;
  }

  /**
   * Mark API as unavailable to prevent further attempts
   */
  markServiceUnavailable() {
    if (this.serviceAvailable) {
      console.warn(
        "API service appears to be unavailable, stopping further requests"
      );
      this.serviceAvailable = false;

      // Dispatch an event that components can listen for
      window.dispatchEvent(new CustomEvent("api-unavailable"));
    }
  }

  /**
   * Reset the failure count after a successful request
   */
  resetFailureCount() {
    if (this.failureCount > 0) {
      this.failureCount = 0;
    }
  }

  /**
   * Increment the failure count and check if we should mark service as unavailable
   */
  incrementFailureCount() {
    this.failureCount++;

    if (this.failureCount >= this.maxFailureCount) {
      this.markServiceUnavailable();
    }
  }

  /**
   * Execute an HTTP request with limited retries
   * @param {string} endpoint - API endpoint
   * @param {Object} params - Query parameters
   * @param {Object} options - Fetch options
   * @returns {Promise<Object>} Response data
   */
  async request(endpoint, params = {}, options = {}) {
    // If service is already known to be unavailable, fail fast
    if (!this.serviceAvailable) {
      throw new Error("API service is unavailable");
    }

    // Ensure endpoint starts with a slash
    const normalizedEndpoint = endpoint.startsWith("/")
      ? endpoint
      : `/${endpoint}`;

    // Build the full URL
    const url = `${this.baseUrl}${normalizedEndpoint}${this.createQueryString(
      params
    )}`;

    // Create abort controller for timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      console.log(`API Client: Fetching ${url}`);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      // Reset retry count and failure count on success
      this.retryCount = 0;
      this.resetFailureCount();

      if (!response.ok) {
        // Handle HTTP error status
        const errorStatus = response.status;

        if (errorStatus === 404) {
          throw new Error(`Resource not found: ${normalizedEndpoint}`);
        } else if (errorStatus >= 500) {
          // Server errors might be temporary
          this.incrementFailureCount();
          throw new Error(
            `Server error: ${response.status} ${response.statusText}`
          );
        } else {
          // Client errors are usually not retryable
          throw new Error(
            `HTTP error ${response.status}: ${response.statusText}`
          );
        }
      }

      // Parse JSON response
      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      if (error.name === "AbortError") {
        console.error(`API request timed out: ${url}`);

        // Increment failure count
        this.incrementFailureCount();

        // Check if we've exhausted retries
        if (this.retryCount >= this.maxRetries) {
          throw new Error("API service is not responding");
        }

        // Increment retry count
        this.retryCount++;

        throw new Error("Request timed out");
      }

      // For network errors (offline, etc), increment failure count
      if (error.name === "TypeError" && error.message === "Failed to fetch") {
        this.incrementFailureCount();
        throw new Error("Network connection error");
      }

      throw error;
    }
  }

  /**
   * Perform a GET request
   * @param {string} endpoint - API endpoint
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Response data
   */
  async get(endpoint, params = {}) {
    return this.request(endpoint, params, { method: "GET" });
  }

  /**
   * Perform a POST request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @returns {Promise<Object>} Response data
   */
  async post(endpoint, data = {}) {
    return this.request(
      endpoint,
      {},
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  }

  /**
   * Perform a PUT request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @returns {Promise<Object>} Response data
   */
  async put(endpoint, data = {}) {
    return this.request(
      endpoint,
      {},
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );
  }

  /**
   * Perform a DELETE request
   * @param {string} endpoint - API endpoint
   * @returns {Promise<Object>} Response data
   */
  async delete(endpoint) {
    return this.request(endpoint, {}, { method: "DELETE" });
  }
}

// Create and export a singleton instance
const apiClient = new ApiClient();
export default apiClient;
