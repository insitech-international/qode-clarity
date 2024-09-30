import React from "react";
import CategoryDropdown from "../Search/CategoryDropdown";
import SearchFilters from "../Search/SearchFilters";

const Navbar = () => {
  return (
    <nav className="navbar">
      <CategoryDropdown />
      <SearchFilters />
    </nav>
  );
};

export default Navbar;
