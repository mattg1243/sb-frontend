
import Layout, { Content, Footer } from 'antd/es/layout/layout';
import { Typography, Divider } from 'antd';
import Navbar from '../../Navbar';
import styles from './About.module.css';
import balloonLogo from '../../../assets/orangelogo.png';

export default function AboutPage() {
  
  const { Title, Paragraph, Text, Link } = Typography;
  
  return (  
    <>
      <Layout>
        <Navbar />
        <Content style={{ display: 'flex', justifyContent: 'center' }}>
          <img src={balloonLogo} alt='Balloon Logo' className={styles.logo} />
          <Typography className={styles.typography}>
            <Title className={styles.about}>About Us</Title>
            
            <Paragraph>
              <strong>Who we are: </strong>
              Sweatshop Beats is the world's first beat subscription platform, providing musicians with a
              wealth of high-quality beats at an affordable price while increasing the earnings potential of
              all producers.
            </Paragraph>
            
            <Paragraph>
              At the heart of our company is a commitment to democratizing the music-making process and 
              empowering artists to unleash their full creative potential.
            </Paragraph>
            
            <Paragraph>
              <strong>How it started: </strong>
              The company was founded in 2022 by Montana Brown and Matt Gallucci. Montana is the head of the 
              company and Matt is an expert in development. Together they ensure that the platform is always at
              the cutting edge of technology and user experience.
            </Paragraph>
            
            <Paragraph>
              Our mission is to make the music industy more accessible to everyone, breaking down barriers
              and making a high-quality beats marketplace accessible to musicians and producers around the world.
            </Paragraph>

            <Paragraph>
              <strong>How it works: </strong>
              Our platform is user-friendy and offers a constantly expanding library of beats. Producers upload
              beats, and artists subscribe to recieve creatids each month to download the beats the need.
            </Paragraph>
            
            <Paragraph>
              With a user-friendly interface, a growing library of beats, and a commitment to excellence,
              Sweatshop Beats is the ideal destination for musicians and producers who want to take their
              craft to the next level.
            </Paragraph>

            <Paragraph>
              Join the Sweatshop Beats community today and start exploring, creating, and making your mark
              on the world.
            </Paragraph>
            <Paragraph className={styles.footer}>
              <p><strong>Questions? </strong> info@orangemusicent.com</p>
              <strong>Follow us on Twitter</strong>
              @mattg  @montanab
            </Paragraph>
          </Typography>
        </Content>
      </Layout>
    </>
  )
}