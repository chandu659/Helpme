import React from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import './navbar.css'; 

function NavBar() {
  return (
    <Navbar className="modern-navbar">
      <Navbar.Brand href="#home" className="navbar-brand-modern">
        <img
          src="/images/helpme-modern.jpg"
          width="120" 
          height="60" 
          className="d-inline-block align-top"
          alt="Logo"
        />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <Link to="/home" className="nav-link modern-link">Home</Link>
          <Link to="/education" className="nav-link modern-link">Education</Link>
          <Link to="/carpooling" className="nav-link modern-link">Car Pooling</Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavBar;
