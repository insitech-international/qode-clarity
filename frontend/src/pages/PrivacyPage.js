// PrivacyPolicy.js
import React from "react";
import styled from "styled-components";
import Card from "./../components/common/Card"; // Adjust the import path as necessary

const PrivacyContainer = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const Subtitle = styled.h2`
  font-size: 1.8rem;
  margin: 1.5rem 0 0.5rem;
`;

const Paragraph = styled.p`
  margin-bottom: 1rem;
  line-height: 1.6;
`;

const PrivacyPolicy = () => {
  return (
    <PrivacyContainer>
      <Card>
        <Title>Privacy Policy</Title>
        <Paragraph>
          At InsiTech International, we are committed to protecting your
          privacy. This Privacy Policy outlines how we collect, use, and
          safeguard your information when you use our services, including the
          Python Query Vault project.
        </Paragraph>

        <Subtitle>Information We Collect</Subtitle>
        <Paragraph>
          We may collect personal information that you provide to us directly,
          such as your name, email address, and any other details you choose to
          share. We also automatically collect certain information about your
          device and usage when you interact with our services.
        </Paragraph>

        <Subtitle>How We Use Your Information</Subtitle>
        <Paragraph>We use the information we collect to:</Paragraph>
        <ul>
          <li>Provide, maintain, and improve our services.</li>
          <li>Communicate with you about your account or transactions.</li>
          <li>Send you updates, promotions, and marketing materials.</li>
          <li>Analyze usage and trends to enhance user experience.</li>
        </ul>

        <Subtitle>Data Security</Subtitle>
        <Paragraph>
          We implement reasonable security measures to protect your information
          from unauthorized access, use, or disclosure. However, no method of
          transmission over the internet or method of electronic storage is 100%
          secure.
        </Paragraph>

        <Subtitle>Cookies</Subtitle>
        <Paragraph>
          We use cookies to enhance your experience on our site. You can choose
          to accept or decline cookies. Most web browsers automatically accept
          cookies, but you can modify your browser settings to decline cookies
          if you prefer.
        </Paragraph>

        <Subtitle>Changes to This Privacy Policy</Subtitle>
        <Paragraph>
          We may update our Privacy Policy from time to time. We will notify you
          of any changes by posting the new Privacy Policy on this page and
          updating the effective date at the top of this policy.
        </Paragraph>

        <Subtitle>Contact Us</Subtitle>
        <Paragraph>
          If you have any questions about this Privacy Policy, please contact us
          at{" "}
          <a href="mailto:info@insitech-international.com">
            info@insitech-international.com
          </a>
          .
        </Paragraph>
      </Card>
    </PrivacyContainer>
  );
};

export default PrivacyPolicy;
