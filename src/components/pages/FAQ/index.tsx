import { Typography } from 'antd';
import styles from './FAQ.module.css';
import balloonLogo from '../../../assets/orangelogo.png';
import Navbar from '../../Navbar';
import sections from './sections.data';

type Props = {
  children: React.ReactNode;
};

type SectionProps = {
  header: string;
  children: React.ReactNode;
};

//Component that harbors the main part of the webpage, excluding the navbar.
function Viewport({ children }: Props) {
  return <div className={styles.viewport}>{children}</div>;
}

//An individual FAQ section
function Section({ header, children }: SectionProps) {
  return (
    <>
      <details className={styles.section_container}>
        <div className={styles.section_body}>{children}</div>
        <summary className={styles.section_header}>{header}</summary>
      </details>
    </>
  );
}

//The body of the FAQ component. It contains all the FAQ sections.
function FAQBody() {
  const FAQSections = sections.map(({ header, content }) => {
    return <Section header={header}>{content}</Section>;
  });
  return <div className={styles.faq_container}>{FAQSections}</div>;
}

//The FAQ webpage
export default function FAQ() {
  const { Title } = Typography;

  return (
    <>
      <Navbar />
      <Viewport>
        <Title className={styles.faq} data-cy="title">
          FAQ
        </Title>
        <Typography className={styles.typography}>
          <FAQBody />
          <img src={balloonLogo} alt="Balloon Logo" className={styles.logo} />
        </Typography>
      </Viewport>
    </>
  );
}
