import * as React from 'react';
import styles from './Header.module.css';
import SearchInput from '../../Navbar/SearchInput';
import MobileNav from '../../MobileNav/index';
import { Dropdown, MenuProps } from 'antd';
import { GiHamburgerMenu } from 'react-icons/gi';

interface Link {
  name: string;
  href: string;
}

interface NavbarProps {
  links: Link[];
}

const navbarLinks: Link[] = [
  { name: 'Home', href: '/app/dash' },
  { name: 'About Us', href: '/app/about' },
  { name: 'Subscribe', href: '/subscriptions' },
  { name: 'FAQ', href: '/FAQ' },
];

const Navbar: React.FC<NavbarProps> = ({ links }) => (
  <nav className={styles.navbar}>
    {links.map(({ name, href }) => (
      <a key={name} className={styles.navLink} href={href}>
        {name}
      </a>
    ))}
  </nav>
);

const MobileNavbar: React.FC<NavbarProps> = ({ links }) => {
  const items: MenuProps['items'] = links.map(({ name, href }) => ({
    key: name,
    label: <a href={href}>{name}</a>,
  }));

  return (
    <Dropdown menu={{ items }} placement="bottomLeft">
      <GiHamburgerMenu style={{ color: 'white', marginRight: '22px', fontSize: '24px' }} />
    </Dropdown>
  );
};

const Header: React.FC = () => (
  <header className={styles.header}>
    <img
      loading="lazy"
      src="https://cdn.builder.io/api/v1/image/assets/TEMP/48c70f353de5c05197832a7cbde94f0ba2f55f6be6c5c19a87b68ccdfcc667c8?apiKey=82f054d605504e19a62683eb6b10b961&"
      alt="Logo"
      className={styles.logo}
    />
    {window.innerWidth > 480 ? (
      <>
        <Navbar links={navbarLinks} />
        <div className={styles.userControls}>
          <div style={{ width: '256px', display: 'flex' }}>
            <SearchInput />
          </div>
          <div className={styles.separator} aria-hidden="true" />
          <div className={styles.authLinks}>
            <a href="/login" className={styles.loginLink}>
              Login
            </a>
            <a href="/register" className={styles.signupLink}>
              Sign Up
            </a>
          </div>
        </div>
      </>
    ) : (
      <>
        <MobileNavbar links={navbarLinks} />
      </>
    )}
  </header>
);

export default Header;
