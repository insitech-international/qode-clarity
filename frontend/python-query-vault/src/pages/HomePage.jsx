import React from "react";
import styled from "styled-components";
import CategoryCarousel from "../components/category/CategoryCarousel";
import FeaturedQuestions from "../components/common/FeaturedQuestions";
import { useQuestionData, useCategories } from "../hooks/useQuestionData";

const HeroSection = styled.section`
  background-color: #3498db;
  color: white;
  text-align: center;
  padding: 5rem 1rem;
  h1 {
    font-size: 3rem;
    margin-bottom: 1.5rem;
  }
  p {
    font-size: 1.4rem;
    max-width: 800px;
    margin: 0 auto;
  }
`;

const HomePage = () => {
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const { questions, loading: questionsLoading, error: questionsError } = useQuestionData(1, 10);

  return (
    <>
      <HeroSection>
        <h1>Welcome to Python Query Vault</h1>
        <p>Unlock the power of Python with our comprehensive collection of coding challenges and solutions.</p>
      </HeroSection>
      
      {categoriesLoading ? (
        <p>Loading categories...</p>
      ) : categoriesError ? (
        <p>Error loading categories: {categoriesError}</p>
      ) : (
        <CategoryCarousel categories={categories} />
      )}
      
      {questionsLoading ? (
        <p>Loading featured questions...</p>
      ) : questionsError ? (
        <p>Error loading featured questions: {questionsError}</p>
      ) : (
        <FeaturedQuestions questions={questions} />
      )}
    </>
  );
};

export default HomePage;