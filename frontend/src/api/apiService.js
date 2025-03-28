import apiClient from "./apiClient";

/**
 * Service layer for handling API operations - endpoints matched to backend
 */
class ApiService {
  constructor() {
    // Set up event listener for API unavailability
    window.addEventListener(
      "api-unavailable",
      this.handleApiUnavailable.bind(this)
    );

    // Flag to track if the API is available
    this.apiAvailable = true;
  }

  /**
   * Handle API unavailable event
   */
  handleApiUnavailable() {
    this.apiAvailable = false;
    console.warn("API Service: Detected API unavailability");

    // Redirect to API unavailable page
    if (window.location.pathname !== "/api-unavailable") {
      window.location.href = "/api-unavailable";
    }
  }

  /**
   * Check if API is available before making requests
   * @throws {Error} If API is unavailable
   */
  checkApiAvailability() {
    if (!this.apiAvailable) {
      throw new Error("API service is unavailable");
    }
  }

  /**
   * Get API information
   * @returns {Promise<Object>} API information
   */
  async getApiInfo() {
    this.checkApiAvailability();

    try {
      return await apiClient.get("/");
    } catch (error) {
      console.error("Failed to fetch API info:", error);
      throw error;
    }
  }

  /**
   * Get list of categories
   * @param {number} skip - Number of items to skip
   * @param {number} limit - Maximum number of items to return
   * @returns {Promise<Array>} List of categories
   */
  async getCategories(skip = 0, limit = 10) {
    this.checkApiAvailability();

    try {
      return await apiClient.get("/categories/", { skip, limit });
    } catch (error) {
      console.error("Failed to fetch categories:", error);

      // Return empty array for non-critical errors
      return [];
    }
  }

  /**
   * Get list of questions with optional filtering
   * @param {Object} params - Query parameters for filtering
   * @param {string} [params.search] - Search term for filtering questions
   * @param {string} [params.category] - Category filter
   * @param {string} [params.difficulty] - Difficulty filter
   * @param {number} [params.skip=0] - Number of items to skip
   * @param {number} [params.limit=10] - Maximum number of items to return
   * @returns {Promise<Object>} Questions with pagination info
   */
  async getQuestions(params = {}) {
    this.checkApiAvailability();

    const queryParams = {
      skip: params.skip || 0,
      limit: params.limit || 10,
      ...(params.search && { search: params.search }),
      ...(params.category && { category: params.category }),
      ...(params.difficulty && { difficulty: params.difficulty }),
    };

    try {
      return await apiClient.get("/questions/", queryParams);
    } catch (error) {
      console.error("Failed to fetch questions:", error);

      // Return fallback object for non-critical errors
      return {
        questions: [],
        total: 0,
        skip: queryParams.skip,
        limit: queryParams.limit,
      };
    }
  }

  /**
   * Get featured questions for each category
   * @returns {Promise<Object>} Map of category names to featured questions
   */
  async getFeaturedQuestions() {
    this.checkApiAvailability();

    try {
      return await apiClient.get("/featured_questions/");
    } catch (error) {
      console.error("Failed to fetch featured questions:", error);

      // Return empty object for non-critical errors
      return {};
    }
  }

  /**
   * Get details for a specific question
   * @param {string|number} questionId - ID of the question
   * @returns {Promise<Object>} Question details
   */
  async getQuestionDetails(questionId) {
    this.checkApiAvailability();

    if (!questionId) {
      throw new Error("Question ID is required");
    }

    try {
      return await apiClient.get(`/questions/${questionId}`);
    } catch (error) {
      console.error(
        `Failed to fetch question details for ${questionId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Get only the content field of a question
   * @param {string|number} questionId - ID of the question
   * @returns {Promise<Object>} Object containing question content
   */
  async getQuestionContent(questionId) {
    this.checkApiAvailability();

    if (!questionId) {
      throw new Error("Question ID is required");
    }

    try {
      return await apiClient.get(`/questions/${questionId}/content`);
    } catch (error) {
      console.error(
        `Failed to fetch question content for ${questionId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Get solution for a specific question
   * @param {string|number} questionId - ID of the question
   * @returns {Promise<Object>} Solution data
   */
  async getSolution(questionId) {
    this.checkApiAvailability();

    if (!questionId) {
      throw new Error("Question ID is required");
    }

    try {
      return await apiClient.get(`/solutions/${questionId}`);
    } catch (error) {
      console.error(`Failed to fetch solution for ${questionId}:`, error);
      throw error;
    }
  }

  /**
   * Test database connection (development only)
   * @returns {Promise<Object>} Connection status
   */
  async testDbConnection() {
    this.checkApiAvailability();

    try {
      return await apiClient.get("/test-db-connection");
    } catch (error) {
      console.error("Failed to test DB connection:", error);
      throw error;
    }
  }

  /**
   * Trigger database update (development only)
   * @returns {Promise<Object>} Update status
   */
  async triggerDatabaseUpdate() {
    this.checkApiAvailability();

    try {
      return await apiClient.post("/update-database");
    } catch (error) {
      console.error("Failed to trigger database update:", error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
