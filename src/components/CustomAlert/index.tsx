import { Alert } from 'antd';
import { AlertObj } from '../../types';

export default function CustomAlert(props: AlertObj) {
  // destructure props
  const { status, message } = props;

  if (status === 'none') {
    return <></>;
  } else {
    return (
      <Alert
        message={message}
        type={status}
        showIcon
        style={{ maxWidth: '50%', padding: '1rem', margin: 'auto' }}
        closable={true}
        className="custom-alert"
      />
    );
  }
}
