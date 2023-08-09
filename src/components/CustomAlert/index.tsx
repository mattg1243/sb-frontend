import { Alert } from 'antd';
import { AlertObj } from '../../types';
import styles from './CustomAlert.module.css';

export default function CustomAlert(props: AlertObj) {
  // destructure props
  const { status, message } = props;

  if (status === 'none') {
    return <></>;
  } else {
    return <Alert message={message} type={status} showIcon closable={true} className={styles['custom-alert']} />;
  }
}
