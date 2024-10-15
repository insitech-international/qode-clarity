import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";

const QuestionDetails = ({ question }) => {
  if (!question) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6">Question details not available</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ maxWidth: 800, margin: "auto", mt: 4 }}>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          {question.title || "Untitled Question"}
        </Typography>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Chip
            label={`Difficulty: ${question.difficulty || "Unknown"}`}
            color="primary"
          />
          <Chip
            label={`Category: ${question.category || "Uncategorized"}`}
            color="secondary"
          />
        </Box>

        <Section title="Problem Description">
          <Typography variant="body1">
            {question.problem_description || "No description available"}
          </Typography>
        </Section>

        {question.real_life_domains &&
          question.real_life_domains.length > 0 && (
            <Section title="Real-life Domains">
              <Box display="flex" gap={1} flexWrap="wrap">
                {question.real_life_domains.map((domain, index) => (
                  <Chip key={index} label={domain} variant="outlined" />
                ))}
              </Box>
            </Section>
          )}

        {question.problem_versions && question.problem_versions.length > 0 && (
          <Section title="Problem Versions">
            {question.problem_versions.map((version, index) => (
              <Box key={index} mb={2}>
                <Typography variant="h6" gutterBottom>{`Version ${
                  index + 1
                }`}</Typography>
                <Typography variant="body1">{version}</Typography>
              </Box>
            ))}
          </Section>
        )}

        {question.constraints && question.constraints.length > 0 && (
          <Section title="Constraints">
            <List>
              {question.constraints.map((constraint, index) => (
                <ListItem key={index}>
                  <ListItemText primary={constraint} />
                </ListItem>
              ))}
            </List>
          </Section>
        )}

        {question.notes && question.notes.length > 0 && (
          <Section title="Notes">
            <List>
              {question.notes.map((note, index) => (
                <ListItem key={index}>
                  <ListItemText primary={note} />
                </ListItem>
              ))}
            </List>
          </Section>
        )}
      </CardContent>
    </Card>
  );
};

const Section = ({ title, children }) => (
  <Box mb={4}>
    <Typography variant="h5" gutterBottom>
      {title}
    </Typography>
    <Divider sx={{ mb: 2 }} />
    {children}
  </Box>
);

export default QuestionDetails;
