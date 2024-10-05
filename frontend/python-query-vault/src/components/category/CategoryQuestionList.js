import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import Pagination from "../../components/Pagination";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Chip,
  Grid,
  Button,
  Box,
} from "@mui/material";

const CategoryQuestionList = ({
  questions,
  category,
  page,
  setPage,
  perPage = 10,
  totalCount,
}) => {
  const normalizeCategory = (cat) => cat.replace(/_/g, " ").toLowerCase();

  const paginatedQuestions = useMemo(() => questions, [questions]);

  const totalPages = Math.ceil(totalCount / perPage);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {category
          ? `${category.replace(/_/g, " ")} Questions (${totalCount})`
          : `All Questions (${totalCount})`}
      </Typography>
      <Grid container spacing={3}>
        {paginatedQuestions.map((question) => (
          <Grid item xs={12} sm={6} lg={4} key={question.id}>
            <Card elevation={3}>
              <CardHeader
                title={question.title}
                titleTypographyProps={{ variant: "h6" }}
              />
              <CardContent>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Difficulty:{" "}
                  <Chip
                    label={question.difficulty}
                    color={
                      question.difficulty === "Hard"
                        ? "error"
                        : question.difficulty === "Medium"
                        ? "warning"
                        : "success"
                    }
                    size="small"
                  />
                </Typography>
                <Typography variant="body2" paragraph>
                  {question.problem_versions[0].description.slice(0, 100)}...
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                  {question.real_life_domains
                    .slice(0, 3)
                    .map((domain, index) => (
                      <Chip
                        key={index}
                        label={domain}
                        variant="outlined"
                        size="small"
                      />
                    ))}
                </Box>
                <Button
                  component={Link}
                  to={`/question/${question.id}`}
                  variant="contained"
                  color="primary"
                  size="small"
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {totalPages > 1 && (
        <Box mt={4} display="flex" justifyContent="center">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </Box>
      )}
    </Box>
  );
};

export default CategoryQuestionList;
