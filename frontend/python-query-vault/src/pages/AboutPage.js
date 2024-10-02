// AboutUs.js
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
        <Title>About Us</Title>
        <Paragraph>
          InsiTech International is a leading technology firm dedicated to
          providing innovative solutions that enhance the way businesses
          operate. Our mission is to empower organizations through the
          integration of cutting-edge technologies and strategic insights.
        </Paragraph>
        <Paragraph>
          One of our prominent projects, Python Query Vault, aims to simplify
          data management and enhance security protocols. We strive to create
          user-friendly tools that cater to the diverse needs of our clients.
        </Paragraph>
        <Paragraph>
          Our team comprises experts from various fields, working
          collaboratively to drive progress and deliver exceptional results. We
          believe in a customer-centric approach, ensuring that our solutions
          are tailored to meet the unique requirements of each client.
        </Paragraph>
        <Paragraph>
          At InsiTech, we value integrity, innovation, and excellence, and we
          are committed to maintaining the highest standards in everything we
          do. Join us on our journey to transform the future of technology.
        </Paragraph>
      </Card>
    </AboutContainer>
  );
};

export default AboutPage;
