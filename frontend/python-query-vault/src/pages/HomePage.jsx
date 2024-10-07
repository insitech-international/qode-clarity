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
import { motion, AnimatePresence } from "framer-motion";
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

  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const phrases = [
    { text: "Pythonic Implementation", color: "#FF9800" }, // Orange
    { text: "Mathematical Abstraction", color: "#00BCD4" }, // Cyan
    { text: "Real-World Analogies", color: "#FFEB3B" }, // Yellow
    { text: "Storytelling Approach", color: "#8BC34A" }, // Light Green
    { text: "Visual Representation", color: "#B39DDB" } // Red
  ];

  const typewriterVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
    exit: { opacity: 0, transition: { duration: 0.5 } }
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

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
            Code Clarity: The 5 How Approach
          </Typography>
          <Typography variant="body1" align="center" paragraph>
            Code to the Top by solving complex algorithmic and data structure challenges using the 5 How method:
          </Typography>
          <Box height="60px" display="flex" justifyContent="center" alignItems="center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPhraseIndex}
                variants={typewriterVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Typography variant="h5" align="center" style={{ color: phrases[currentPhraseIndex].color }}>
                  {phrases[currentPhraseIndex].text.split('').map((char, index) => (
                    <motion.span key={index} variants={letterVariants}>
                      {char}
                    </motion.span>
                  ))}
                </Typography>
              </motion.div>
            </AnimatePresence>
          </Box>
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