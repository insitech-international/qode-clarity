import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, Typography, Chip, Grid } from "@mui/material";

const FeaturedQuestions = ({ questions = [] }) => {
  if (questions.length === 0) {
    return (
      <section>
        <Typography variant="h4" gutterBottom>
          Featured Questions
        </Typography>
        <Typography variant="body1">No featured questions available at the moment.</Typography>
      </section>
    );
  }

  return (
    <section>
      <Typography variant="h4" gutterBottom>
        Featured Questions
      </Typography>
      <Grid container spacing={3}>
        {questions.map((question) => (
          <Grid item xs={12} sm={6} md={4} key={question.id}>
            <Card variant="outlined" sx={{ height: '100%', transition: '0.3s', '&:hover': { boxShadow: 6 } }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {question.title}
                </Typography>
                <Chip
                  label={question.difficulty}
                  color={question.difficulty === "Hard" ? "error" : question.difficulty === "Medium" ? "warning" : "success"}
                  size="small"
                  sx={{ marginBottom: '1rem' }}
                />
                <Typography variant="body2" paragraph>
                  {question.problem_versions[0].description.slice(0, 100)}...
                </Typography>
                <div>
                  {question.real_life_domains.slice(0, 3).map((domain, index) => (
                    <Chip key={index} label={domain} variant="outlined" size="small" sx={{ marginRight: '0.5rem', marginBottom: '0.5rem' }} />
                  ))}
                </div>
                <Link to={`/question/${question.id}`} style={{ textDecoration: 'none', color: '#1976d2', marginTop: '1rem', display: 'inline-block' }}>
                  View Details
                </Link>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </section>
  );
};

export default FeaturedQuestions;