import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const SectionWrapper = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s;
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
  }
`;

const Content = styled.div`
  padding: 1rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const Description = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const SampleCard = styled.div`
  background-color: #f8f9fa;
  border-radius: 4px;
  padding: 0.5rem;
`;

const MindMapImage = styled.img`
  max-width: 100%;
  border-radius: 4px;
  margin-top: 1rem;
`;

const ExploreButton = styled.button`
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-weight: 600;
  margin-top: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #218838;
  }
`;

const CategorySection = ({ category }) => {
  const urlSlug = category.name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/&/g, "and");

  return (
    <SectionWrapper>
      <Link to={`/category/${urlSlug}`}>
        <Content>
          <Title>{category.name}</Title>
          <Description>{category.description}</Description>
          <Grid>
            {category.sampleQuestions.slice(0, 5).map((question, index) => (
              <SampleCard key={index}>
                <h3>{question.title}</h3>
                <p>{question.description}</p>
              </SampleCard>
            ))}
          </Grid>
          <MindMapImage
            src={`/images/mindmaps/${category.id}.svg`}
            alt={`Mindmap for ${category.name}`}
          />
          <ExploreButton>Explore</ExploreButton>
        </Content>
      </Link>
    </SectionWrapper>
  );
};

export default CategorySection;
