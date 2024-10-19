import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Tabs,
  Paper,
  Tab,
  Grid,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const CombinedQuestionSolutionView = ({ question, solution }) => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} lg={6}>
        {question ? (
          <QuestionCard question={question} />
        ) : (
          <Typography variant="h6">No question data available</Typography>
        )}
      </Grid>
      <Grid item xs={12} lg={6}>
        {solution ? (
          <SolutionCard
            solution={solution}
            tabValue={tabValue}
            handleTabChange={handleTabChange}
          />
        ) : (
          <Typography variant="h6">No solution data available</Typography>
        )}
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
        <Paper
          elevation={2}
          sx={{
            padding: "4px 8px",
            backgroundColor: "primary.light",
            color: "primary.contrastText",
          }}
        >
          <Typography variant="body1">ID: {question.question_id}</Typography>
        </Paper>

        <Box
          sx={{
            flex: 1,
            mx: 2,
            padding: "8px",
            backgroundColor: "background.paper",
            borderRadius: 1,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography
            variant="h6"
            align="center"
            sx={{ color: "primary.main", fontWeight: "bold" }}
          >
            {question.title}
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary">
            Category: {question.category} - Subcategory: {question.subcategory}
          </Typography>
        </Box>

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

      <Divider sx={{ my: 2 }} />

      <Section title="Similar Questions">
        <Box display="flex" gap={1} flexWrap="wrap">
          {question.similar_questions.map((q, index) => (
            <Chip key={index} label={q} variant="outlined" />
          ))}
        </Box>
      </Section>

      <Section title="Real-life Domains">
        <Box display="flex" gap={1} flexWrap="wrap">
          {question.real_life_domains.map((domain, index) => (
            <Chip key={index} label={domain} variant="outlined" />
          ))}
        </Box>
      </Section>

      <AccordionSection title="Problem Versions">
        {question.problem_versions.map((version, index) => (
          <Box key={index} mb={2}>
            <FormatContent content={version} />
          </Box>
        ))}
      </AccordionSection>

      <AccordionSection title="Constraints">
        <FormatContent content={question.constraints.join("\n")} />
      </AccordionSection>
    </CardContent>
  </Card>
);

const SolutionCard = ({ solution, tabValue, handleTabChange }) => {
  const tabContent = [
    {
      label: "Overview",
      content: solution.introduction,
      description:
        "This section introduces the problem, explaining its computational challenges and significance in algorithm design and data structures.",
    },
    {
      label: "Classification",
      content: solution.classification_rationale,
      description:
        "This section justifies the categorization of this problem, discussing how this classification influences our solution approach.",
    },
    {
      label: "BUCESR Framework",
      content: solution.bucesr_framework,
      isCode: true,
      description:
        "This section presents a detailed Python implementation of the approach, with explanations of key functions and their roles in solving the problem.",
    },
    {
      label: "Pythonic Implementation",
      content: solution.pythonic_implementation,
      isCode: true,
      description:
        "This section presents a detailed Python implementation of the approach, with explanations of key functions and their roles in solving the problem.",
    },
    {
      label: "Mathematical",
      content: solution.mathematical_abstraction,
      description:
        "This section formalizes the problem and solution using mathematical notation, providing a rigorous foundation for understanding the algorithm's logic.",
    },
    {
      label: "Real-world",
      content: solution.real_world_analogies,
      description:
        "This section connects the abstract problem to concrete scenarios, demonstrating how the algorithm can solve practical challenges.",
    },
    {
      label: "Storytelling Approach",
      content: solution.storytelling_approach,
      description:
        "This section x-rays the problem and tells the solution as a story to a 6 year old.",
    },
    {
      label: "Visual",
      content: solution.visual_representation,
      description:
        "This section offers a graphical depiction of the data structure or algorithm, illustrating how it efficiently manages data for our specific problem.",
    },
    {
      label: "Complexity Analysis",
      content: solution.complexity_analysis,
      isCode: true,
      description:
        "This section presents a detailed Time and Space Complexicity Analysis with a further note on possible trade-offs.",
    },
  ];

  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h5" gutterBottom sx={{ color: "secondary.main" }}>
          Solution
        </Typography>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 2 }}
        >
          {tabContent.map((tab, index) => (
            <Tooltip key={index} title={tab.description} arrow>
              <Tab
                label={tab.label}
                sx={{
                  textTransform: "none",
                  minWidth: "auto",
                  padding: "6px 12px",
                  margin: "0 4px",
                  borderRadius: "4px",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                  },
                  "&.Mui-selected": {
                    backgroundColor: "rgba(0, 0, 0, 0.08)",
                  },
                }}
              />
            </Tooltip>
          ))}
        </Tabs>
        <Box mt={2}>
          {tabContent[tabValue].isCode ? (
            <SyntaxHighlighter
              language="python"
              style={vscDarkPlus}
              wrapLines={true}
              wrapLongLines={true}
            >
              {tabContent[tabValue].content}
            </SyntaxHighlighter>
          ) : (
            <FormatContent content={tabContent[tabValue].content} />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

const FormatContent = ({ content }) => {
  const formatParagraph = (text) => {
    return text.split("\n").map((line, index) => (
      <Typography key={index} variant="body1" paragraph>
        {line.trim()}
      </Typography>
    ));
  };

  const formatList = (text) => {
    return (
      <ul style={{ paddingLeft: "20px", margin: "10px 0" }}>
        {text.split("\n").map((item, index) => (
          <li key={index}>
            <Typography variant="body1">{item.replace(/^-\s*/, "")}</Typography>
          </li>
        ))}
      </ul>
    );
  };

  const parts = content.split(/(?=(?:^|\n)- )/);
  return parts.map((part, index) =>
    part.trim().startsWith("- ") ? formatList(part) : formatParagraph(part)
  );
};

const Section = ({ title, children }) => (
  <Box mb={3}>
    <Typography variant="h6" gutterBottom sx={{ color: "primary.main" }}>
      {title}
    </Typography>
    {children}
    <Divider sx={{ mt: 2 }} />
  </Box>
);

const AccordionSection = ({ title, children }) => (
  <Accordion>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography variant="h6" sx={{ color: "primary.dark" }}>
        {title}
      </Typography>
    </AccordionSummary>
    <AccordionDetails>{children}</AccordionDetails>
  </Accordion>
);

export default CombinedQuestionSolutionView;
