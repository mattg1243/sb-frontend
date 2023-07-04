import { Typography } from 'antd';
import styles from './FAQ.module.css';
import balloonLogo from '../../../assets/orangelogo.png';
import Navbar from '../../Navbar';

export default function FAQ() {
  const { Title, Paragraph } = Typography;

  return (
    <>
      <Navbar />
      <Title className={styles.faq} data-cy="title">
        Frequently asked questions
      </Title>
      <Typography className={styles.typography}>
        <h3>
          <strong>Valid social links</strong>
        </h3>
        <Paragraph>
          Only links from these websites are valid: YouTube, Instagram, Twitter, Spotify, and LinkTree.
        </Paragraph>
        <img src={balloonLogo} alt="Balloon Logo" className={styles.logo} />
      </Typography>
    </>
  );
}
