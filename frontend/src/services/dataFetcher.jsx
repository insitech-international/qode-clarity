// Define the correct base URL for production
const GITHUB_BASE_URL = 'https://insitech-international.github.io/code-clarity';

class DataFetcher {
  constructor(config = {}) {
    // Determine if the environment is production
    const isProduction = !window.location.hostname.includes('localhost') &&
                        !window.location.hostname.includes('127.0.0.1');

    // Initialize properties
    this.API_BASE_URL = "http://127.0.0.1:8000";
    this.STATIC_BASE_URL = isProduction
      ? GITHUB_BASE_URL
      : '';
    this.DEVELOPMENT_MODE = !isProduction;
    this.CACHE_DURATION = config.cacheDuration || 3600000;
    this.API_TIMEOUT = 5000;
    this.cache = new Map();

    // Store mapped paths
    this.questionPaths = new Map();
    this.solutionPaths = new Map();

    console.log('DataFetcher initialized:', {
      environment: isProduction ? 'production' : 'development',
      API_BASE_URL: this.API_BASE_URL,
      STATIC_BASE_URL: this.STATIC_BASE_URL,
      DEVELOPMENT_MODE: this.DEVELOPMENT_MODE,
    });
  }

  async loadIndex() {
    try {
      const response = await this.fetchData('/api/index', '/static/data/index.json');

      if (response.questions) {
        response.questions.forEach(item => {
          if (item.id && item.path) {
            this.questionPaths.set(item.id.toString(), item.path);
          }
        });
      }

      if (response.solutions) {
        response.solutions.forEach(item => {
          if (item.id && item.path) {
            this.solutionPaths.set(item.id.toString(), item.path);
          }
        });
      }

      return response;
    } catch (error) {
      console.error('Error loading index:', error);
      throw error;
    }
  }

  // Core data fetching method
  async fetchData(apiPath, staticPath = null, params = null) {
    // Development mode: Fetch from API only
    if (this.DEVELOPMENT_MODE) {
      if (!apiPath) {
        throw new Error('API path is required in development mode');
      }

      try {
        console.log('Attempting API fetch:', `${this.API_BASE_URL}${apiPath}`);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.API_TIMEOUT);

        const response = await fetch(`${this.API_BASE_URL}${apiPath}`, {
          signal: controller.signal,
          ...(params && { params }),
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error('API request failed');
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error('API request failed:', error);
        throw new Error('API is required in development mode');
      }
    }

    // Production mode: Try API first, then fallback to static files
    try {
      if (apiPath) {
        console.log('Attempting API fetch:', `${this.API_BASE_URL}${apiPath}`);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.API_TIMEOUT);

        const response = await fetch(`${this.API_BASE_URL}${apiPath}`, {
          signal: controller.signal,
          ...(params && { params }),
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          return data;
        }
      }
    } catch (apiError) {
      console.warn('API fetch failed, falling back to static files');
    }

    // Static file fallback (production only)
    if (!staticPath) {
      throw new Error('No static path provided for fallback');
    }

    try {
      // Clean up the static path
      const cleanPath = staticPath.startsWith('/') ? staticPath.slice(1) : staticPath;
      const staticURL = `${this.STATIC_BASE_URL}/${cleanPath}`;
      console.log('Fetching static file:', staticURL);

      const response = await fetch(staticURL);

      if (!response.ok) {
        throw new Error(`Static file fetch failed: ${response.status}`);
      }

      // Handle Markdown files
      if (staticPath.endsWith('.md')) {
        return await response.text();
      }

      // Handle JSON files
      try {
        const data = await response.json();
        return data;
      } catch {
        return await response.text();
      }
    } catch (staticError) {
      console.error('Static file error:', staticError);
      throw staticError;
    }
  }

  // Get content by ID
  async getContent(id, type = 'question') {
    // Load index if paths aren't loaded
    if (this.questionPaths.size === 0) {
      await this.loadIndex();
    }

    const pathMap = type === 'question' ? this.questionPaths : this.solutionPaths;
    const path = pathMap.get(id.toString());

    if (!path) {
      throw new Error(`Invalid ${type} ID: ${id}`);
    }

    return this.fetchData(
      `/api/${type}s/${id}`,
      path
    );
  }

  // Get categories
  async getCategories() {
    return this.fetchData('/categories/', 'static/data/categories.json');
  }

  // Get featured questions
  async getFeaturedQuestions() {
    return this.fetchData('/featured_questions/', 'static/data/featured.json');
  }

  // Helper method for testing API connection
  async testConnection() {
    try {
      const response = await fetch(`${this.API_BASE_URL}/test-connection`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Create a singleton instance of the DataFetcher class
const dataFetcher = new DataFetcher();

// Export both the instance and the class
export { DataFetcher };
export default dataFetcher;