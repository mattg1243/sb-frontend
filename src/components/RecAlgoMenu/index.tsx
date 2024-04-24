import { Dispatch, SetStateAction } from 'react';
import { Button, Dropdown, MenuProps } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import styles from './RecAlgoMenu.module.css';

export type RecAlgos = 'Recommended' | 'Following';

interface IRecAlgoProps {
  currentAlgo: RecAlgos;
  setCurrentAlgo: Dispatch<SetStateAction<RecAlgos>>;
}

export default function RecAlgoMenu(props: IRecAlgoProps) {
  // state and state setter fn from parent component
  const { currentAlgo, setCurrentAlgo } = props;

  const algoOptions: MenuProps['items'] = [
    {
      key: 'Recommended',
      label: (
        <Button
          type="ghost"
          style={{ color: 'white' }}
          onClick={() => {
            if (currentAlgo !== 'Recommended') {
              setCurrentAlgo('Recommended');
            }
          }}
          id="rec-opt"
        >
          Recommended
        </Button>
      ),
    },
    {
      key: 'Following',
      label: (
        <Button
          type="ghost"
          style={{ color: 'white' }}
          onClick={() => {
            if (currentAlgo !== 'Following') {
              setCurrentAlgo('Following');
            }
          }}
          id="fol-opt"
        >
          Following
        </Button>
      ),
    },
  ];

  // hide on mobile for now
  return window.innerWidth > 1024 ? (
    <Dropdown menu={{ items: algoOptions }} className="rec-algo-menu">
      <Button className={styles['algo-btn']}>
        {currentAlgo}
        <DownOutlined />
      </Button>
    </Dropdown>
  ) : null;
}
