import * as React from 'react';
import styles from './basic_card.module.css';

export default function BasicCard(props: { checkoutFn: (subTier: 'basic' | 'std' | 'prem') => void }) {
  const { checkoutFn } = props;

  return (
    <>
      <div className={styles['div']}>
        <div className={styles['div-2']}>
          <div className={styles['div-3']}>
            <div className={styles['div-4']}>Basic Tier</div>
            <div className={styles['div-5']}>Basic</div>
            <div className={styles['div-6']}>The more credits artists spend on your beats, the more you get paid.</div>
            <div className={styles['div-7']}>
              <div className={styles['div-8']}>$34.99</div>
              <div className={styles['div-9']}>/monthly</div>
            </div>
          </div>
          <div className={styles['div-10']}>
            <div className={styles['div-11']}>
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/8346144e57796398048904af1fb47a71103715b2af53a4b44eb8d2b5086e1965?"
                className={styles['img']}
              />
              <div className={styles['div-12']}>3 beat downloads/month under an unlimited license</div>
            </div>
            <div className={styles['div-13']}>
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/f2e4adf545b52634375912aae336fbb39ef8a3fa177e46703f729d8e2432312e?"
                className={styles['img']}
              />
              <div className={styles['div-14']}>Access to our entire catalog of beats from thousands of producers</div>
            </div>
            <div style={{ height: '200px' }}></div>
            {/* <div className={styles['div-15']}>
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/998117089ea8cc0a66c2892cc475e66326f7bfae8849ed7ccb03a52462b3e7d2?"
                className={styles['img']}
              />
              <div className={styles['div-16']}>Task delivered one-by-one</div>
            </div>
            <div className={styles['div-17']}>
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/1ef4f7d9179a17ccef128f2788cee3636b4d23c09a90eadf5a6b17436d261d0d?"
                className={styles['img']}
              />
              <div className={styles['div-18']}>Monthly strategy call</div>
            </div>
            <div className={styles['div-19']}>
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/40f24f6bbecd083af3e67d43c5a73e8df0b40f830c2550d92f2afa277a9f099d?"
                className={styles['img']}
              />
              <div className={styles['div-20']}>Commercial license</div>
            </div>
            <div className={styles['div-21']}>
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/9b7f1a37decccd90f2fdbd47b25772c3e20db9771c8db06b2b9627876f27d6f9?"
                className={styles['img']}
              />
              <div className={styles['div-22']}>Tasks delivered one-by-one</div>
            </div> */}
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
