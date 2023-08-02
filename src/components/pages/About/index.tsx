import { Typography } from 'antd';
import styles from './About.module.css';
import balloonLogo from '../../../assets/orangelogo.png';

export default function AboutPage() {
  const { Title, Paragraph } = Typography;

  return (
    <>
      <img src={balloonLogo} alt="Balloon Logo" className={styles.logo} />
      <Typography className={styles.typography}>
        <Title className={styles.about} data-cy="title">
          About Us
        </Title>

        <Paragraph>
          <strong>Who we are: </strong>
          Sweatshop Beats is the world's first beat subscription platform, providing musicians with a wealth of
          high-quality beats at an affordable price while increasing the earnings potential of all producers.
        </Paragraph>

        <Paragraph>
          At the heart of our company is a commitment to democratizing the music-making process and empowering artists
          to unleash their full creative potential.
        </Paragraph>

        <Paragraph>
          <strong>How it started: </strong>
          The company was founded in 2022 by Montana Brown and Matt Gallucci. Montana is the head of the company and
          Matt is an expert in development. Together they ensure that the platform is always at the cutting edge of
          technology and user experience.
        </Paragraph>

        <Paragraph>
          Our mission is to make the music industy more accessible to everyone, breaking down barriers and making a
          high-quality beats marketplace accessible to musicians and producers around the world.
        </Paragraph>

        <Paragraph>
          <strong>How it works: </strong>
          Our platform is user-friendy and offers a constantly expanding library of beats. Producers upload beats, and
          artists subscribe to recieve credits each month to download the beats they need.
        </Paragraph>

        <Paragraph>
          With a user-friendly interface, a growing library of beats, and a commitment to excellence, Sweatshop Beats is
          the ideal destination for musicians and producers who want to take their craft to the next level.
        </Paragraph>

        <Paragraph>
          Join the Sweatshop Beats community today and start exploring, creating, and making your mark on the world.
        </Paragraph>
        <Paragraph className={styles.footer} data-cy="footer">
          <p>
            <strong>Questions? </strong>
            <a href="mailto:info@orangemusicent.com">info@orangemusicent.com</a>
          </p>
          <p>
            Check out our change logs{' '}
            <a
              href="https://intriguing-pantry-2a7.notion.site/Sweatshop-Beats-Change-Logs-8ddd377bd31e41908536cea6761ab622?pvs=4"
              target="_blank"
              data-cy="changelog-link"
            >
              here.
            </a>
          </p>
          <strong>Follow us on Twitter/X</strong>
          <strong>CEO:</strong>
          <a href="https://twitter.com/bontanamrown">@bontanamrown</a>
          <strong>CTO:</strong>
          <a href="https://twitter.com/mgallucci_cto">@mgallucci_cto</a>
        </Paragraph>
      </Typography>
    </>
  );
}
