// components/HomePage.js
import React, { useEffect, useState, useCallback } from "react";
import { 
  Typography, 
  Container, 
  Box, 
  CircularProgress, 
  Paper,
  Grid,
  useTheme
} from "@mui/material";
import CategoryCarousel from "../components/category/CategoryCarousel";
import FeaturedQuestions from "../components/common/FeaturedQuestions";
import { useQuestionData, useCategories } from "../hooks/useQuestionData";

const HomePage = () => {
  const [featuredQuestions, setFeaturedQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const { fetchQuestions } = useQuestionData();
  const theme = useTheme();

  const loadFeaturedQuestions = useCallback(async () => {
    try {
      const questionsData = await fetchQuestions({ limit: 10 });
      setFeaturedQuestions(questionsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchQuestions]);

  useEffect(() => {
    loadFeaturedQuestions();
  }, [loadFeaturedQuestions]);

  if (loading || categoriesLoading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <CircularProgress />
    </Box>
  );

  if (error || categoriesError) return (
    <Container>
      <Typography color="error" variant="h6">Error: {error || categoriesError}</Typography>
    </Container>
  );

  return (
    <Box>
      <Paper 
        elevation={0}
        sx={{
          bgcolor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          py: 8,
          mb: 4
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" gutterBottom align="center">
            Python Query Vault
          </Typography>
          <Typography variant="h5" align="center" paragraph>
            Code to the Top with Python: The 5 Why Approach
          </Typography>
          <Typography variant="body1" align="center" paragraph>
            Develop expertise in solving complex algorithmic queries using the 5 Why method across five essential areas: Classification, Relevance, Approach, Constraints, and Code.
          </Typography>
        </Container>
      </Paper>

      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <CategoryCarousel categories={categories} />
          </Grid>
          <Grid item xs={12}>
            <FeaturedQuestions questions={featuredQuestions} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;