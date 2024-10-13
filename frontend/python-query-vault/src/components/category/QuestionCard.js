import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Paper,
  Divider,
  AccordionSection,
} from "@mui/material";

const QuestionCard = ({ question }) => {
  console.log(`Question: ${JSON.stringify(question, null, 2)}`);

  if (!question) {
    return <Typography>No question data available</Typography>;
  }

  const renderArrayItems = (array, title) => {
    if (!array?.length) return null;

    return (
      <Section title={title}>
        <Box display="flex" gap={1} flexWrap="wrap">
          {array.map((item, index) => (
            <Chip key={index} label={item} variant="outlined" />
          ))}
        </Box>
      </Section>
    );
  };

  return (
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
            <Typography variant="body1">
              ID: {question.question_id || "N/A"}
            </Typography>
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
            <Typography variant="h6" align="center">
              {question.title || "Untitled"}
            </Typography>
            <Typography variant="body2" align="center" color="text.secondary">
              Category: {question.category || "Unknown"} - Subcategory:{" "}
              {question.subcategory || "N/A"}
            </Typography>
          </Box>

          <Chip
            label={question.difficulty || "Difficulty Unknown"}
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

        {renderArrayItems(question.similar_questions, "Similar Questions")}

        {renderArrayItems(question.real_life_domains, "Real-life Domains")}

        {renderArrayItems(question.problem_versions, "Problem Versions")}

        {renderArrayItems(question.constraints, "Constraints")}
      </CardContent>
    </Card>
  );
};

const Section = ({ title, children }) => (
  <Typography variant="h6" gutterBottom>
    {title}
  </Typography>
);

export default QuestionCard;
