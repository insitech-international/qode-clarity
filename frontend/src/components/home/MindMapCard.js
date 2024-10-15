import React from "react";
import styled from "styled-components";

const CardWrapper = styled.div`
  width: 100%;
  height: 160px;
  background-color: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
`;

const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const MindMapCard = ({ categoryId }) => {
  return (
    <CardWrapper>
      <Image
        src={`/api/placeholder/200/150?text=Mindmap+for+${categoryId}`}
        alt={`Mindmap for ${categoryId}`}
      />
    </CardWrapper>
  );
};

export default MindMapCard;
