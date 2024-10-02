import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Ensure the container takes at least full viewport height */
`;

const StyledFooter = styled.footer`
  background-color: #2c3e50;
  color: #ecf0f1;
  padding: 2rem 0;
  width: 100%;
  margin-top: auto; /* This pushes the footer to the bottom */
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const Copyright = styled.p`
  margin-bottom: 1rem;
`;

const FooterNav = styled.nav`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const FooterLink = styled(Link)`
  color: #ecf0f1;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #3498db;
  }
`;

const SocialMediaLinks = styled.div`
  margin: 1rem 0;
`;

const SocialLink = styled.a`
  color: #ecf0f1;
  margin: 0 0.5rem;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #3498db;
  }
`;

const ParentCompany = styled.p`
  font-size: 0.9rem;
  color: #bdc3c7;
`;

const Footer = () => {
  return (
    <AppContainer>
      <StyledFooter>
        <FooterContent>
          <Copyright>© 2024 Python Query Vault. All rights reserved.</Copyright>
          <FooterNav>
            <FooterLink to="/privacy">Privacy Policy</FooterLink>
            <FooterLink to="/terms">Terms of Service</FooterLink>
            <FooterLink to="/contact">Contact Us</FooterLink>
            <FooterLink to="/about">About Us</FooterLink>
          </FooterNav>
          <SocialMediaLinks>
            <SocialLink href="https://twitter.com/" target="_blank">
              Twitter
            </SocialLink>
            <SocialLink href="https://facebook.com/" target="_blank">
              Facebook
            </SocialLink>
            <SocialLink href="https://instagram.com/" target="_blank">
              Instagram
            </SocialLink>
            <SocialLink href="https://linkedin.com/" target="_blank">
              LinkedIn
            </SocialLink>
          </SocialMediaLinks>
          <ParentCompany>A project of InsiTech International</ParentCompany>
        </FooterContent>
      </StyledFooter>
    </AppContainer>
  );
};

export default Footer;
