import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Utility function to handle API calls
const fetchData = async (url, params) => {
  try {
    const response = await api.get(url, { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "An error occurred");
  }
};

// Categories Hook
export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await api.get("/categories/");
        const data = response.data;

        console.log("Raw response:", data);

        if (data.results && Array.isArray(data.results.categories)) {
          const extractedCategories = data.results.categories.map(
            (category) => ({
              name: category.name,
              count: category.count,
              diagramPath: category.diagram_path,
              questions: category.questions.map((q) => ({
                question: q.question,
                solution: q.solution,
              })),
            })
          );

          setCategories(extractedCategories);
        } else {
          throw new Error("Invalid data structure received from API");
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError(err.message);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  console.log("Categories Hook:", { categories, loading, error });

  return { categories, loading, error };
};

// Question Data Hook
export const useQuestionData = (
  initialPage = 1,
  initialPerPage = 10,
  initialCategory = null
) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [page, setPage] = useState(initialPage);
  const [perPage, setPerPage] = useState(initialPerPage);
  const [category, setCategory] = useState(initialCategory);
  const [difficulty, setDifficulty] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchQuestions = useCallback(async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    setError(null);

    try {
      const data = await fetchData("/questions/", {
        page,
        per_page: perPage,
        category,
        difficulty,
      });

      console.log("Raw response:", data);

      const newQuestions = data.results || [];
      console.log("New questions:", newQuestions);

      setQuestions((prevQuestions) =>
        page === 1 ? newQuestions : [...prevQuestions, ...newQuestions]
      );
      setTotalQuestions(data.count || 0);
      setHasMore(
        newQuestions.length === perPage && page * perPage < data.count
      );
    } catch (err) {
      console.error("Error fetching questions:", err);
      setError("Failed to fetch questions. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [page, perPage, category, difficulty, hasMore, loading]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  useEffect(() => {
    // Reset questions and pagination when category, difficulty, or perPage changes
    setQuestions([]);
    setPage(1);
    setHasMore(true);
    setError(null);
  }, [category, difficulty, perPage]);

  const fetchQuestionDetails = useCallback(async (questionId) => {
    return await fetchData(`/questions/${questionId}/`);
  }, []);

  const fetchSolution = useCallback(async (questionId) => {
    return await fetchData(`/solutions/${questionId}/`);
  }, []);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [loading, hasMore]);

  return {
    questions,
    loading,
    error,
    totalQuestions,
    page,
    setPage,
    perPage,
    setPerPage,
    category,
    setCategory,
    difficulty,
    setDifficulty,
    fetchQuestionDetails,
    fetchSolution,
    hasMore,
    loadMore,
  };
};
