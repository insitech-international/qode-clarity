import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import CategoryQuestionList from "../components/category/CategoryQuestionList";
import { useQuestionData } from "../hooks/useQuestionData";
import { Typography, Container, CircularProgress, Box } from "@mui/material";

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [page, setPage] = useState(1);
  const { fetchQuestions } = useQuestionData();
  const [questions, setQuestions] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchQuestions({ category: categoryName, page });
      setQuestions(response.results || []);
      setTotalCount(response.count || 0);
      setError(null);
    } catch (err) {
      setError(err.message);
      setQuestions([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [categoryName, page, fetchQuestions]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  return (
    <Container>
      <CategoryQuestionList
        questions={questions}
        category={categoryName}
        page={page}
        setPage={setPage}
        perPage={10}
        totalCount={totalCount}
      />
    </Container>
  );
};

export default CategoryPage;
