// ContactUs.js
import React from "react";
import styled from "styled-components";
import Card from "./../components/common/Card"; // Adjust the import path as necessary

const ContactContainer = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const Paragraph = styled.p`
  margin-bottom: 1rem;
  line-height: 1.6;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  margin-bottom: 1rem;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const TextArea = styled.textarea`
  margin-bottom: 1rem;
  padding: 0.5rem;
  border: 1px solid #ccc;
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

const ContactUs = () => {
  return (
    <ContactContainer>
      <Card>
        <Title>Contact Us</Title>
        <Paragraph>
          We’d love to hear from you! If you have any questions, comments, or
          inquiries, please feel free to reach out to us using the contact form
          below or by sending an email to{" "}
          <a href="mailto:info@insitech-international.com">
            info@insitech-international.com
          </a>
          .
        </Paragraph>
        <Form>
          <Input type="text" placeholder="Your Name" required />
          <Input type="email" placeholder="Your Email" required />
          <TextArea placeholder="Your Message" rows="5" required />
          <Button type="submit">Send Message</Button>
        </Form>
      </Card>
    </ContactContainer>
  );
};

export default ContactUs;
