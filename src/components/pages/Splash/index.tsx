import { FC } from 'react';
import styles from './Splash.module.css';
import Header from './Header';

import BeatsSection from './Beats';
import Hero1 from './Hero1';
import Hero2 from './Hero2';
import Hero3 from './Hero3';
import Footer from './Footer';
import Hero4 from './Hero4.index';

const SplashPage: FC = () => {
  return (
    <>
      <Header />
      <main className={styles.body}>
        <Hero1 />
        <Hero2 />
        <BeatsSection />
        <Hero3 />
        <Hero4 />
        <Footer />
      </main>
    </>
  );
};

export default SplashPage;
