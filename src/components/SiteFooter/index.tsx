import Layout, { Footer } from 'antd/es/layout/layout';
import styles from './Footer.module.css';

export default function SiteFooter() {
  
  return (
	<footer className={styles.siteFooter}>
	  <div className={styles.container}>
        <p>Copyright &copy; 2023 Orange Music Entertainment</p>
        <ul>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/privacyPolicy">Privacy Policy</a></li>
            <li><a href="/TERMSANDCONDITIONS.html">Terms of Use</a></li>
        </ul>
      </div>
	</footer>
  );
}