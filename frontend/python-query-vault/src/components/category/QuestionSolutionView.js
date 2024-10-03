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
      <Section title="Scenario" content={question.scenario} />
      <AccordionSection title="Real-life Domains">
        <Box display="flex" gap={1} flexWrap="wrap">
          {question.real_life_domains.map((domain, index) => (
            <Chip key={index} label={domain} variant="outlined" />
          ))}
        </Box>
      </AccordionSection>
      <AccordionSection title="Task" content={question.task} />
      <AccordionSection title="Constraints">
        <ul>
          {question.constraints.map((constraint, index) => (
            <li key={index}>
              <Typography variant="body2">{constraint}</Typography>
            </li>
          ))}
        </ul>
      </AccordionSection>
      <AccordionSection title="Examples">
        {question.examples.map((example, index) => (
          <Example key={index} example={example} index={index} />
        ))}
      </AccordionSection>
    </CardContent>
  </Card>
);

const SolutionSection = ({ solution, tabValue, handleTabChange }) => {
  const tabDescriptions = {
    Classification:
      "This section explains why this problem is classified as [category/subcategory] and what impact this classification has on our approach",
    Relevance:
      "This section elaborates on why this problem is important in the specified domain and why understanding its complexity is crucial for effective solutions.",
    Approach:
      "This section discusses why we choose the given approach for this problem and how this choice influences our implementation strategy.",
    Constraint:
      "This section explains how the given constraints affect our solution approach and how these constraints shape our strategy for managing edge cases.",
    Code: "This section outlines the code implementation steps, considering the problem's complexity and chosen approach",
  };

  const formatContent = (content) => {
    return content.split("\n").map((line, index) => (
      <Typography key={index} variant="body1" paragraph>
        {line.trim()}
      </Typography>
    ));
  };

  const formatApproach = (approach) => {
    const sections = approach.split("\n\n");
    return (
      <>
        {sections.map((section, index) => {
          if (section.includes(":")) {
            const [title, content] = section.split(":");
            return (
              <Box key={index} mb={2}>
                <Typography variant="h6">{title.trim()}</Typography>
                {formatContent(content)}
              </Box>
            );
          }
          return formatContent(section);
        })}
      </>
    );
  };

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
        >
          {Object.keys(tabDescriptions).map((tab, index) => (
            <Tooltip key={index} title={tabDescriptions[tab]} arrow>
              <Tab
                label={tab}
                sx={{
                  maxWidth: 150,
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
              />
            </Tooltip>
          ))}
        </Tabs>
        <Box mt={2}>
          {tabValue === 0 && formatContent(solution.problem_classification)}
          {tabValue === 1 && formatContent(solution.real_world_relevance)}
          {tabValue === 2 && formatApproach(solution.approach_selection)}
          {tabValue === 3 && formatApproach(solution.constraint_influence)}
          {tabValue === 4 && (
            <SyntaxHighlighter language="python" style={vscDarkPlus}>
              {solution.code_design}
            </SyntaxHighlighter>
          )}
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
  <Accordion defaultExpanded={title === "Scenario"}>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography variant="h6">{title}</Typography>
    </AccordionSummary>
    <AccordionDetails>
      {content ? <Typography variant="body1">{content}</Typography> : children}
    </AccordionDetails>
  </Accordion>
);

const Example = ({ example, index }) => (
  <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
    <Typography variant="subtitle2" gutterBottom>
      Example {index + 1}:
    </Typography>
    <Box bgcolor="grey.100" p={1} borderRadius={1} mb={1}>
      <Typography variant="body2">Input: {example.input}</Typography>
      <Typography variant="body2">Output: {example.output}</Typography>
    </Box>
    <Typography variant="body2">Explanation: {example.explanation}</Typography>
  </Paper>
);

export default QuestionSolutionView;
