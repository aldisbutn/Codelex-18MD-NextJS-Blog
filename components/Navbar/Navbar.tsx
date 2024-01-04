'use client';

import Style from '@/components/Navbar/Navbar.module.css';
import SignInOutButton from '../SignInOutButton/SignInOutButton';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import BootstrapNavbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useSession } from 'next-auth/react';

const Navbar = () => {
  const { data: session } = useSession();
  return (
    <>
      <BootstrapNavbar expand='lg' className={Style.navbarBody}>
        <Container>
          <BootstrapNavbar.Brand href='/'>Aldis Blog</BootstrapNavbar.Brand>
          <BootstrapNavbar.Toggle aria-controls='basic-navbar-nav' />
          <BootstrapNavbar.Collapse id='basic-navbar-nav'>
            <Nav className='me-auto'>
              <Nav.Link href='/'>Home</Nav.Link>
              <NavDropdown title='Categories' className={Style.navbarDropdown}>
                <NavDropdown.Item href='/posts/category/1' className={Style.navbarDropdown}>
                  Programming
                </NavDropdown.Item>
                <NavDropdown.Item href='/posts/category/2'>Music</NavDropdown.Item>
                <NavDropdown.Item href='/posts/category/3'>Racing</NavDropdown.Item>
                <NavDropdown.Item href='/posts/category/4'>Lifestyle</NavDropdown.Item>
                <NavDropdown.Item href='/posts/category/5'>Other</NavDropdown.Item>
              </NavDropdown>
              {/* If user is logged in show create post and view comments links */}
              {!session ? (
                <></>
              ) : (
                <>
                  <Nav.Link href='/posts/create'>Create post</Nav.Link>
                  <Nav.Link href='/comments'>View comments</Nav.Link>
                </>
              )}
            </Nav>
          </BootstrapNavbar.Collapse>
        </Container>
        <div className={Style.signInButtonWrapper}>
          <SignInOutButton />
        </div>
      </BootstrapNavbar>
    </>
  );
};

export default Navbar;
