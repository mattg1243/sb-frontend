import { Alert } from "antd";
import { AlertObj } from "../../types";

export default function CustomAlert(props: AlertObj) {
  // destructure props
  const { status, message } = props;

  if (status === 'none') {
    return <></>
  } else {
    return <Alert message={message} type={status} showIcon style={{ width: '50%', margin: 'auto' }} />
  }
}