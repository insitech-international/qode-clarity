import React, { useState } from "react";
import styled from "styled-components";

const FilterWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Select = styled.select`
  padding: 0.5rem;
  margin-right: 0.5rem;
  border: none;
  border-radius: 4px;
`;

const SearchFilters = () => {
  const [difficulty, setDifficulty] = useState("");
  const [company, setCompany] = useState("");

  return (
    <FilterWrapper>
      <Select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
        <option value="">Filter by Difficulty</option>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </Select>
      <Select value={company} onChange={(e) => setCompany(e.target.value)}>
        <option value="">Filter by Company</option>
        {/* Add company options here */}
      </Select>
    </FilterWrapper>
  );
};

export default SearchFilters;