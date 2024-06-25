import { FC } from 'react';
import styles from './Splash.module.css';
import Header from './Header';

import BeatsSection from './Beats';
import Hero1 from './Hero1';
import Hero2 from './Hero2';
import Hero3 from './Hero3';
import Footer from './Footer';

const SplashPage: FC = () => {
  return (
    <>
      {window.innerWidth < 480 ? null : <Header />}
      <main className={styles.body}>
        <Hero1 />
        <Hero2 />
        <Hero3 />
        <BeatsSection />
        <Footer />
      </main>
    </>
  );
};

export default SplashPage;
