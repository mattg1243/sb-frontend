import * as React from 'react';
import styles from './Hero4.module.css';

type InfoSectionProps = {
  title: string;
  description: string;
  linkText: string;
};

const InfoSection: React.FC<InfoSectionProps> = ({ title, description, linkText }) => (
  <section className={styles.infoSection}>
    <h2 className={styles.infoTitle}>{title}</h2>
    <p className={styles.infoDescription}>{description}</p>
    <a href="#" className={styles.infoLink} role="button" tabIndex={0}>
      {linkText}
    </a>
  </section>
);

const Hero4: React.FC = () => (
  <div className={styles.container}>
    <div className={styles.content}>
      <figure className={styles.imageFigure}>
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/44bc47594ea7d489078f967df48c5bfd70489e4d9d35949d3b549edf802fd590?apiKey=82f054d605504e19a62683eb6b10b961&"
          alt="Descriptive alternate text"
          className={styles.image}
        />
      </figure>
      <article className={styles.textContent}>
        <InfoSection
          title="Collect royalties on your beats forever."
          description="When an artist licenses your beat through Sweatshop Beats, you are entitled to 5% royalties forever."
          linkText="See FAQ"
        />
      </article>
    </div>
  </div>
);

export default Hero4;
