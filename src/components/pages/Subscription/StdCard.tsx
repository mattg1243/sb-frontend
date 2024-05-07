import * as React from 'react';
import styles from './std_card.module.css';

export default function StdCard(props: { checkoutFn: (subTier: 'basic' | 'std' | 'prem') => void }) {
  const { checkoutFn } = props;

  return (
    <>
      <div className={styles['box']}>
        <div className={styles['div']}>
          <div className={styles['div-2']}>
            <div className={styles['div-3']}>Standard Tier</div>
            <div className={styles['div-4']}>Standard</div>
            <div className={styles['div-5']}>
              Each credit allows you to download one beat. Once you download a beat, its yours forever.
            </div>
            <div className={styles['div-6']}>
              <div className={styles['div-7']}>$54.99</div>
              <div className={styles['div-8']}>/monthly</div>
            </div>
            <div style={{ height: '25px', marginTop: '10px' }}>Save 5.7% per beat</div>
          </div>
          <div className={styles['div-9']}>
            <div className={styles['div-10']}>
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/eb2727ece280f0bab6b81271debc72b0ebae313dafc02ef87a7253a5eb1586d8?"
                className={styles['img']}
              />
              <div className={styles['div-11']}>5 beat downloads/month under an unlimited license</div>
            </div>
            <div className={styles['div-12']}>
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/69f1656cec9d43caee6a669c48f312955329c062f4c8ef605cc61da3be1747cb?"
                className={styles['img']}
              />
              <div className={styles['div-13']}>Access to our entire catalog of beats from thousands of producers</div>
            </div>
            <div className={styles['div-14']}>
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/bcec2c4c7d876105115e0639d0109795048eb2f756349bd29104a9ae7d135078?"
                className={styles['img']}
              />
              <div className={styles['div-15']}>Stem downloads</div>
            </div>
            <div style={{ height: '170px' }}></div>
            <div className={styles['div-22']} onClick={() => checkoutFn('basic')}>
              <div className={styles['div-23']}>
                <div className={styles['div-24']}>Get Started</div>
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/15aa10f0ca01c0c854cefa2a04aab2eadf7a28cdf406663bb833ce73139fa9c0?"
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
