import React from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faTasks, faShoppingCart, faComments, faUser, faUserPlus, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import Logo from "../images/Logo.PNG";
import './NavigationBar.css';

function NavBar({ onLogout }) {
    const location = useLocation();
    const path = location.pathname;
    const role = localStorage.getItem('userRole');

    return (
        <Navbar collapseOnSelect className="navigation" bg="dark" variant="dark" expand="lg" fixed="top">
            <Navbar.Brand className="brand">
                <img className="image-logo" src={Logo} alt='RailCarCareLogo' />RailCarCare
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="custom-nav">
                    {path !== '/home' && (
                        <Link to="/home" className="nav-link"><FontAwesomeIcon icon={faHome} /> Home</Link>
                    )}
                    {path !== '/assignments' && (
                        <Link to="/assignments" className="nav-link"><FontAwesomeIcon icon={faTasks} /> Assignments</Link>
                    )}
                    {path !== '/orders' && (
                        <Link to="/orders" className="nav-link"><FontAwesomeIcon icon={faShoppingCart} /> Orders</Link>
                    )}
                    {path !== '/complaints' && (
                        <Link to="/complaints" className="nav-link"><FontAwesomeIcon icon={faComments} /> Complaints</Link>
                    )}
                    {path !== '/profile' && (
                        <Link to="/profile" className="nav-link"><FontAwesomeIcon icon={faUser} /> Profile</Link>
                    )}
                    {role === 'manager' && path !== '/create-employee' && (
                        <Link to="/create-employee" className="nav-link"><FontAwesomeIcon icon={faUserPlus} /> Create Employee</Link>
                    )}
                    <Button variant="danger" onClick={onLogout}>
                        <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                    </Button>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default NavBar;
