import React from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <Navbar bg="danger" expand="lg">
      <Navbar.Brand href="#home">
        <img
          src="/images/helpme.jpg"
          width="150"
          height="80"
          className="d-inline-block align-top"
          alt="Logo"
        />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Link to ="/home" className ="nav-link">Home</Link>
          <Link to ="/education" className="nav-link">Education</Link>
          <Link to ="/carpooling" className="nav-link">Car Pooling</Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavBar;
