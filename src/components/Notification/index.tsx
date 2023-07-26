import { CheckOutlined, FrownOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { notification } from 'antd';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { notification as notificationReducer } from '../../reducers/notificationReducer';

export interface INotificationProps {
  type: 'error' | 'success' | 'info' | 'message';
  message: string;
  title?: string;
  test?: boolean;
}

export default function Notification(props: INotificationProps) {
  const [api, contextHolder] = notification.useNotification();

  const dispatch = useDispatch();

  useEffect(() => {
    notification.destroy();
    // check if in test mode
    const notificationProps = props;
    // determine the notification type
    let icon: JSX.Element;

    switch (notificationProps?.type) {
      case 'success':
        icon = <CheckOutlined color="--var(primary)" data-cy="noti-check-icon" />;
        break;
      case 'error':
        icon = <FrownOutlined color="red" data-cy="noti-frown-icon" />;
        break;
      case 'info':
        icon = <InfoCircleOutlined data-cy="noti-info-icon" />;
        break;
      default:
        icon = <InfoCircleOutlined />;
    }
    // open the notification
    api.open({
      message: notificationProps?.message,
      icon,
      key: '12lkjhsdfg',
      duration: notificationProps.test ? 0 : 10,
      onClose() {
        dispatch(notificationReducer(null));
      },
    });
  }, []);

  return <div data-cy="notification">{contextHolder}</div>;
}
