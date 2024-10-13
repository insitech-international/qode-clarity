// components/FeaturedQuestions.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, Typography, Chip, Grid, Box } from "@mui/material";
import { useQuestionData } from "../../hooks/useQuestionData";

const FeaturedQuestions = () => {
  const { fetchFeaturedQuestions, loading, error } = useQuestionData();
  const [categorizedQuestions, setCategorizedQuestions] = useState({});

  useEffect(() => {
    const loadFeaturedQuestions = async () => {
      try {
        const questions = await fetchFeaturedQuestions();
        // Flatten the nested structure
        const flattenedQuestions = {};
        Object.values(questions).forEach(category => {
          category.forEach(question => {
            if (!flattenedQuestions[question.category]) {
              flattenedQuestions[question.category] = [];
            }
            flattenedQuestions[question.category].push(question);
          });
        });
        setCategorizedQuestions(flattenedQuestions);
      } catch (error) {
        console.error("Error fetching featured questions:", error);
      }
    };
    loadFeaturedQuestions();
  }, [fetchFeaturedQuestions]);
  
  if (loading) {
    return <Typography>Loading featured questions...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (Object.keys(categorizedQuestions).length === 0) {
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
      {Object.entries(categorizedQuestions).map(([category, questions]) => (
        <Box key={category} mb={4}>
          <Typography variant="h5" gutterBottom>
            {category}
          </Typography>
          <Grid container spacing={3}>
            {questions.map((question) => (
              <Grid item xs={12} sm={6} md={4} key={question.question_id}>
                <Card variant="outlined" sx={{ height: '100%', transition: '0.3s', '&:hover': { boxShadow: 6 } }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {question.title || "Untitled Question"}
                    </Typography>
                    {question.subcategory && (
                      <Chip
                        label={`Subcategory: ${question.subcategory}`}
                        color="success"
                        size="small"
                        sx={{ marginBottom: '1rem' }}
                      />
                    )}
                    {question.difficulty && (
                      <Chip
                        label={`Difficulty: ${question.difficulty}`}
                        color={question.difficulty === "Hard" ? "error" : question.difficulty === "Medium" ? "warning" : "success"}
                        size="small"
                        sx={{ marginBottom: '1rem' }}
                      />
                    )}
                    <Typography variant="body2" paragraph>
                      {question.problem_description
                      ? `${question.problem_description.slice(0, 150)}...`
                      : "No description available."}
                    </Typography>
                    <div>
                      {question.real_life_domains && question.real_life_domains.slice(0, 3).map((domain, index) => (
                        <Chip key={index} label={domain} variant="outlined" size="small" sx={{ marginRight: '0.5rem', marginBottom: '0.5rem' }} />
                      ))}
                    </div>
                    <Link to={`/question/${question.question_id}`} style={{ textDecoration: 'none', color: '#1976d2', marginTop: '1rem', display: 'inline-block' }}>
                      View Details
                    </Link>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </section>
  );
};

export default FeaturedQuestions;
