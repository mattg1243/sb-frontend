import * as React from 'react';
import styles from './Hero3.module.css';
import { useNavigate } from 'react-router-dom';

type HighlightedTextProps = {
  mainText: string;
  highlightedText: string;
  italicText: string;
};

const HighlightedText: React.FC<HighlightedTextProps> = ({ mainText, highlightedText, italicText }) => (
  <div className={styles.highlightedText}>
    <span className={styles.mainText}>Creators receive </span>
    <span className={styles.highlightedTextPercentage}>{highlightedText}</span>
    <span className={styles.mainText}> of all revenue generated from </span>
    <span className={styles.highlightedItalicText}>{italicText}</span>
    <span className={styles.mainText}>.</span>
  </div>
);

export default function Hero3() {
  const navigate = useNavigate();

  return (
    <section className={styles.mainSection}>
      <div className={styles.contentWrapper}>
        <div className={styles.imageColumn}>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/c56f74aae16c03cb64bd7c719e38b013205e03c888b235b7fb6cbd758345a7bb?apiKey=82f054d605504e19a62683eb6b10b961&"
            className={styles.image}
            alt="A representation of revenue sharing."
          />
        </div>
        <div className={styles.textColumn}>
          <HighlightedText mainText="Creators Receive " highlightedText="50%" italicText="Subscriptions" />
          <p className={styles.description}>The more credits artists spend on your beats, the more you get paid.</p>
          <button
            className={styles.ctaButton}
            onClick={() => {
              navigate('/FAQ');
            }}
          >
            See FAQ
          </button>
        </div>
      </div>
    </section>
  );
}
