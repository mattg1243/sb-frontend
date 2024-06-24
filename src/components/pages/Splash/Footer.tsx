import React from 'react';
import styles from './Footer.module.css';

type NavItem = {
  title: string;
  url: string;
};

const navItems: NavItem[] = [
  { title: 'Home', url: '/' },
  { title: 'About Us', url: '/app/about' },
  { title: 'Subscribe', url: '/subscriptions' },
  { title: 'FAQ', url: '/FAQ' },
  { title: 'Privacy Policy', url: '/PRIVACYPOLICY.html' },
  { title: 'Terms of Service', url: '/TERMSOFSERVICE.html' },
  { title: 'Cookie Policy', url: '/COOKIEPOLICY.html' },
];

const NavBar: React.FC = () => (
  <nav className={styles.nav}>
    {navItems.map((item) => (
      <a key={item.title} href={item.url} className={styles.navItem}>
        {item.title}
      </a>
    ))}
  </nav>
);

export default function Footer() {
  return (
    <section className={styles.container}>
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/42142e4a9af7fc3686024688b823a69b31e8a2164337e501406a56ff1fcb500a?apiKey=82f054d605504e19a62683eb6b10b961&"
        alt=""
        className={styles.backgroundImage}
      />
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/384a499f2f71c7db6f8a26133064f4dfb6a23c69a965e562dc6ccc235c6fab5f?apiKey=82f054d605504e19a62683eb6b10b961&"
        alt="Company Logo"
        className={styles.logo}
      />
      <p className={styles.description}>
        Stop spending $100 to license a single beat. Creators receive 50% of all revenue generated from subscriptions.
      </p>
      <NavBar />
      <footer className={styles.footer}>Copyright © 2024 Orange Music Entertainment</footer>
    </section>
  );
}
