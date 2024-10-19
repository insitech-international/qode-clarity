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
} from "@mui/material";

// Array of colors to alternate for subcategory headings
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

  // Helper to get a color based on index
  const getHeadingColor = (index) =>
    headingColors[index % headingColors.length];

  const renderQuestion = (question) => (
    <ListItem
      key={question._id.$oid || question.question_id}
      sx={{
        display: "flex",
        justifyContent: "space-between",
        paddingY: 1.5,
        "&:hover": {
          backgroundColor: "rgba(0, 0, 0, 0.04)",
        },
      }}
    >
      <ListItemText
        primary={question.title || question.content.split("\n")[0]} // Fallback to first line of content
        primaryTypographyProps={{
          variant: "h6",
          sx: {
            textDecoration: "none",
            color: "inherit",
          },
        }}
      />
      <Button
        component={Link}
        to={`/question/${question.question_id}`}
        variant="outlined"
        size="small"
        sx={{ marginLeft: 2 }}
      >
        View Details
      </Button>
    </ListItem>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {category
          ? `${category.replace(/_/g, " ")} Questions (${totalCount})`
          : `Number of Questions: ${totalCount}`}
      </Typography>

      {Object.entries(questionsBySubcategory).map(
        ([subcategory, questions], index) => (
          <Box key={subcategory} mb={4}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ color: getHeadingColor(index) }} // Assign color based on index
            >
              {subcategory}
            </Typography>
            <List disablePadding>
              {questions.map(renderQuestion)}
              <Divider />
            </List>
          </Box>
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
