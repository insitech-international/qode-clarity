import React, { useState } from "react";
import {
  Typography,
  Box,
  Paper,
  Divider,
  IconButton,
  Modal,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Collapse,
  List,
  ListItem,
  ListItemText,
  Fade,
  useTheme,
  useMediaQuery,
  Chip
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CodeIcon from "@mui/icons-material/Code";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";

// Color Palette
const COLORS = {
  primary: "#0047AB", // Deep Blue
  secondary: "#F8F8F8", // Off-White
  accent: "#E99361", // Deep Orange / Coral
  interactive: "#4DB6AC", // Teal / Light Blue
  gray: {
    light: "#EEEEEE",
    medium: "#9E9E9E",
    dark: "#424242",
  },
};

// SOLVE Framework Content
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
    tip: "Keep a personal \"toolbox\" of reusable solutions for common problems. This saves time and improves consistency.",
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

// Modal style
const modalStyle = (theme) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "95%",
  maxWidth: 1000,
  maxHeight: "90vh",
  bgcolor: COLORS.secondary,
  color: COLORS.primary,
  boxShadow: 24,
  p: 4,
  overflowY: "auto",
  borderRadius: "12px",
  [theme.breakpoints.down("sm")]: {
    width: "95%",
    p: 2,
  },
});

// Card colors for each letter
const letterColors = {
  S: { bg: "#0047AB", text: "#FFFFFF" },
  O: { bg: "#1A5FBC", text: "#FFFFFF" },
  L: { bg: "#346FCC", text: "#FFFFFF" },
  V: { bg: "#4E81DC", text: "#FFFFFF" },
  E: { bg: "#6591EC", text: "#FFFFFF" },
};

// Styled expand icon
const ExpandIcon = styled(({ expanded, ...props }) => 
  expanded ? (
    <ExpandLessIcon {...props} />
  ) : (
    <ExpandMoreIcon {...props} />
  )
)(({ theme, expanded }) => ({
  transition: "transform 0.3s",
  transform: expanded ? "rotate(0deg)" : "rotate(0deg)",
}));

const SolveFrameworkModal = ({ open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [expandedLetter, setExpandedLetter] = useState(null);
  const [activeTab, setActiveTab] = useState("description");

  // Toggle expansion for a letter
  const handleToggle = (letter) => {
    setExpandedLetter(expandedLetter === letter ? null : letter);
    // Reset active tab when changing letters
    setActiveTab("description");
  };

  // Get letter content based on active tab
  const getLetterContent = (letter, content) => {
    switch (activeTab) {
      case "questions":
        return (
          <List disablePadding>
            {content.questions.map((question, qIndex) => (
              <ListItem key={qIndex} sx={{ py: 0.5 }}>
                <ListItemText
                  primary={`• ${question}`}
                  primaryTypographyProps={{
                    sx: {
                      fontFamily: "Montserrat, sans-serif",
                      fontWeight: 400,
                    },
                  }}
                />
              </ListItem>
            ))}
          </List>
        );
      case "example":
        return (
          <Typography
            variant="body1"
            sx={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 400,
              backgroundColor: COLORS.gray.light,
              p: 2,
              borderRadius: "4px",
              whiteSpace: "pre-line",
            }}
          >
            {content.example}
          </Typography>
        );
      case "tip":
        return (
          <Typography
            variant="body1"
            sx={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 400,
              fontStyle: "italic",
              borderLeft: `4px solid ${letterColors[letter].bg}`,
              pl: 2,
            }}
          >
            {content.tip}
          </Typography>
        );
      default: // description
        return (
          <Typography
            variant="body1"
            sx={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 400,
            }}
          >
            {content.description}
          </Typography>
        );
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="solve-modal-title">
      <Paper
        elevation={24}
        sx={{
          ...modalStyle(theme),
          backgroundColor: COLORS.secondary,
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: COLORS.primary,
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Modal Title */}
        <Typography
          id="solve-modal-title"
          variant="h4"
          component="h2"
          gutterBottom
          sx={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 700,
            color: COLORS.primary,
            mb: 1,
          }}
        >
          S.O.L.V.E Framework
        </Typography>
        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 500,
            color: COLORS.primary,
            mb: 3,
          }}
        >
          A practical approach to breaking down and solving coding problems effectively.
        </Typography>
        <Divider sx={{ my: 2, backgroundColor: COLORS.accent }} />

        {/* Letter Cards */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {Object.entries(solveContent).map(([letter, content], index) => (
            <Grid item xs={12} key={letter}>
              <Card
                elevation={expandedLetter === letter ? 3 : 1}
                sx={{
                  mb: 1,
                  borderRadius: "8px",
                  overflow: "visible",
                  transition: "all 0.3s ease",
                  border: expandedLetter === letter ? `2px solid ${letterColors[letter].bg}` : "none",
                }}
              >
                <CardActionArea onClick={() => handleToggle(letter)}>
                  <CardContent
                    sx={{
                      p: 2,
                      "&:last-child": { pb: 2 },
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {/* Letter Chip */}
                      <Chip
                        label={letter}
                        sx={{
                          backgroundColor: letterColors[letter].bg,
                          color: letterColors[letter].text,
                          fontWeight: "bold",
                          fontSize: "1.2rem",
                          height: 36,
                          width: 36,
                          mr: 2,
                        }}
                      />
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontFamily: "Montserrat, sans-serif",
                            fontWeight: 600,
                          }}
                        >
                          {content.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: "Montserrat, sans-serif",
                            fontStyle: "italic",
                          }}
                        >
                          {content.tagline}
                        </Typography>
                      </Box>
                    </Box>
                    <ExpandIcon expanded={expandedLetter === letter} />
                  </CardContent>
                </CardActionArea>

                {/* Collapsible Content */}
                <Collapse in={expandedLetter === letter} timeout="auto" unmountOnExit>
                  <Divider />
                  <CardContent sx={{ p: 3 }}>
                    {/* Tab Navigation */}
                    <Box
                      sx={{
                        display: "flex",
                        mb: 2,
                        borderBottom: `1px solid ${COLORS.gray.light}`,
                      }}
                    >
                      <Box
                        onClick={() => setActiveTab("description")}
                        sx={{
                          px: 2,
                          py: 1,
                          cursor: "pointer",
                          borderBottom:
                            activeTab === "description"
                              ? `3px solid ${letterColors[letter].bg}`
                              : "3px solid transparent",
                          fontWeight: activeTab === "description" ? 600 : 400,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          variant="button"
                          sx={{
                            fontFamily: "Montserrat, sans-serif",
                            textTransform: "none",
                          }}
                        >
                          Overview
                        </Typography>
                      </Box>
                      <Box
                        onClick={() => setActiveTab("questions")}
                        sx={{
                          px: 2,
                          py: 1,
                          cursor: "pointer",
                          borderBottom:
                            activeTab === "questions"
                              ? `3px solid ${letterColors[letter].bg}`
                              : "3px solid transparent",
                          fontWeight: activeTab === "questions" ? 600 : 400,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <HelpOutlineIcon
                          fontSize="small"
                          sx={{ mr: 0.5, fontSize: "1rem" }}
                        />
                        <Typography
                          variant="button"
                          sx={{
                            fontFamily: "Montserrat, sans-serif",
                            textTransform: "none",
                          }}
                        >
                          Questions
                        </Typography>
                      </Box>
                      <Box
                        onClick={() => setActiveTab("example")}
                        sx={{
                          px: 2,
                          py: 1,
                          cursor: "pointer",
                          borderBottom:
                            activeTab === "example"
                              ? `3px solid ${letterColors[letter].bg}`
                              : "3px solid transparent",
                          fontWeight: activeTab === "example" ? 600 : 400,
                          display: "flex",
                                          alignItems: "center",
                                        }}
                                        >
                                          <CodeIcon
                                            fontSize="small"
                                            sx={{ mr: 0.5, fontSize: "1rem" }}
                                          />
                                          <Typography
                                            variant="button"
                                            sx={{
                                              fontFamily: "Montserrat, sans-serif",
                                              textTransform: "none",
                                            }}
                                          >
                                            Example
                                          </Typography>
                                        </Box>
                                        <Box
                                          onClick={() => setActiveTab("tip")}
                                          sx={{
                                            px: 2,
                                            py: 1,
                                            cursor: "pointer",
                                            borderBottom:
                                              activeTab === "tip"
                                                ? `3px solid ${letterColors[letter].bg}`
                                                : "3px solid transparent",
                                            fontWeight: activeTab === "tip" ? 600 : 400,
                                            display: "flex",
                                            alignItems: "center",
                                          }}
                                        >
                                          <TipsAndUpdatesIcon
                                            fontSize="small"
                                            sx={{ mr: 0.5, fontSize: "1rem" }}
                                          />
                                          <Typography
                                            variant="button"
                                            sx={{
                                              fontFamily: "Montserrat, sans-serif",
                                              textTransform: "none",
                                            }}
                                          >
                                            Pro Tip
                                          </Typography>
                                        </Box>
                                      </Box>
                  
                                      {/* Tab Content with Fade Transition */}
                                      <Fade in={true} timeout={500}>
                                        <Box sx={{ pt: 1 }}>
                                          {getLetterContent(letter, content)}
                                        </Box>
                                      </Fade>
                                    </CardContent>
                                  </Collapse>
                                </Card>
                              </Grid>
                            ))}
                          </Grid>
                  
                          {/* Quick Navigation at Bottom */}
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              mt: 4,
                              gap: 1,
                            }}
                          >
                            {Object.keys(solveContent).map((letter) => (
                              <Chip
                                key={letter}
                                label={letter}
                                onClick={() => {
                                  handleToggle(letter);
                                  // Scroll to the card if needed
                                  document
                                    .getElementById(`solve-letter-${letter}`)
                                    ?.scrollIntoView({ behavior: "smooth", block: "center" });
                                }}
                                sx={{
                                  backgroundColor:
                                    expandedLetter === letter
                                      ? letterColors[letter].bg
                                      : COLORS.gray.light,
                                  color:
                                    expandedLetter === letter
                                      ? letterColors[letter].text
                                      : COLORS.primary,
                                  fontWeight: "bold",
                                  cursor: "pointer",
                                  transition: "all 0.3s ease",
                                  "&:hover": {
                                    backgroundColor:
                                      expandedLetter === letter
                                        ? letterColors[letter].bg
                                        : `${letterColors[letter].bg}33`,
                                  },
                                }}
                              />
                            ))}
                          </Box>
                        </Paper>
                      </Modal>
                    );
                  };
                  
                  export default SolveFrameworkModal;