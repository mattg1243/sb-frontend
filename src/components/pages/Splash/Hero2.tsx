import * as React from 'react';
import styles from './Hero2.module.css';
import { useNavigate } from 'react-router-dom';

type InfoSectionProps = {
  header: string;
  highlightedText: string;
  content: string;
  buttonText: string;
};

export const InfoSection: React.FC<InfoSectionProps> = ({ header, highlightedText, content, buttonText }) => {
  const navigate = useNavigate();

  return (
    <section className={styles.infoSection}>
      <h2 className={styles.infoHeader}>
        {header} <span className={styles.highlightedText}>{highlightedText}</span>
        <span> to license a single beat.</span>
      </h2>
      <p className={styles.infoContent}>{content}</p>
      <button className={styles.ctaButton} onClick={() => navigate('/FAQ')}>
        {buttonText}
      </button>
    </section>
  );
};

export default function Hero2() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <section className={styles.imageSection}>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/34e894bb640afece7186a2479150ef1d3b20fc6031ab51a37951ebc4ecc22125?apiKey=82f054d605504e19a62683eb6b10b961&"
            alt="Description of image"
            className={styles.mainImage}
          />
        </section>
        <InfoSection
          header="Stop Spending"
          highlightedText="$100"
          content="For as low as $34.99/month, you can license and download multiple beats from professional producers."
          buttonText="See FAQ"
        />
      </div>
    </div>
  );
}
