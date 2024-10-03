import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import QuestionList from "../components/category/CategoryQuestionList";
import { useQuestionData } from "../hooks/useQuestionData";
import {
  Typography,
  Container,
  CircularProgress,
  Box,
  Pagination,
} from "@mui/material";

const CategoryPage = () => {
  const { categoryName } = useParams(); // Capture category name from URL
  const { questions, loading, error, setPage, page } = useQuestionData(); // Fetch questions using the hook

  useEffect(() => {
    setPage(1); // Reset to the first page when the category changes
  }, [categoryName, setPage]);

  const handlePageChange = (event, value) => {
    setPage(value); // Change the page when the user interacts with pagination
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  return (
    <Container>
      <Typography variant="h3" gutterBottom>
        {categoryName.replace(/-/g, " ")} {/* Display category name nicely */}
      </Typography>
      <QuestionList questions={questions} category={categoryName} />{" "}
      {/* Pass categoryName as a prop */}
      {questions.length > 10 && (
        <Box mt={4} display="flex" justifyContent="center">
          <Pagination
            count={Math.ceil(questions.length / 10)} // Pagination logic
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Container>
  );
};

export default CategoryPage;
