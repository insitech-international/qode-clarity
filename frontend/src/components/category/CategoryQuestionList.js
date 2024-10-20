import React from "react";
import { Link } from "react-router-dom";
import Pagination from "../../components/Pagination";
import {
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  Typography,
  Button,
  Paper,
  Chip,
} from "@mui/material";

const headingColors = [
  "#1E88E5",
  "#43A047",
  "#FB8C00",
  "#8E24AA",
  "#D81B60",
  "#3949AB",
];

const CategoryQuestionList = ({
  questionsBySubcategory,
  category,
  page,
  setPage,
  perPage = 10,
  totalCount,
}) => {
  const totalPages = Math.ceil(totalCount / perPage);

  const getHeadingColor = (index) =>
    headingColors[index % headingColors.length];

  const renderQuestion = (question) => (
    <ListItem
      key={question._id.$oid || question.question_id}
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingY: 2,
        "&:hover": {
          backgroundColor: "rgba(0, 0, 0, 0.04)",
        },
      }}
    >
      <ListItemText
        primary={question.title || question.content.split("\n")[0]}
        primaryTypographyProps={{
          variant: "subtitle1",
          sx: {
            fontWeight: "medium",
          },
        }}
        secondary={
          <Box sx={{ display: "flex", mt: 1 }}>
            <Chip
              label={question.difficulty || "N/A"}
              size="small"
              color={
                question.difficulty === "Hard"
                  ? "error"
                  : question.difficulty === "Medium"
                  ? "warning"
                  : "success"
              }
              sx={{ mr: 1 }}
            />
            {question.tags &&
              question.tags.map((tag, index) => (
                <Chip key={index} label={tag} size="small" sx={{ mr: 1 }} />
              ))}
          </Box>
        }
      />
      <Button
        component={Link}
        to={`/question/${question.question_id}`}
        variant="outlined"
        size="small"
        sx={{ ml: 2, whiteSpace: "nowrap" }}
      >
        View Details
      </Button>
    </ListItem>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: "bold", color: "primary.main" }}
      >
        {category
          ? `${category.replace(/_/g, " ")} Questions (${totalCount})`
          : `All Questions (${totalCount})`}
      </Typography>

      {Object.entries(questionsBySubcategory).map(
        ([subcategory, questions], index) => (
          <Paper
            key={subcategory}
            elevation={3}
            sx={{ mb: 4, overflow: "hidden" }}
          >
            <Typography
              variant="h5"
              sx={{
                color: getHeadingColor(index),
                backgroundColor: "rgba(0, 0, 0, 0.03)",
                p: 2,
                fontWeight: "medium",
              }}
            >
              {subcategory}
            </Typography>
            <List disablePadding>{questions.map(renderQuestion)}</List>
          </Paper>
        )
      )}

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
