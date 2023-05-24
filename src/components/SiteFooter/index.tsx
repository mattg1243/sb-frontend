import styles from './Footer.module.css';

export default function SiteFooter() {
  return (
    <footer className={styles.siteFooter}>
      <div className={styles.container}>
        <p id="copyright-notice">Copyright &copy; 2023 Orange Music Entertainment</p>
        <ul>
          <li>
            <a href="/app/about" id="about-link">
              About
            </a>
          </li>
          <li>
            <a href="/contact" id="contact-link">
              Contact
            </a>
          </li>
          <li>
            <a href="/PRIVACYPOLICY.html" id="privacy-policy-link">
              Privacy Policy
            </a>
          </li>
          <li>
            <a href="/TERMSANDCONDITIONS.html" id="terms-link">
              Terms & Conditions
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
