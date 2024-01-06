import Style from '@/components/Navbar/Navbar.module.css';
import SignInOutButton from '../SignInOutButton/SignInOutButton';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { Navbar as BootstrapNavbar } from 'react-bootstrap';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Link from 'next/link';

const Navbar = async () => {
  const session = await getServerSession(authOptions);
  return (
    <>
      <BootstrapNavbar expand='lg' className={Style.navbarBody}>
        <Container className={Style.navbarContainer}>
          <Link href='/' className={Style.navLogo}>
            Aldis Blog
          </Link>
          <Nav className='me-auto'>
            <Link href='/' className={Style.navbarLink}>
              Home
            </Link>
            <NavDropdown title='Categories'>
              <ul className={Style.navbarList}>
                <li>
                  <Link href='/posts/category/1' className={Style.navbarLink}>
                    Programming
                  </Link>
                </li>
                <li>
                  <Link href='/posts/category/2' className={Style.navbarLink}>
                    Music
                  </Link>
                </li>
                <li>
                  <Link href='/posts/category/3' className={Style.navbarLink}>
                    Racing
                  </Link>
                </li>
                <li>
                  <Link href='/posts/category/4' className={Style.navbarLink}>
                    Lifestyle
                  </Link>
                </li>
                <li>
                  <Link href='/posts/category/5' className={Style.navbarLink}>
                    Other
                  </Link>
                </li>
              </ul>
            </NavDropdown>
            {/* If user is logged in show create post and view comments links */}
            {!session ? (
              <></>
            ) : (
              <>
                <Link href='/posts/create' className={Style.navbarLink}>
                  Create post
                </Link>
                <Link href='/comments' className={Style.navbarLink}>
                  View comments
                </Link>
              </>
            )}
          </Nav>
        </Container>
        <div className={Style.signInButtonWrapper}>
          <SignInOutButton />
        </div>
      </BootstrapNavbar>
    </>
  );
};

export default Navbar;
