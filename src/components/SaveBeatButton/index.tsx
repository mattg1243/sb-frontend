import { useState, useEffect } from 'react';
import { Button } from 'antd';
import { SaveOutlined, DeleteOutlined } from '@ant-design/icons';
import { saveBeatReq, unsaveBeatReq, isBeatSavedReq } from '../../lib/axios';
import styles from './SaveBeatButton.module.css';

interface ISaveBeatButtonProps {
  beatId: string;
  display: 'icon' | 'button';
}

export default function SaveBeatButton(props: ISaveBeatButtonProps): JSX.Element {
  const { beatId, display } = props;

  const [saved, setSaved] = useState<boolean>(false);

  useEffect(() => {
    isBeatSavedReq(beatId)
      .then((res) => {
        setSaved(res.data);
      })
      .catch((err) => console.log(err));
  }, [beatId]);

  const handleClick = async () => {
    try {
      if (saved) {
        await unsaveBeatReq(beatId);
      } else {
        await saveBeatReq(beatId);
      }
      setSaved(!saved);
    } catch (err) {
      console.error(err);
    }
  };

  const button = (
    <Button onClick={() => handleClick()} className={styles['big-btn']}>
      {saved ? 'Unsave' : 'Save'}
    </Button>
  );

  const icon = saved ? (
    <DeleteOutlined onClick={() => handleClick()} />
  ) : (
    <SaveOutlined onClick={() => handleClick()} />
  );

  return display === 'icon' ? icon : button;
}
