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
            <div className={styles['div-5']}>The more credits artists spend on your beats, the more you get paid.</div>
            <div className={styles['div-6']}>
              <div className={styles['div-7']}>$54.99</div>
              <div className={styles['div-8']}>/monthly</div>
            </div>
          </div>
          <div className={styles['div-9']}>
            <div className={styles['div-10']}>
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/eb2727ece280f0bab6b81271debc72b0ebae313dafc02ef87a7253a5eb1586d8?"
                className={styles['img']}
              />
              <div className={styles['div-11']}>3-5 day turnaround</div>
            </div>
            <div className={styles['div-12']}>
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/69f1656cec9d43caee6a669c48f312955329c062f4c8ef605cc61da3be1747cb?"
                className={styles['img']}
              />
              <div className={styles['div-13']}>Native Development</div>
            </div>
            <div className={styles['div-14']}>
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/bcec2c4c7d876105115e0639d0109795048eb2f756349bd29104a9ae7d135078?"
                className={styles['img']}
              />
              <div className={styles['div-15']}>Task delivered one-by-one</div>
            </div>
            <div className={styles['div-16']}>
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/a54bd2663badc1103007752851c9a4a2a28c882a10dde76a67339e516aa59231?"
                className={styles['img']}
              />
              <div className={styles['div-17']}>Monthly strategy call</div>
            </div>
            <div className={styles['div-18']}>
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/9f9a0c4e73898895beb265d25863ec968aca4a977a27c3d61fe5ec0c7a959d9d?"
                className={styles['img']}
              />
              <div className={styles['div-19']}>Commercial license</div>
            </div>
            <div className={styles['div-20']}>
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/70239c029893b48a5ec99cedb9973df3179292673eb90a3bedf77436a08df6c1?"
                className={styles['img']}
              />
              <div className={styles['div-21']}>Tasks delivered one-by-one</div>
            </div>
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
