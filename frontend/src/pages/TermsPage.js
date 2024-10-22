// TermsOfService.js
import React from "react";
import styled from "styled-components";
import Card from "./../components/common/Card";

const TermsContainer = styled.div`
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

const TermsOfService = () => {
  return (
    <TermsContainer>
      <Card>
        <Title>Terms of Service</Title>
        <Paragraph>
          Welcome to InsiTech International! These Terms of Service govern your
          use of our services, including the Python Query Vault project. By
          accessing or using our services, you agree to comply with these terms.
        </Paragraph>

        <Subtitle>1. Acceptance of Terms</Subtitle>
        <Paragraph>
          By using our services, you confirm that you are at least 18 years old
          or have the consent of a parent or guardian. If you do not agree with
          these terms, please do not use our services.
        </Paragraph>

        <Subtitle>2. Modifications to Terms</Subtitle>
        <Paragraph>
          We may modify these terms at any time. If we make significant changes,
          we will notify you via email or through a notice on our site.
          Continued use of our services after modifications constitutes
          acceptance of the updated terms.
        </Paragraph>

        <Subtitle>3. User Responsibilities</Subtitle>
        <Paragraph>
          You agree to use our services only for lawful purposes and in
          accordance with our policies. You are responsible for ensuring that
          your account information is accurate and up to date.
        </Paragraph>

        <Subtitle>4. Intellectual Property</Subtitle>
        <Paragraph>
          All content and materials provided through our services are the
          property of InsiTech International or our licensors. You may not
          reproduce, distribute, or create derivative works without our prior
          written consent.
        </Paragraph>

        <Subtitle>5. Limitation of Liability</Subtitle>
        <Paragraph>
          To the fullest extent permitted by law, InsiTech International is not
          liable for any indirect, incidental, special, or consequential damages
          arising from your use of our services.
        </Paragraph>

        <Subtitle>6. Governing Law</Subtitle>
        <Paragraph>
          These terms are governed by the laws of the jurisdiction in which
          InsiTech International operates, without regard to its conflict of law
          principles.
        </Paragraph>

        <Subtitle>7. Contact Us</Subtitle>
        <Paragraph>
          If you have any questions about these Terms of Service, please contact
          us at{" "}
          <a href="mailto:info@insitech-international.com">
            info@insitech-international.com
          </a>
          .
        </Paragraph>
      </Card>
    </TermsContainer>
  );
};

export default TermsOfService;
