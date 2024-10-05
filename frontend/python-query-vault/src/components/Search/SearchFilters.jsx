import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #2980b9;
  }
`;

const top20TechCompanies = [
  "Google", "Apple", "Microsoft", "Amazon", "Facebook",
  "Netflix", "Tesla", "Twitter", "Uber", "Airbnb",
  "LinkedIn", "Salesforce", "Adobe", "Oracle", "IBM",
  "Intel", "NVIDIA", "PayPal", "Cisco", "VMware"
];

const SearchFilters = ({ onFilterChange }) => {
  const [difficulty, setDifficulty] = useState("");
  const [company, setCompany] = useState("");
  const navigate = useNavigate();

  const handleSearch = useCallback(() => {
    const searchParams = new URLSearchParams();
    if (difficulty) searchParams.set("difficulty", difficulty);
    if (company) searchParams.set("company", company);

    // Call the onFilterChange prop to update the parent component
    if (onFilterChange) {
      onFilterChange(difficulty, company);
    }

    // Navigate to the search page with the filters applied
    navigate(`/search?${searchParams.toString()}`);
  }, [difficulty, company, navigate, onFilterChange]);

  return (
    <FilterWrapper>
      <Select 
        value={difficulty} 
        onChange={(e) => setDifficulty(e.target.value)}
        aria-label="Filter by Difficulty"
      >
        <option value="">Filter by Difficulty</option>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </Select>
      <Select 
        value={company} 
        onChange={(e) => setCompany(e.target.value)}
        aria-label="Filter by Company"
      >
        <option value="">Filter by Company</option>
        {top20TechCompanies.map((company) => (
          <option key={company} value={company.toLowerCase()}>
            {company}
          </option>
        ))}
      </Select>
      <Button onClick={handleSearch}>Apply Filters</Button>
    </FilterWrapper>
  );
};

export default SearchFilters;