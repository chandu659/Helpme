import React from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import '../footer/footer.css'; // Make sure to create a Footer.css file for custom styles

const Footer = () => {
  return (
    <footer className="footer mt-auto py-3 bg-dark text-white">
      <Container>
        <Row>
          <Col md={4} className="footer-brand">
            <h5>Help Me</h5>
            <p>Making help Possible through internet.</p>
          </Col>
          <Col md={4} className="footer-nav">
            <Nav className="flex-column">
              <Nav.Link href="#">About Us</Nav.Link>
              <Nav.Link href="#">Link</Nav.Link>
              <Nav.Link href="#">Home</Nav.Link>
              <Nav.Link href="#">Terms and Conditions</Nav.Link>
              <Nav.Link href="#">Privacy Policy</Nav.Link>
            </Nav>
          </Col>
          <Col md={4} className="footer-social">
            <Nav>
              <Nav.Link href="#"><i className="fab fa-facebook-f"></i></Nav.Link>
              <Nav.Link href="#"><i className="fab fa-twitter"></i></Nav.Link>
              <Nav.Link href="#"><i className="fab fa-linkedin-in"></i></Nav.Link>
              <Nav.Link href="#"><i className="fab fa-instagram"></i></Nav.Link>
              <Nav.Link href="#">Your Feedback</Nav.Link>
            </Nav>
          </Col>
        </Row>
        <Row>
          <Col className="footer-copywright">
            <p>© 2021 Copyright: Help Me</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
