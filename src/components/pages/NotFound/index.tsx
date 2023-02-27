import { Content, Header } from 'antd/lib/layout/layout';
import { Layout, Row, Col, Button, Space } from 'antd';
import Navbar from '../../Navbar';
import styles from './NotFound.module.css';
import grapes from '../../../assets/grapes.png';

export default function NotFound() {

  return (
    <Layout>
      <Navbar />
      <Content>
	  <div className={styles.container}>
	    <h1 className={styles.fourhundredfour}>404</h1>
	    <img src={grapes} alt="Not an Orange" className={styles.grapes} />
		<div><p className={styles.thetext}>this is not an orange</p>
		<p className={styles.thetext}>you've reached a page that does not exist</p></div>
	  </div>
      </Content>
    </Layout>
  );
}