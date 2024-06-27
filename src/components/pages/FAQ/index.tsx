import { Layout, Typography } from 'antd';
import styles from './FAQ.module.css';
import balloonLogo from '../../../assets/orangelogo.png';
import Navbar from '../../Navbar';
import sections from './sections.data';
import HideIcon from '../../../assets/hide.png';
import ShowIcon from '../../../assets/view.png';
import { useEffect, useState } from 'react';
type Props = {
  children: React.ReactNode;
};

type SectionProps = Props & {
  header: string;
  number: number;
};

//Component that harbors the main part of the webpage, excluding the navbar.
function Viewport({ children }: Props) {
  return <div className={styles.viewport}>{children}</div>;
}

//An individual FAQ section
function Section({ header, children, number }: SectionProps) {
  const [_toggle_status, _set_toggle] = useState(true);
  const [_div_height, _set_div_height] = useState('');

  function transition_effect(open_status: boolean) {
    if (open_status) {
      return {
        maxHeight: _div_height,
        opacity: 1,
      };
    } else {
      return {
        maxHeight: '0vh',
        opacity: 0,
      };
    }
  }
  useEffect(() => {
    //Grab the section body paragraph, i.e. section body content
    const current_section_body_para: any = document.querySelector(`#section_body_${number} > p`);
    //Get its margin information and calculate total height of content
    const current_style = window.getComputedStyle(current_section_body_para);
    //set the section body max-height to the computer total height of content
    _set_div_height(current_section_body_para.offsetHeight + 2 * parseInt(current_style.marginTop));
  }, []);

  return (
    <>
      <div
        id={`section_${number}`}
        className={styles.section_container}
        onClick={(event) => {
          _set_toggle(!_toggle_status);
        }}
      >
        <div className={styles.section_header}>
          <img
            alt={_toggle_status ? 'toggle_on' : 'toggle_off'}
            className={styles.section_header_toggle}
            src={_toggle_status ? ShowIcon : HideIcon}
          />
          {header}
        </div>
        <div id={`section_body_${number}`} className={styles.section_body} style={transition_effect(_toggle_status)}>
          {children}
        </div>
      </div>
    </>
  );
}

//The body of the FAQ component. It contains all the FAQ sections.
function FAQBody() {
  const FAQSections = sections.map(({ header, content }, i) => {
    return (
      <Section key={i + '_section'} header={header} number={i}>
        {content}
      </Section>
    );
  });
  return <div className={styles.faq_container}>{FAQSections}</div>;
}

//The FAQ webpage
export default function FAQ() {
  const { Title } = Typography;

  return (
    <Layout>
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
    </Layout>
  );
}
