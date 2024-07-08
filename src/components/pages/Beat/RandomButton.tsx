import { getRandomBeatReq } from '../../../lib/axios';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { GiRollingDices } from 'react-icons/gi';
import styles from './BeatPage.module.css';

const isMobile = window.innerWidth < 480;

export default function RandomButton() {
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      const { data } = await getRandomBeatReq();
      navigate(`/app/beat?id=${data._id}`);
    } catch (err) {
      console.error('Error fetching random beat:', err);
    }
  };

  return (
    <Button
      type="text"
      shape="circle"
      icon={<GiRollingDices style={{ fontSize: isMobile ? '48px' : '38px', position: 'relative' }} />}
      onClick={handleClick}
      className={styles.button}
    />
  );
}
