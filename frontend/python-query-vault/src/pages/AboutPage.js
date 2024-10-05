import React from "react";
import styled from "styled-components";
import Card from "../components/common/Card"; // Adjust the import path as necessary

const AboutContainer = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const Paragraph = styled.p`
  margin-bottom: 1rem;
  line-height: 1.6;
`;

const AboutPage = () => {
  return (
    <AboutContainer>
      <Card>
        <Title>
          Python Query Vault: Mastering Algorithmic Problem-Solving with Python
        </Title>
        <h3>Code to the Top with Python: The 5 Why Approach</h3>
        <Paragraph>
          Welcome to Python Query Vault, your gateway to mastering algorithmic
          problem-solving through coding challenges and real-world
          problem-solving techniques.
        </Paragraph>
        <Paragraph>
          Our platform is designed to help aspiring software engineers develop
          expertise in solving complex algorithmic queries using the 5 Why
          method.
        </Paragraph>
        <Paragraph>
          We employ the powerful 5 Why approach to delve deep into
          classification, relevance, approach, constraints, and code - essential
          skills required to tackle intricate coding challenges.
        </Paragraph>
        <Paragraph>
          Through our comprehensive collection of coding exercises and
          solutions, users can develop analytical thinking and problem-solving
          skills crucial for tackling complex algorithmic problems.
        </Paragraph>
        <Paragraph>
          Our mission is to empower future technologists with the coding skills
          and analytical thinking required to solve real-world algorithmic
          challenges.
        </Paragraph>
        <Paragraph>
          Join us in revolutionizing the way developers approach and solve
          complex algorithmic problems, shaping the future of coding innovations
          together.
        </Paragraph>
      </Card>
    </AboutContainer>
  );
};

export default AboutPage;
