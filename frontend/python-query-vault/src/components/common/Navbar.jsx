import React from "react";
import styled from "styled-components";
import CategoryDropdown from "./../Search/CategoryDropdown";
import SearchFilters from "./../Search/SearchFilters";

const NavbarWrapper = styled.div`
  background-color: #34495e;
  padding: 1rem 0;
`;

const NavbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const Navbar = () => {
  return (
    <NavbarWrapper>
      <NavbarContainer>
        <CategoryDropdown />
        <SearchFilters />
      </NavbarContainer>
    </NavbarWrapper>
  );
};

export default Navbar;