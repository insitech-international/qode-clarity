import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuestionData } from "../hooks/useQuestionData";
import QuestionSolutionView from "../components/category/QuestionSolutionView";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { Box, Typography, Button, Container, Paper } from "@mui/material";

const QuestionPage = () => {
  const { id } = useParams();
  const { fetchQuestionDetails, fetchSolution } = useQuestionData();
  const [question, setQuestion] = useState(null);
  const [solution, setSolution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [questionData, solutionData] = await Promise.all([
          fetchQuestionDetails(id),
          fetchSolution(id),
        ]);
        setQuestion(questionData);
        setSolution(solutionData);
      } catch (err) {
        console.error("Error loading question or solution:", err);
        setError(
          "Failed to load question or solution. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, fetchQuestionDetails, fetchSolution]);

  if (loading) return <LoadingSpinner />;

  if (error || !question || !solution) {
    return (
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ mt: 4, p: 3, textAlign: "center" }}>
          <Typography variant="h6" color="error" gutterBottom>
            {error || "Question or solution not found."}
          </Typography>
          <Button component={Link} to="/" variant="contained" color="primary">
            Back to Home
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h4" gutterBottom>
          {question.title}
        </Typography>
        <QuestionSolutionView question={question} solution={solution} />
        <Box mt={4} display="flex" justifyContent="center">
          <Button component={Link} to="/" variant="contained" color="primary">
            Back to Home
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default QuestionPage;
