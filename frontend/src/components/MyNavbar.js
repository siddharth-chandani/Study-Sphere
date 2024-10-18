import React, { Fragment, useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../actions/auth';
import axios from 'axios';
import { FaBell, FaUserAlt } from 'react-icons/fa';
import { Navbar, Nav, NavDropdown,OverlayTrigger, Popover, Button, Badge  } from 'react-bootstrap';




const MyNavbar = ({ logout, isAuthenticated, email }) => {
    const [isteacher, setIsteacher] = useState(false);
    const [isloggedin, setIsloggedin] = useState(false);
    const [firstname, setFirstname] = useState('');
    const [notis, setNotis] = useState([]);



    useEffect(() => {
      const fetchNotifications = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/gettype/${email}`);
          
          if (response.data['res'] === "true") {
            setIsteacher(true)
          }
          setFirstname(response.data['fname']);
          setIsloggedin(true);
          setNotis(response.data['notis'])
        console.log(response.data)
        } 
        catch (error) {
          console.error('Error fetching notifications:', error);
        }
      };
  
      if (isAuthenticated) {
        fetchNotifications();
      }
    }, [isAuthenticated,email]);





    const logout_user = () => {
        logout();
        return <Navigate to={'/login'}/>
    };

    const guestLinks = () => (
        <Fragment>
            <li className='nav-item'>
                <Link className='nav-link text-white' to='/login'>Login</Link>
            </li>
            <li className='nav-item'>
                <Link className='nav-link text-white' to='/signup'>Sign Up</Link>
            </li>
        </Fragment>
    );

    const authLinks = () => {
        

        return(
            <>
                            {isteacher?<li className='nav-item'>
                    <Link className='nav-link ml-2 text-white' to='/addvideo'>Add Video</Link>
                </li>:<li className='nav-item'>
                <Link className='nav-link ml-2 text-white' to='/saved-videos'>Saved Video</Link>
                </li>}
                <li className='nav-item'>
            <a className='nav-link text-white' href='/login' onClick={logout_user}>Logout</a>
        </li>
                
            </>
        )

    };


    const clearNotifications = async () => {
      try {
        await axios.get(`${process.env.REACT_APP_API_URL}/api/clearnoti/${email}`); 
        setNotis([]);
      } catch (error) {
        console.error('Error clearing notifications:', error);
      }
    };


    const popover = (
        <Popover id="notification-popover">
          <Popover.Header as="h3">Notifications</Popover.Header>
          <Popover.Body>

{notis.length > 0 ? (
          <>
            {notis.map((notification, index) => (
              <div key={index} className="notification-item">
                {notification.body}
              </div>
            ))}
            
            <Button variant="danger" size="sm" onClick={clearNotifications}>Clear Noti</Button>
          </>
        ) : (
          <div className="text-center text-muted">No new notifications.</div>
        )}



          </Popover.Body>
        </Popover>
      );

    return (
<Navbar expand="lg" className="my-navbar text-white">
        <Navbar.Brand className='m-0 p-0 d-none d-lg-block'> <Link className='navbar-brand ml-3 text-white' to='/'>Study Sphere</Link></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="order-2 order-lg-1 ml-3"/>
        <Navbar.Collapse id="basic-navbar-nav" className="order-3 order-lg-2">
          <Nav className="mr-auto">
            <Link className='nav-link ml-2 text-white' to='/'>Dashboard</Link>
            {isAuthenticated ? authLinks() : guestLinks()}
            </Nav>

            {isloggedin && (
                <Nav className="ml-auto">
                <div className='d-flex pr-5 ml-2'>
                <FaUserAlt className='usr-icon'/>
                <NavDropdown title={firstname} id="basic-nav-dropdown">
                <NavDropdown.Item ><Link className='text-decoration-none text-dark' to={'/reset-password'}> Reset Password</Link></NavDropdown.Item>
                <NavDropdown.Item href="/login" onClick={logout_user}>Logout</NavDropdown.Item>
                </NavDropdown>
                </div>
            </Nav>
          )}
        </Navbar.Collapse>
        {isloggedin && (
            <OverlayTrigger trigger="click" placement="bottom" overlay={popover}>
            <Nav.Link href="#" className="bell-icon">
            <FaBell size={20} />
            {notis.length > 0 && (
                <Badge pill bg="danger" className="notification-count">
                  {notis.length}
                </Badge>
              )}
            </Nav.Link>
        </OverlayTrigger>
        )}

      </Navbar>
    );
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { logout })(MyNavbar);
