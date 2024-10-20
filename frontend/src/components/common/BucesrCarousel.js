import React, { useState, useEffect } from "react";
import { useTheme, Box, Typography, Paper, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

// Data for the content
const bucesrContent = {
  B: {
    title: "Break the Problem Down",
    description: "Understand the problem before attempting to solve it.",
    questions: [
      "What is the core task, including inputs, outputs, and key conditions?",
      "What is the final result or output required?",
    ],
  },
  U: {
    title: "Use Examples",
    description: "Work with examples to internalize the approach.",
    questions: [
      "Can I manually work through examples to detect patterns?",
      "Do the examples cover all edge cases, or do I need additional ones?",
    ],
  },
  C: {
    title: "Check for Existing Tools",
    description:
      "Identify built-in tools or algorithms to simplify the solution.",
    questions: [
      "Are there built-in functions, libraries, or known algorithms I can use?",
      "What data structures or mathematical concepts would make this task easier?",
    ],
  },
  E: {
    title: "Edge Case Awareness",
    description: "Ensure your solution works in all scenarios.",
    questions: [
      "What are the extreme inputs (e.g., empty, maximum, all same, none matching)?",
      "Are there unexpected inputs that could cause errors or infinite loops?",
    ],
  },
  S: {
    title: "Start Simple",
    description: "Build the simplest version and progressively refine it.",
    questions: [
      "What's the simplest version of this problem I can solve?",
      "Does my basic solution handle the core functionality and solve the provided examples?",
    ],
  },
  R: {
    title: "Review the Constraints",
    description: "Ensure your solution is efficient and meets constraints.",
    questions: [
      "Does my solution fit within time and space constraints, even for large inputs?",
      "Can I refactor to improve efficiency or readability after validation?",
    ],
  },
};

// Color palette (referencing MUI theme colors)
const colors = (theme) => [
  theme.palette.primary.main,
  theme.palette.secondary.main,
  theme.palette.info.main,
  theme.palette.success.main,
  theme.palette.warning.main,
  theme.palette.error.main,
];

const BucesrCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const theme = useTheme(); // Access MUI theme

  // Auto-slide logic using useEffect
  useEffect(() => {
    const autoSlide = setInterval(() => {
      handleNext();
    }, 5000); // Slide every 5 seconds

    // Clear interval on component unmount
    return () => clearInterval(autoSlide);
  }, [currentIndex]);

  // Go to the next slide
  const handleNext = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex + 1) % Object.keys(bucesrContent).length
    );
  };

  // Go to the previous slide
  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + Object.keys(bucesrContent).length) %
        Object.keys(bucesrContent).length
    );
  };

  const keys = Object.keys(bucesrContent);
  const currentKey = keys[currentIndex];
  const currentItem = bucesrContent[currentKey];

  return (
    <Box sx={{ position: "relative", height: 400, overflow: "hidden" }}>
      {/* Content Display */}
      <Paper
        elevation={3}
        sx={{
          height: "100%",
          padding: 3,
          backgroundColor: theme.palette.background.default,
          borderRadius: 2,
          transition: "all 0.5s ease",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ color: colors(theme)[currentIndex % colors(theme).length] }}
        >
          {currentKey}: {currentItem.title}
        </Typography>
        <Typography variant="body1" paragraph>
          {currentItem.description}
        </Typography>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            color: colors(theme)[currentIndex % colors(theme).length],
            mt: 2,
          }}
        >
          Key Questions:
        </Typography>
        {/* Removing bullet points by not using <ul> */}
        {currentItem.questions.map((question, index) => (
          <Typography key={index} variant="body2" sx={{ mb: 1 }}>
            {index + 1}. {question}
          </Typography>
        ))}
      </Paper>

      {/* Left Arrow */}
      <IconButton
        onClick={handlePrev}
        sx={{
          position: "absolute",
          left: 10,
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        <ChevronLeft />
      </IconButton>

      {/* Right Arrow */}
      <IconButton
        onClick={handleNext}
        sx={{
          position: "absolute",
          right: 10,
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        <ChevronRight />
      </IconButton>
    </Box>
  );
};

export default BucesrCarousel;
