// Card.js
import React from "react";
import styled from "styled-components";

const CardContainer = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin: 1.5rem 0;
  padding: 2rem;
`;

const Card = ({ children }) => {
  return <CardContainer>{children}</CardContainer>;
};

export default Card;
