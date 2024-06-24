import styles from './Hero1.module.css';
import Frame from '../../../assets/Frame.png';
import Soundwave from '../../../assets/Soundwave.png';
import Orange from '../../../assets/OrangeRect.png';
import { useNavigate } from 'react-router-dom';

export default function Hero1() {
  const navigate = useNavigate();

  return (
    <section className={styles.hero}>
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/7903357dc80f563c8630778553db3305d8489d0e0c556c0fb38a13d8507bbef8?apiKey=82f054d605504e19a62683eb6b10b961&"
        alt="Hero"
        className={styles.heroImage}
      />
      <img src={Orange} style={{ zIndex: 0, width: '100vw', position: 'absolute', height: '60vh' }} />
      <img src={Frame} style={{ zIndex: 2, width: '100vw', position: 'absolute', height: '80vh' }} />
      <div className={styles.heroContent}>
        <div className={styles.heroText}>
          The Worlds First Beat Subscription Site <img src={Soundwave} className={styles.soundwave} />
          <div className={styles.heroButtons}>
            <button className={styles.button} onClick={() => navigate('/register')}>
              Sign Up
            </button>
            <button className={`${styles.button} ${styles.signUpButton}`} onClick={() => navigate('/login')}>
              Login
            </button>
          </div>
        </div>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/0a1cc03f9c510686f8d08f32aeccc7b0e9bd9b22edadc4c6768380334a82b0d0?apiKey=82f054d605504e19a62683eb6b10b961&"
          alt="Beat"
          className={styles.beatImage}
        />
      </div>
    </section>
  );
}
