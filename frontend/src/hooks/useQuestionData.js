import { useState, useCallback, useEffect } from "react";
import ApiService from "../api/apiService";

/**
 * Hook for accessing and managing question data
 * @returns {Object} Question data and related functions
 */
export const useQuestionData = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch questions with optional filtering parameters
   * @param {Object} params - Query parameters for filtering questions
   * @param {string} [params.search] - Search term for filtering questions
   * @param {string} [params.category] - Category filter
   * @param {string} [params.difficulty] - Difficulty filter
   * @param {number} [params.skip=0] - Number of items to skip for pagination
   * @param {number} [params.limit=10] - Maximum number of items to return
   * @returns {Object} Questions result with pagination data
   */
  const fetchQuestions = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);

    try {
      const result = await ApiService.getQuestions(params);

      if (result && Array.isArray(result.questions)) {
        setQuestions(result.questions);
      } else {
        setQuestions([]);
        console.warn(
          "Questions response did not contain an array of questions:",
          result
        );
      }

      return result || { questions: [], total: 0, skip: 0, limit: 10 };
    } catch (err) {
      console.error("Error fetching questions:", err);
      setError("Failed to fetch questions");
      setQuestions([]);
      return { questions: [], total: 0, skip: 0, limit: 10 };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch featured questions for each category
   * @returns {Object} Object with category names as keys and arrays of questions as values
   */
  const fetchFeaturedQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await ApiService.getFeaturedQuestions();
      return response || {};
    } catch (err) {
      console.error("Error fetching featured questions:", err);
      setError("Failed to fetch featured questions");
      return {};
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch details for a specific question
   * @param {string|number} questionId - ID of the question to fetch
   * @returns {Object} Question details
   */
  const fetchQuestionDetails = useCallback(async (questionId) => {
    if (!questionId) {
      throw new Error("Question ID is required");
    }

    try {
      return await ApiService.getQuestionDetails(questionId);
    } catch (err) {
      console.error(`Error fetching question details for ${questionId}:`, err);
      throw err;
    }
  }, []);

  /**
   * Fetch just the content of a specific question
   * @param {string|number} questionId - ID of the question to fetch content for
   * @returns {Object} Object containing the question content
   */
  const fetchQuestionContent = useCallback(async (questionId) => {
    if (!questionId) {
      throw new Error("Question ID is required");
    }

    try {
      return await ApiService.getQuestionContent(questionId);
    } catch (err) {
      console.error(`Error fetching question content for ${questionId}:`, err);
      throw err;
    }
  }, []);

  /**
   * Fetch solution for a specific question
   * @param {string|number} questionId - ID of the question to fetch solution for
   * @returns {Object} Solution data
   */
  const fetchSolution = useCallback(async (questionId) => {
    if (!questionId) {
      throw new Error("Question ID is required");
    }

    try {
      return await ApiService.getSolution(questionId);
    } catch (err) {
      console.error(`Error fetching solution for ${questionId}:`, err);
      throw err;
    }
  }, []);

  return {
    // State
    questions,
    loading,
    error,

    // Data fetching methods
    fetchQuestions,
    fetchQuestionDetails,
    fetchQuestionContent,
    fetchSolution,
    fetchFeaturedQuestions,
  };
};

/**
 * Hook for accessing and managing category data
 * @param {number} [skip=0] - Number of items to skip
 * @param {number} [limit=100] - Maximum number of items to return
 * @returns {Object} Category data and loading state
 */
export const useCategories = (skip = 0, limit = 100) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await ApiService.getCategories(skip, limit);
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError(err.message || "Failed to fetch categories");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [skip, limit]);

  // Initial fetch when the hook is used
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    refreshCategories: fetchCategories,
  };
};
