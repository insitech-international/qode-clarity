import React from "react";
import { Card, CardContent, Typography, Chip, Box } from "@mui/material";

const QuestionDetails = ({ question }) => {
  return (
    <Card sx={{ maxWidth: 800, margin: "auto", mt: 4, boxShadow: 3 }}>
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

        <Section title="Scenario">
          <Typography variant="body1">{question.scenario}</Typography>
        </Section>

        <Section title="Real-life Domains">
          <Box display="flex" gap={1} flexWrap="wrap">
            {question.real_life_domains.map((domain, index) => (
              <Chip key={index} label={domain} variant="outlined" />
            ))}
          </Box>
        </Section>

        <Section title="Task">
          <Typography variant="body1">{question.task}</Typography>
        </Section>

        <Section title="Constraints">
          <ul>
            {question.constraints.map((constraint, index) => (
              <li key={index}>
                <Typography variant="body2">{constraint}</Typography>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Examples">
          {question.examples.map((example, index) => (
            <Box key={index} mb={4}>
              <Typography variant="subtitle1" gutterBottom>
                Example {index + 1}
              </Typography>
              <Box p={2} bgcolor="grey.100" borderRadius={1} mb={2}>
                <Typography variant="body2">
                  <strong>Input:</strong> {JSON.stringify(example.input)}
                </Typography>
                <Typography variant="body2">
                  <strong>Output:</strong> {JSON.stringify(example.output)}
                </Typography>
              </Box>
              <Typography variant="body2">
                <strong>Explanation:</strong> {example.explanation}
              </Typography>
            </Box>
          ))}
        </Section>
      </CardContent>
    </Card>
  );
};

const Section = ({ title, children }) => (
  <Box mb={4}>
    <Typography variant="h6" gutterBottom>
      {title}
    </Typography>
    {children}
  </Box>
);

export default QuestionDetails;
