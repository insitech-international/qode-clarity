import React, { useState } from "react";

const SearchFilters = () => {
  const [difficulty, setDifficulty] = useState("");
  const [company, setCompany] = useState("");
  const [keywords, setKeywords] = useState("");

  return (
    <div className="search-filters">
      <div className="filter-section">
        <label htmlFor="difficulty">Difficulty:</label>
        <select
          id="difficulty"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="">Any</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      <div className="filter-section">
        <label htmlFor="company">Company:</label>
        <input
          type="text"
          id="company"
          placeholder="Filter by company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>

      <div className="filter-section">
        <label htmlFor="keywords">Keywords:</label>
        <input
          type="text"
          id="keywords"
          placeholder="Search by keyword"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SearchFilters;
