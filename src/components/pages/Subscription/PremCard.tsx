import * as React from 'react';
import styles from './basic_card.module.css';
import { Divider } from 'antd';

export default function PremCard(props: { checkoutFn: (subTier: 'basic' | 'std' | 'prem') => void }) {
  const { checkoutFn } = props;

  return (
    <>
      <div className={styles['div']}>
        <div className={styles['div-2']}>
          <div className={styles['div-3']}>
            <div className={styles['div-4']}>Premium Tier</div>
            <div className={styles['div-5']}>Premium</div>
            <div className={styles['div-6']}>
              Each credit allows you to download one beat. Once you download a beat, its yours forever.
            </div>
            <div className={styles['div-7']} style={{ marginTop: '35px' }}>
              <div className={styles['div-8']}>$49.99</div>
              <div className={styles['div-9']}>first month</div>
            </div>
            <Divider />
            <div className={styles['div-7']} style={{ marginTop: '35px' }}>
              <div className={styles['div-8']}>$89.99</div>
              <div className={styles['div-9']}>/monthly</div>
            </div>
            <div style={{ height: '25px', marginTop: '10px' }}>Save 14.3% per beat</div>
          </div>
          <div className={styles['div-10']}>
            <div className={styles['div-11']}>
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/8346144e57796398048904af1fb47a71103715b2af53a4b44eb8d2b5086e1965?"
                className={styles['img']}
              />
              <div className={styles['div-12']}>9 beat downloads/month under an unlimited license</div>
            </div>
            <div className={styles['div-13']}>
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/f2e4adf545b52634375912aae336fbb39ef8a3fa177e46703f729d8e2432312e?"
                className={styles['img']}
              />
              <div className={styles['div-14']}>Access to our entire catalog of beats from thousands of producers</div>
            </div>
            <div className={styles['div-15']}>
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/998117089ea8cc0a66c2892cc475e66326f7bfae8849ed7ccb03a52462b3e7d2?"
                className={styles['img']}
              />
              <div className={styles['div-16']}>Stem downloads</div>
            </div>
            <div style={{ height: '165px' }}></div>
            <div className={styles['div-23']} onClick={() => checkoutFn('basic')}>
              <div className={styles['div-24']}>
                <div className={styles['div-25']}>Get Started</div>
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/cb2dad96130c20b2eb9c69fcb8abb3e941b42e5eec125c92fee0b02c005f404b?"
                  className={styles['img-2']}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
