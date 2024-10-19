import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import CategoryQuestionList from "../components/category/CategoryQuestionList";
import { useQuestionData } from "../hooks/useQuestionData";
import { Typography, Container, CircularProgress, Box } from "@mui/material";

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [page, setPage] = useState(1);
  const { fetchQuestions } = useQuestionData();
  const [questionsBySubcategory, setQuestionsBySubcategory] = useState({});
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchQuestions({
        category: categoryName,
        page,
        includeSubcategories: true,
      });
      console.log(`Category Detail: ${JSON.stringify(response)}`);

      // Process the questions array directly from the response
      const groupedQuestions = Array.isArray(response.questions)
        ? response.questions.reduce((acc, question) => {
            const subcategory = question.subcategory || "Uncategorized";
            if (!acc[subcategory]) {
              acc[subcategory] = [];
            }
            acc[subcategory].push(question);
            return acc;
          }, {})
        : {};

      setQuestionsBySubcategory(groupedQuestions);
      setTotalCount(response.questions ? response.questions.length : 0);
      setError(null);
    } catch (err) {
      setError(err.message);
      setQuestionsBySubcategory({});
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
      <Typography variant="h4" gutterBottom>
        {categoryName} Questions
      </Typography>
      <CategoryQuestionList
        questionsBySubcategory={questionsBySubcategory}
        totalCount={totalCount}
        onPageChange={setPage}
        currentPage={page}
      />
    </Container>
  );
};

export default CategoryPage;
