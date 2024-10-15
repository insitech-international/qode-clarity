// components/SearchPage.js
import React, { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useQuestionData } from "../hooks/useQuestionData";
import CategoryQuestionList from "./../components/category/CategoryQuestionList";
import { Typography, Container, CircularProgress } from "@mui/material";

const SearchPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const category = searchParams.get("category");
  const difficulty = searchParams.get("difficulty");
  const company = searchParams.get("company");

  const { fetchQuestions } = useQuestionData();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchQuestions({ category, difficulty, company });
      setQuestions(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [category, difficulty, company, fetchQuestions]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Search Results
      </Typography>
      <CategoryQuestionList questions={questions} />
    </Container>
  );
};

export default SearchPage;
