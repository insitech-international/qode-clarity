import React, { useState, useCallback, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  CircularProgress,
  Alert,
  AlertTitle,
  useTheme
} from "@mui/material";
import FeaturedQuestions from "../components/common/FeaturedQuestions";
import HeroSection from "../components/common/HeroSection";
import { useQuestionData, useCategories } from "../hooks/useQuestionData";

// Import fonts
import '@fontsource/montserrat/400.css';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/600.css';
import '@fontsource/montserrat/700.css';

// Color Palette - Aligned with InsiTech Design System
const COLORS = {
  primary: '#0047AB',      // Deep Blue
  secondary: '#F8F8F8',    // Off-White
  accent: '#E99361',       // Deep Orange / Coral
  interactive: '#4DB6AC',  // Teal / Light Blue
  gray: {
    light: '#EEEEEE',      // Light Gray
    medium: '#9E9E9E',     // Medium Gray
    dark: '#424242'        // Dark Gray
  }
};

// Typography Styles
const typographyStyles = {
  h1: {
    fontFamily: 'Montserrat, sans-serif',
    fontSize: '3rem',
    fontWeight: 700,
    lineHeight: 1.3,
    letterSpacing: '0.02em',
    color: COLORS.primary
  },
  h2: {
    fontFamily: 'Montserrat, sans-serif',
    fontSize: '2.25rem',
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: '0.02em',
    color: COLORS.primary
  },
  h5: {
    fontFamily: 'Montserrat, sans-serif',
    fontSize: '1.5rem',
    fontWeight: 600,
    lineHeight: 1.3,
    color: COLORS.primary
  },
  body1: {
    fontFamily: 'Montserrat, sans-serif',
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.5,
    color: COLORS.gray.dark
  },
  button: {
    fontFamily: 'Montserrat, sans-serif',
    fontSize: '1rem',
    fontWeight: 600,
    textTransform: 'none'
  }
};

const HomePage = () => {
  // State for modals
  const [isSolveModalOpen, setIsSolveModalOpen] = useState(false);
  const [isMethodologyModalOpen, setIsMethodologyModalOpen] = useState(false);
  
  // Data fetching hooks
  const [featuredQuestions, setFeaturedQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const { fetchQuestions } = useQuestionData();
  const theme = useTheme();

  // Modal handlers
  const openSolveModal = () => setIsSolveModalOpen(true);
  const closeSolveModal = () => setIsSolveModalOpen(false);
  const openMethodologyModal = () => setIsMethodologyModalOpen(true);
  const closeMethodologyModal = () => setIsMethodologyModalOpen(false);

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

  // Loading State
  if (loading || categoriesLoading) return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        backgroundColor: COLORS.secondary
      }}
    >
      <CircularProgress
        sx={{
          color: COLORS.accent
        }}
      />
    </Box>
  );

  // Error State
  if (error || categoriesError) return (
    <Container
      sx={{
        backgroundColor: COLORS.secondary,
        minHeight: '100vh',
        pt: 4
      }}
    >
      <Alert
        severity="error"
        sx={{
          backgroundColor: COLORS.gray.dark,
          color: COLORS.secondary,
          '& .MuiAlert-icon': {
            color: COLORS.accent
          }
        }}
      >
        <AlertTitle sx={{
          color: COLORS.secondary,
          ...typographyStyles.h5
        }}>
          Error
        </AlertTitle>
        {error || categoriesError}
      </Alert>
    </Container>
  );

  return (
    <Box sx={{
      bgcolor: COLORS.secondary,
      minHeight: "100vh",
      color: COLORS.primary
    }}>
      {/* Hero Section - Now using the new component */}
      <HeroSection 
        openSolveModal={openSolveModal} 
        openMethodologyModal={openMethodologyModal} 
      />
      
      {/* Content Sections */}
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          {/* SOLVE Framework Section */}
          <Grid
            item
            xs={12}
            sx={{
              backgroundColor: 'transparent',
              py: 4,
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80%',
                height: '1px',
                backgroundColor: COLORS.accent,
                opacity: 0.2
              }
            }}
          >
          </Grid>

          {/* Featured Questions Section */}
          <Grid
            item
            xs={12}
            sx={{
              backgroundColor: 'transparent',
              py: 4
            }}
          >
            <Typography
              variant="h5"
              gutterBottom
              align="center"
              sx={typographyStyles.h5}
            >
              Featured Questions
            </Typography>
            <FeaturedQuestions questions={featuredQuestions} />
          </Grid>
        </Grid>
      </Container>
      
      {/* You would need to add your modals here - these would be populated 
          with the SOLVE framework details and the Strategic Visualization approach */}
    </Box>
  );
};

export default HomePage;