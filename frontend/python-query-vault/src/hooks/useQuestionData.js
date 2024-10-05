// hooks/useQuestionData.js
import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
});

const fetchData = async (url, params) => {
  try {
    const response = await api.get(url, { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "An error occurred");
  }
};

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

  return { categories, loading, error };
};

export const useQuestionData = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchQuestions = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchData("/questions/", params);
      console.log(data);
      return data.results || [];
    } catch (err) {
      console.error("Error fetching questions:", err);
      setError("Failed to fetch questions. Please try again later.");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchQuestionDetails = useCallback(async (questionId) => {
    return await fetchData(`/questions/${questionId}/`);
  }, []);

  const fetchSolution = useCallback(async (questionId) => {
    return await fetchData(`/solutions/${questionId}/`);
  }, []);

  return {
    questions,
    loading,
    error,
    fetchQuestions,
    fetchQuestionDetails,
    fetchSolution,
  };
};
