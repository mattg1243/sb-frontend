import React, { SetStateAction, useEffect } from 'react';
import { Button } from 'antd';
import { ArrowLeftOutlined, ReloadOutlined, CaretRightOutlined, HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Beat } from '../../../types';
import { AxiosResponse } from 'axios';
import { getSimilarBeats } from '../../../lib/axios';
import styles from './BeatPage.module.css';

const isMobile = window.innerWidth < 480;

const BackButton: React.FC = () => {
  const navigate = useNavigate();

  const handleBackButtonClick = () => {
    navigate(-1);
  };

  useEffect(() => {
    const prevScrollPos = window.pageYOffset;
    return () => {
      window.scrollTo(0, prevScrollPos);
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: isMobile ? '1vh' : '10vh',
        left: '15px',
        zIndex: 1,
      }}
    >
      <Button
        type="text"
        shape="circle"
        icon={<ArrowLeftOutlined style={{ fontSize: '28px' }} />}
        onClick={handleBackButtonClick}
        style={{
          backgroundColor: 'transparent',
          color: 'black',
          width: '50px',
          height: '50px',
        }}
      />
    </div>
  );
};

const HomeButton = () => {
  const navigate = useNavigate();

  const handleBackButtonClick = () => {
    navigate('/app/dash');
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: isMobile ? '1vh' : '10vh',
        right: '15px',
        zIndex: 1,
      }}
    >
      <Button
        type="text"
        shape="circle"
        icon={<HomeOutlined style={{ fontSize: '28px' }} />}
        onClick={handleBackButtonClick}
        style={{
          backgroundColor: 'transparent',
          color: 'black',
          width: '50px',
          height: '50px',
        }}
      />
    </div>
  );
};

interface RefreshButtonProps {
  beatId: string;
  setSimilarBeats: React.Dispatch<SetStateAction<Beat[] | undefined>>;
  setLoading: (isLoading: boolean) => void;
}

const RefreshButton = (props: RefreshButtonProps) => {
  const handleRefreshButtonClick = async () => {
    try {
      props.setLoading(true);
      const res = await getSimilarBeats(props.beatId);
      props.setLoading(false);
      props.setSimilarBeats(res.data.beats as Beat[]);
    } catch (error) {
      console.error('Error fetching similar beats:', error);
      props.setLoading(false);
    }
  };

  return (
    <div className={styles['refresh-button-div']}>
      <Button
        type="text"
        shape="circle"
        icon={<ReloadOutlined style={{ fontSize: '20px' }} />}
        onClick={handleRefreshButtonClick}
        style={{
          backgroundColor: 'transparent',
          color: 'black',
          width: '50px',
          height: '50px',
        }}
      />
    </div>
  );
};

export { BackButton, HomeButton, RefreshButton };
