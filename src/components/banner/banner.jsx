import React from 'react';
import { Button, Jumbotron, Container } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import './banner.css';

const Banner = () => {
  const navigate = useNavigate(); 

  const handlePostClick = () => {
    navigate('/form'); 
  };

  return (
    <Jumbotron fluid className="text-center banner-background">
      <Container>
        <h1>Get Your Help Here</h1>
        <p className="lead">Post your query here to get helped</p>
        <Button variant="primary" size="lg" onClick={handlePostClick}>Post</Button>
      </Container>
    </Jumbotron>
  );
};

export default Banner;
