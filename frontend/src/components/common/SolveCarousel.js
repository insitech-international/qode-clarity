import React, { useState, useEffect } from "react";
import {
  useTheme,
  Box,
  Typography,
  Paper,
  IconButton,
  Fade,
  Chip,
  Stack,
  Divider,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  PriorityHigh,
  Code,
} from "@mui/icons-material";

// Refined Corporate Color Palette
const COLORS = {
  prussianBlue: {
    primary: "#003153",
    secondary: "#034975",
    tertiary: "#005582",
  },
  blueGray: {
    primary: "#6E7F80",
    secondary: "#8A9A9B",
    tertiary: "#A4B4B6",
  },
  gold: {
    primary: "#CD9575",
    secondary: "#D8A791",
    tertiary: "#E3B9A7",
  },
  offWhite: {
    primary: "#F5F5F5",
    secondary: "#FAFAFA",
    tertiary: "#FFFFFF",
  },
  darkSlate: {
    primary: "#2F4F4F",
    secondary: "#3A5A5A",
    tertiary: "#456666",
  },
};

// Data for the SOLVE framework content
const solveContent = {
  S: {
    title: "Split the Problem",
    tagline: "Break it down before you break through",
    description:
      "Take a complex problem and divide it into smaller, manageable parts that you can tackle one by one.",
    questions: [
      "What is the main goal I'm trying to achieve?",
      "What are the inputs I'm working with and outputs I need?",
      "Can I identify 2-3 distinct sub-tasks within this problem?",
      "What's the most confusing part that needs clarification?",
    ],
    example:
      'Problem: "Create a website contact form that validates email addresses"\nSplit into: (1) Build the form UI, (2) Write the email validation logic, (3) Handle form submission',
    tip: "Sketch your problem on paper! Drawing boxes for each component helps visualize the relationships between different parts of your solution.",
  },
  O: {
    title: "Observe Examples",
    tagline: "See it in action first",
    description:
      "Work through specific examples to understand patterns and clarify how your solution should behave.",
    questions: [
      "What happens with a typical input?",
      "How does the solution process change with different inputs?",
      "Is there a pattern I can identify across different examples?",
      "What's the connection between the input and output?",
    ],
    example:
      'Problem: "Sort a list of numbers"\nExample: [4,2,7,1] → Step 1: compare 4 & 2 → Step 2: swap to [2,4,7,1] → Continue until sorted: [1,2,4,7]',
    tip: "Use multiple examples with varying complexity. Simple examples clarify the basic approach, while complex ones help identify edge cases.",
  },
  L: {
    title: "Look for Tools",
    tagline: "Don't reinvent the wheel",
    description:
      "Before creating a solution from scratch, check for existing tools, libraries, or functions that can help.",
    questions: [
      "Is there a built-in function or library that already solves this?",
      "What data structures would make this problem easier?",
      "Have I solved a similar problem before that I can adapt?",
      "Are there established algorithms for this type of problem?",
    ],
    example:
      'Problem: "Find items in a large dataset"\nInstead of writing a custom search algorithm, use a hash map/dictionary for O(1) lookups',
    tip: 'Keep a personal "toolbox" of reusable solutions for common problems. This saves time and improves consistency.',
  },
  V: {
    title: "Verify Edge Cases",
    tagline: "Test the boundaries",
    description:
      "Consider unusual or extreme situations that might cause your solution to fail.",
    questions: [
      "What happens with empty or invalid inputs?",
      "How does my solution handle minimum and maximum values?",
      "What if all values are the same?",
      "Are there any inputs that might cause infinite loops or errors?",
    ],
    example:
      'Problem: "Calculate average of numbers"\nEdge cases: Empty list (return 0 or error?), Single number (return that number), Very large numbers (overflow?)',
    tip: "Try to break your own solution! Thinking like a quality assurance tester helps you anticipate real-world issues.",
  },
  E: {
    title: "Evolve Your Solution",
    tagline: "Start simple, then refine",
    description:
      "Begin with a basic working solution, then gradually improve it based on constraints and feedback.",
    questions: [
      "Does my solution correctly handle the main cases?",
      "Can I optimize it for better performance?",
      "Is my code clean and easy to understand?",
      "Have I met all the requirements and constraints?",
    ],
    example:
      'Problem: "Find duplicates in a list"\nStart: Simple nested loop O(n²) → Improve: Sort first O(n log n) → Optimize: Use hash set O(n)',
    tip: "Focus on correctness first, then optimize. A working solution that's slightly inefficient is better than an efficient solution that doesn't work.",
  },
};

// Enhanced color palette using gold tones with better contrast
const cardColors = [
  {
    bg: COLORS.prussianBlue.primary,
    accent: COLORS.gold.primary,
    text: COLORS.offWhite.primary,
    secondary: COLORS.blueGray.tertiary,
  },
  {
    bg: COLORS.darkSlate.primary,
    accent: COLORS.gold.secondary,
    text: COLORS.offWhite.primary,
    secondary: COLORS.blueGray.tertiary,
  },
  {
    bg: COLORS.prussianBlue.secondary,
    accent: COLORS.gold.primary,
    text: COLORS.offWhite.primary,
    secondary: COLORS.blueGray.tertiary,
  },
  {
    bg: COLORS.darkSlate.secondary,
    accent: COLORS.gold.tertiary,
    text: COLORS.offWhite.primary,
    secondary: COLORS.blueGray.tertiary,
  },
  {
    bg: COLORS.prussianBlue.tertiary,
    accent: COLORS.gold.secondary,
    text: COLORS.offWhite.primary,
    secondary: COLORS.blueGray.tertiary,
  },
];

const SolveCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeTab, setActiveTab] = useState("description"); // Options: description, questions, example, tip
  const theme = useTheme();

  // Auto-slide logic using useEffect with pausing capability
  useEffect(() => {
    const autoSlide = setInterval(() => {
      if (!isTransitioning) {
        handleNext();
      }
    }, 8000); // Slide every 8 seconds (increased from 5 to give users more time to read)

    // Clear interval on component unmount
    return () => clearInterval(autoSlide);
  }, [currentIndex, isTransitioning]);

  // Go to the next slide with transition effect
  const handleNext = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(
        (prevIndex) => (prevIndex + 1) % Object.keys(solveContent).length
      );
      setIsTransitioning(false);
    }, 300);
  };

  // Go to the previous slide with transition effect
  const handlePrev = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(
        (prevIndex) =>
          (prevIndex - 1 + Object.keys(solveContent).length) %
          Object.keys(solveContent).length
      );
      setIsTransitioning(false);
    }, 300);
  };

  // Handle mouse hover to pause auto-slide
  const handleMouseEnter = () => {
    setIsTransitioning(true);
  };

  const handleMouseLeave = () => {
    setIsTransitioning(false);
  };

  const keys = Object.keys(solveContent);
  const currentKey = keys[currentIndex];
  const currentItem = solveContent[currentKey];
  const currentColor = cardColors[currentIndex % cardColors.length];

  // Helper function to render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "questions":
        return (
          <Box>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                color: currentColor.accent,
                mt: 2,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <PriorityHigh fontSize="small" /> Ask Yourself:
            </Typography>
            {currentItem.questions.map((question, index) => (
              <Typography
                key={index}
                variant="body1"
                sx={{
                  mb: 2,
                  color: currentColor.text,
                  backgroundColor: `${currentColor.bg}99`,
                  p: 1.5,
                  borderRadius: 1,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                {index + 1}. {question}
              </Typography>
            ))}
          </Box>
        );

      case "example":
        return (
          <Box>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                color: currentColor.accent,
                mt: 2,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Code fontSize="small" /> Example:
            </Typography>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                backgroundColor: `${currentColor.bg}CC`,
                color: currentColor.text,
                borderRadius: 2,
                whiteSpace: "pre-line",
              }}
            >
              {currentItem.example}
            </Paper>
          </Box>
        );

      case "tip":
        return (
          <Box>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                color: currentColor.accent,
                mt: 2,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Lightbulb fontSize="small" /> Pro Tip:
            </Typography>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                backgroundColor: `${currentColor.bg}99`,
                color: currentColor.text,
                borderRadius: 2,
                borderLeft: `6px solid ${currentColor.accent}`,
                fontStyle: "italic",
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              {currentItem.tip}
            </Paper>
          </Box>
        );

      default: // description
        return (
          <Box>
            <Typography
              variant="body1"
              sx={{
                mt: 1,
                mb: 3,
                color: currentColor.text,
                fontSize: "1.1rem",
                lineHeight: 1.6,
              }}
            >
              {currentItem.description}
            </Typography>

            <Divider sx={{ my: 2, backgroundColor: currentColor.accent }} />

            <Typography
              variant="body2"
              sx={{
                color: currentColor.secondary,
                mt: 2,
                fontStyle: "italic",
                textAlign: "center",
              }}
            >
              Click the tabs above to learn more about this step
            </Typography>
          </Box>
        );
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        height: 450,
        overflow: "hidden",
        borderRadius: 2,
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Progress indicator */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 2,
          display: "flex",
          justifyContent: "center",
          py: 1,
          px: 2,
          gap: 1,
        }}
      >
        {keys.map((key, index) => (
          <Box
            key={key}
            sx={{
              height: 4,
              flex: 1,
              backgroundColor:
                index === currentIndex
                  ? currentColor.accent
                  : `${currentColor.accent}44`,
              borderRadius: 2,
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </Box>

      {/* Content Display */}
      <Fade in={!isTransitioning} timeout={500}>
        <Paper
          elevation={0}
          sx={{
            height: "100%",
            padding: 4,
            backgroundColor: currentColor.bg,
            color: currentColor.text,
            borderRadius: 2,
            transition: "all 0.5s ease",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Title and letter section with highlighted format */}
          <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
            <Chip
              label={currentKey}
              sx={{
                backgroundColor: currentColor.accent,
                color: currentColor.bg,
                fontWeight: "bold",
                fontSize: "1.5rem",
                height: "auto",
                p: 1,
                mr: 2,
              }}
            />
            <Box>
              <Typography
                variant="h4"
                sx={{
                  color: currentColor.accent,
                  fontWeight: "bold",
                }}
              >
                {currentItem.title}
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  color: currentColor.secondary,
                  fontStyle: "italic",
                  mt: 0.5,
                }}
              >
                "{currentItem.tagline}"
              </Typography>
            </Box>
          </Box>

          {/* Tab navigation */}
          <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
            <Chip
              label="Overview"
              onClick={() => setActiveTab("description")}
              sx={{
                backgroundColor:
                  activeTab === "description"
                    ? currentColor.accent
                    : "transparent",
                color:
                  activeTab === "description"
                    ? currentColor.bg
                    : currentColor.text,
                border: `1px solid ${
                  activeTab === "description"
                    ? currentColor.accent
                    : currentColor.secondary
                }`,
                "&:hover": {
                  backgroundColor: `${currentColor.accent}99`,
                },
              }}
            />
            <Chip
              label="Questions"
              onClick={() => setActiveTab("questions")}
              sx={{
                backgroundColor:
                  activeTab === "questions"
                    ? currentColor.accent
                    : "transparent",
                color:
                  activeTab === "questions"
                    ? currentColor.bg
                    : currentColor.text,
                border: `1px solid ${
                  activeTab === "questions"
                    ? currentColor.accent
                    : currentColor.secondary
                }`,
                "&:hover": {
                  backgroundColor: `${currentColor.accent}99`,
                },
              }}
            />
            <Chip
              label="Example"
              onClick={() => setActiveTab("example")}
              sx={{
                backgroundColor:
                  activeTab === "example" ? currentColor.accent : "transparent",
                color:
                  activeTab === "example" ? currentColor.bg : currentColor.text,
                border: `1px solid ${
                  activeTab === "example"
                    ? currentColor.accent
                    : currentColor.secondary
                }`,
                "&:hover": {
                  backgroundColor: `${currentColor.accent}99`,
                },
              }}
            />
            <Chip
              label="Pro Tip"
              onClick={() => setActiveTab("tip")}
              sx={{
                backgroundColor:
                  activeTab === "tip" ? currentColor.accent : "transparent",
                color:
                  activeTab === "tip" ? currentColor.bg : currentColor.text,
                border: `1px solid ${
                  activeTab === "tip"
                    ? currentColor.accent
                    : currentColor.secondary
                }`,
                "&:hover": {
                  backgroundColor: `${currentColor.accent}99`,
                },
              }}
            />
          </Stack>

          {/* Dynamic content based on active tab */}
          <Box sx={{ flex: 1, overflow: "auto" }}>{renderContent()}</Box>
        </Paper>
      </Fade>

      {/* Navigation indicators */}
      <Box
        sx={{
          position: "absolute",
          bottom: 16,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 1,
          zIndex: 2,
        }}
      >
        {keys.map((key, index) => (
          <Box
            key={key}
            onClick={() => {
              setIsTransitioning(true);
              setTimeout(() => {
                setCurrentIndex(index);
                setIsTransitioning(false);
              }, 300);
            }}
            sx={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor:
                index === currentIndex
                  ? currentColor.accent
                  : `${currentColor.accent}44`,
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.2)",
                backgroundColor: currentColor.accent,
              },
            }}
          />
        ))}
      </Box>

      {/* Left Arrow */}
      <IconButton
        onClick={handlePrev}
        sx={{
          position: "absolute",
          left: 10,
          top: "50%",
          transform: "translateY(-50%)",
          color: currentColor.accent,
          backgroundColor: `${currentColor.bg}88`,
          "&:hover": {
            backgroundColor: currentColor.bg,
          },
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
          color: currentColor.accent,
          backgroundColor: `${currentColor.bg}88`,
          "&:hover": {
            backgroundColor: currentColor.bg,
          },
        }}
      >
        <ChevronRight />
      </IconButton>
    </Box>
  );
};

export default SolveCarousel;
