import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const HeaderWrapper = styled.header`
  background-color: #2c3e50;
  color: #ecf0f1;
  padding: 1rem 0;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const Brand = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
`;

const Nav = styled.nav`
  ul {
    display: flex;
    list-style: none;
    
    li {
      margin-left: 1rem;
      
      a {
        color: #ecf0f1;
        text-decoration: none;
        transition: color 0.3s ease;
        
        &:hover {
          color: #3498db;
        }
      }
    }
  }
`;

const Header = () => {
  return (
    <HeaderWrapper>
      <HeaderContainer>
        <Brand>Code Clarity</Brand>
        <Nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </Nav>
      </HeaderContainer>
    </HeaderWrapper>
  );
};

export default Header;