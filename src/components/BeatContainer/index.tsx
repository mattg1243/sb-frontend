import { Spin } from 'antd';
import useGetBeats, { IUseGetBeatsOptions } from '../../hooks/useGetBeats';
import DashRow from '../DashRow';
import styles from './BeatContainer.module.css';

interface IBeatContainerProps {
  options: IUseGetBeatsOptions;
}

export default function BeatContainer(props: IBeatContainerProps) {
  const { options } = props;

  const { beats, isLoading } = useGetBeats(options);

  return (
    <div className={styles['beats-container']}>
      {beats && !isLoading
        ? beats.map((beat) => {
            return <DashRow beat={beat} buttonType="download" onClick={() => console.log('row clicked')} />;
          })
        : null}
      {!beats && !isLoading ? <p>No beats found :(</p> : null}
      {isLoading ? <Spin /> : null}
    </div>
  );
}
