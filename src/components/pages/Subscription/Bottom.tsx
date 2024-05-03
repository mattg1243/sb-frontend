import * as React from 'react';
import styles from './bottom.module.css';
import logo from '../../../assets/orangelogo.png';

const width = window.innerWidth;

export default function Bottom() {
  return (
    <>
      <div className={styles['div']}>
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/42142e4a9af7fc3686024688b823a69b31e8a2164337e501406a56ff1fcb500a?"
          className="img"
          width={Math.max(width, 1920)}
        />
        <div
          style={{
            position: 'absolute',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '100%',
            alignItems: 'center',
            maxWidth: '800px',
          }}
        >
          <img loading="lazy" srcSet={logo} className={styles['img-2']} />
          <div className={styles['div-2']}>
            Stop spending $100 to license a single beat. Creators recieve 50% of all revenue generated from
            subscriptions.
          </div>
          {width > 480 ? (
            <div className={styles['div-3']}>
              <div className={styles['div-4']}>Home</div>
              <div className={styles['div-5']}>About Us</div>
              <div className={styles['div-6']}>Subscribe</div>
              <div className={styles['div-7']}>FAQ</div>
              <div className={styles['div-8']}>Privacy Policy</div>
              <div className={styles['div-9']}>Terms of Service</div>
              <div className={styles['div-10']}>Cookie Policy</div>
            </div>
          ) : null}
        </div>
        <div className={styles['div-11']}>Copyright © 2024 Orange Music Entertainment</div>
      </div>
    </>
  );
}
