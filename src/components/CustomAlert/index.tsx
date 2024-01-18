import { Alert } from 'antd';
import { AlertObj } from '../../types';
import styles from './CustomAlert.module.css';

export default function CustomAlert(props: AlertObj) {
  // destructure props
  const { type, message } = props;

  if (!type) {
    return <></>;
  } else {
    return (
      <Alert
        message={message}
        type={type}
        showIcon
        closable={true}
        className={styles['custom-alert']}
        data-cy="custom-alert"
      />
    );
  }
}
