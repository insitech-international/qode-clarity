import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mindMap, setMindMap] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await api.get("/categories/");
        setCategories(response.data.categories || []);
        setMindMap(response.data.mind_map || {});
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError(err.response?.data?.error || "Failed to fetch categories");
        setCategories([]);
        setMindMap({});
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, mindMap, loading, error };
};

export const useQuestionData = (initialPage = 1, initialPerPage = 10) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [page, setPage] = useState(initialPage);
  const [perPage, setPerPage] = useState(initialPerPage);
  const [category, setCategory] = useState(null);
  const [difficulty, setDifficulty] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const response = await api.get("/questions/", {
          params: { page, per_page: perPage, category, difficulty },
        });
        setQuestions(response.data.questions);
        setTotalQuestions(response.data.total);
      } catch (err) {
        setError("Failed to fetch questions");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [page, perPage, category, difficulty]);

  const fetchQuestionDetails = async (questionId) => {
    try {
      const response = await api.get(`/questions/${questionId}/`);
      return response.data;
    } catch (err) {
      throw new Error("Failed to fetch question details");
    }
  };

  const fetchSolution = async (questionId) => {
    try {
      const response = await api.get(`/solutions/${questionId}/`);
      return response.data;
    } catch (err) {
      throw new Error("Failed to fetch solution");
    }
  };

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
  };
};
