import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuestionData, useCategories } from "../../hooks/useQuestionData";
import Pagination from "../../components/Pagination";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Chip,
  Grid,
  Button,
  Box,
} from "@mui/material";

const CategoryQuestionList = ({ category }) => {
  const {
    questions,
    loading: questionsLoading,
    error: questionsError,
    page,
    setPage,
    perPage,
    setCategory,
    hasMore,
    loadMore,
  } = useQuestionData();

  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  const [categoryExists, setCategoryExists] = useState(false);

  const normalizeCategory = (cat) => cat.replace(/-/g, " ").toLowerCase();

  useEffect(() => {
    if (category) {
      setCategory(category);
    }
  }, [category, setCategory]);

  useEffect(() => {
    if (!categoriesLoading && categories.length > 0) {
      console.log(
        "Categories:",
        categories.map((cat) => cat.name)
      );
      const normalizedCategories = categories.map((cat) =>
        normalizeCategory(cat.name)
      );
      console.log("Normalized categories:", normalizedCategories);
      const exists = normalizedCategories.includes(normalizeCategory(category));
      setCategoryExists(exists);
    }
  }, [categoriesLoading, categories, category]);

  const filteredQuestions = useMemo(
    () =>
      questions.filter(
        (question) =>
          question &&
          typeof question.category === "string" &&
          normalizeCategory(question.category) === normalizeCategory(category)
      ),
    [questions, category]
  );

  const paginatedQuestions = useMemo(() => {
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return filteredQuestions.slice(start, end);
  }, [filteredQuestions, page, perPage]);

  const totalPages = useMemo(
    () => Math.ceil(filteredQuestions.length / perPage),
    [filteredQuestions, perPage]
  );

  if (categoriesLoading || questionsLoading) return <LoadingSpinner />;
  if (!categoryExists)
    return <Typography variant="h6">Category not found</Typography>;
  if (questionsError || categoriesError)
    return (
      <Typography color="error">
        Error: {questionsError || categoriesError}
      </Typography>
    );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {category
          ? `${category.replace(/-/g, " ")} Questions (${
              filteredQuestions.length
            })`
          : "All Questions"}
      </Typography>
      <Grid container spacing={3}>
        {paginatedQuestions.map((question) => (
          <Grid item xs={12} sm={6} lg={4} key={question.id}>
            <Card elevation={3}>
              <CardHeader
                title={question.title}
                titleTypographyProps={{ variant: "h6" }}
              />
              <CardContent>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Difficulty:{" "}
                  <Chip
                    label={question.difficulty}
                    color={
                      question.difficulty === "Hard"
                        ? "error"
                        : question.difficulty === "Medium"
                        ? "warning"
                        : "success"
                    }
                    size="small"
                  />
                </Typography>
                <Typography variant="body2" paragraph>
                  {question.scenario.slice(0, 100)}...
                </Typography>
                <Button
                  component={Link}
                  to={`/question/${question.id}`}
                  variant="contained"
                  color="primary"
                  size="small"
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {totalPages > 1 && (
        <Box mt={4} display="flex" justifyContent="center">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </Box>
      )}
    </Box>
  );
};

export default CategoryQuestionList;
