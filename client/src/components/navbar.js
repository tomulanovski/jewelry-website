import React from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // For React Router navigation
import { FaUserCircle } from 'react-icons/fa'; // Import the user icon from react-icons

function NavBar() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">  {/* Dark background with light text */}
      <Container>
        {/* Logo or Home Button */}
        <Navbar.Brand as={Link} to="/">
          <img
            src="/path/to/logo.png" // Replace with your logo image or person icon
            alt="Logo"
            style={{ width: '40px', height: '40px', borderRadius: '50%' }}
          />
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto"> {/* Align the nav items to the right */}
            {/* Navigation Links */}
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/shop">Shop</Nav.Link>
            <Nav.Link as={Link} to="/about">About</Nav.Link>
            
            {/* User Profile Dropdown with Icon */}
            <NavDropdown title={<FaUserCircle size={24} />} id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/settings">Settings</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#">Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
