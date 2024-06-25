import React, { useState, useEffect } from 'react';
import styles from './Beats.module.css';
import SearchInput from '../../Navbar/SearchInput';
import { useNavigate } from 'react-router-dom';
import { getFeaturedBeatsReq } from '../../../lib/axios';
import DashRow from '../../DashRow';
import { type Beat } from '../../../types';
import PlaybackButtons from '../../PlaybackButtons';

const BeatsSection: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [beats, setBeats] = useState<Beat[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    getFeaturedBeatsReq()
      .then((res) => {
        setBeats(res.data.beats);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Beats For You</h1>
        <div className={styles.searchContainer}>
          <SearchInput />
          {window.innerWidth > 480 ? (
            <button className={styles.viewAllButton} onClick={() => navigate('/app/dash')}>
              View All
            </button>
          ) : null}
        </div>
      </header>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          textAlign: 'center',
          alignItems: 'center',
          margin: '5vh',
        }}
      >
        {beats.slice(0, 6).map((beat) => (
          <DashRow
            key={beat._id}
            beat={beat}
            buttonType={'license'}
            onClick={() => navigate(`/app/beat?id=${beat._id}`)}
          />
        ))}
        <button className={styles.viewAllButton} style={{ marginTop: '5vh' }} onClick={() => navigate('/app/dash')}>
          View More
        </button>
      </div>

      <PlaybackButtons />
    </div>
  );
};

export default BeatsSection;
