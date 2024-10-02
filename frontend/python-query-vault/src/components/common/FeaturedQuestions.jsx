import React from "react";
import styled from "styled-components";

const SectionWrapper = styled.section`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const QuestionList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`;

const QuestionCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem;

  h3 {
    margin-bottom: 0.5rem;
  }
`;

const FeaturedQuestions = ({ questions = [] }) => {
  if (questions.length === 0) {
    return (
      <SectionWrapper>
        <h2>Featured Questions</h2>
        <p>No featured questions available at the moment.</p>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper>
      <h2>Featured Questions</h2>
      <QuestionList>
        {questions.slice(0, 10).map((question) => (
          <QuestionCard key={question.id}>
            <h3>{question.title}</h3>
            <p>{question.description}</p>
          </QuestionCard>
        ))}
      </QuestionList>
    </SectionWrapper>
  );
};

export default FeaturedQuestions;