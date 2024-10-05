import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Tabs,
  Tab,
  Grid,
  Divider,
  Paper,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const QuestionSolutionView = ({ question, solution }) => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <QuestionCard question={question} />
      </Grid>
      <Grid item xs={12} md={6}>
        <SolutionSection
          solution={solution}
          tabValue={tabValue}
          handleTabChange={handleTabChange}
        />
      </Grid>
    </Grid>
  );
};

const QuestionCard = ({ question }) => (
  <Card elevation={3}>
    <CardContent>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5">{question.title}</Typography>
        <Chip
          label={question.difficulty}
          color={
            question.difficulty === "Hard"
              ? "error"
              : question.difficulty === "Medium"
              ? "warning"
              : "success"
          }
        />
      </Box>
      <Section
        title="Category"
        content={`${question.category} - ${question.subcategory}`}
      />
      <Section title="Similar Questions">
        <Typography variant="body2">
          LeetCode: {question.similar_questions.LeetCode}
        </Typography>
        <Typography variant="body2">
          HackerRank: {question.similar_questions.HackerRank}
        </Typography>
      </Section>
      <AccordionSection title="Real-life Domains">
        <Box display="flex" gap={1} flexWrap="wrap">
          {question.real_life_domains.map((domain, index) => (
            <Chip key={index} label={domain} variant="outlined" />
          ))}
        </Box>
      </AccordionSection>
      <AccordionSection title="Problem Versions">
        {question.problem_versions.map((version, index) => (
          <Box key={index} mb={2}>
            <Typography variant="subtitle1">{version.version_type}</Typography>
            <Typography variant="body2">{version.description}</Typography>
            {version.examples.map((example, exIndex) => (
              <Box key={exIndex} mt={1}>
                <Typography variant="body2">Input: {example.input}</Typography>
                <Typography variant="body2">
                  Output: {example.output}
                </Typography>
              </Box>
            ))}
          </Box>
        ))}
      </AccordionSection>
      <AccordionSection title="Constraints">
        <ul>
          {question.constraints.map((constraint, index) => (
            <li key={index}>
              <Typography variant="body2">{constraint}</Typography>
            </li>
          ))}
        </ul>
      </AccordionSection>
    </CardContent>
  </Card>
);

const SolutionSection = ({ solution, tabValue, handleTabChange }) => {
  const tabDescriptions = {
    "Problem Overview":
      "This section introduces the 'Count of Smaller Numbers After Self' problem, explaining its computational challenges and significance in algorithm design and data structures.",
    "Algorithm Classification":
      "This section justifies the categorization of this problem under 'Advanced Data Structure' and 'Segment Tree and BIT Manipulation', discussing how this classification influences our solution approach.",
    "Python Solution":
      "This section presents a detailed Python implementation of the Segment Tree approach, with explanations of key functions and their roles in solving the problem.",
    "Mathematical Representation":
      "This section formalizes the problem and solution using mathematical notation, providing a rigorous foundation for understanding the algorithm's logic.",
    "Real-World Applications":
      "This section connects the abstract problem to concrete scenarios in education, finance, and social settings, demonstrating how the algorithm can solve practical challenges.",
    "Analogue Comparison":
      "This section contrasts various methods for solving the problem, including brute force, mathematical, real-life scenario, analogous system, and flowchart approaches, highlighting their strengths and limitations.",
    "Visual Representation":
      "This section offers a graphical depiction of the Segment Tree data structure, illustrating how it efficiently manages data for our specific problem.",
  };

  const formatContent = (content) => {
    return content ? (
      content.split("\n").map((line, index) => (
        <Typography key={index} variant="body1" paragraph>
          {line.trim()}
        </Typography>
      ))
    ) : (
      <Typography variant="body1">Content not available</Typography>
    );
  };

  if (!solution) {
    return (
      <Typography variant="body1">Solution data is not available.</Typography>
    );
  }

  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Solution
        </Typography>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 2 }}
        >
          {Object.keys(tabDescriptions).map((tab, index) => (
            <Tooltip key={index} title={tabDescriptions[tab]} arrow>
              <Tab
                label={tab}
                sx={{
                  maxWidth: "None",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  maxWidth: "none", // Remove max width constraint
                  padding: "6px 16px", // Add some padding
                  margin: "0 4px", // Add margin between tabs
                  border: "1px solid rgba(0, 0, 0, 0.12)", // Add a light border
                  borderRadius: "4px", // Round the corners
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)", // Add hover effect
                  },
                  "&.Mui-selected": {
                    backgroundColor: "rgba(0, 0, 0, 0.08)", // Highlight selected tab
                  },
                }}
              />
            </Tooltip>
          ))}
        </Tabs>
        <Box mt={2}>
          {tabValue === 0 && formatContent(solution.introduction)}
          {tabValue === 1 && formatContent(solution.classification_reason)}
          {tabValue === 2 && (
            <SyntaxHighlighter language="python" style={vscDarkPlus}>
              {solution.pythonic_implementation}
            </SyntaxHighlighter>
          )}
          {tabValue === 3 && formatContent(solution.mathematical_abstraction)}
          {tabValue === 4 && formatContent(solution.real_world_analogies)}
          {tabValue === 5 && formatContent(solution.system_comparisons)}
          {tabValue === 6 && formatContent(solution.visual_representation)}
        </Box>
      </CardContent>
    </Card>
  );
};

const Section = ({ title, children, content }) => (
  <Box mb={3}>
    <Typography variant="h6" gutterBottom>
      {title}
    </Typography>
    {content ? <Typography variant="body1">{content}</Typography> : children}
    <Divider sx={{ mt: 2 }} />
  </Box>
);

const AccordionSection = ({ title, children, content }) => (
  <Accordion defaultExpanded={title === "Real-life Domains"}>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography variant="h6">{title}</Typography>
    </AccordionSummary>
    <AccordionDetails>
      {content ? <Typography variant="body1">{content}</Typography> : children}
    </AccordionDetails>
  </Accordion>
);

export default QuestionSolutionView;
