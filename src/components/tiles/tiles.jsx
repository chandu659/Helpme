import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import './tiles.css';
import { Link } from 'react-router-dom';

const Tiles = () => {
  return (
    <Row className="justify-content-center">
      <Col md={4} className="resource-tile">
        <Link to="/education" className="card-link">
          <Card className="text-center">
            <Card.Body>
              <Card.Img variant="top" src="/images/edu.png" />
              <Card.Title>Education Help</Card.Title>
              <Card.Text>
                Find resources and information to support your educational needs.
              </Card.Text>
            </Card.Body>
          </Card>
        </Link>
      </Col>

      <Col md={4} className="resource-tile">
        <Link to="/carpooling" className="card-link">
          <Card className="text-center">
            <Card.Body>
              <Card.Img variant="top" src="/images/car.jpg" />
              <Card.Title>Car Pooling Help</Card.Title>
              <Card.Text>
                Join a car pool or find partners to travel with to save costs.
              </Card.Text>
            </Card.Body>
          </Card>
        </Link>
      </Col>
    </Row>
  );
};

export default Tiles;
