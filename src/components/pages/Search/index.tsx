import { useEffect, useState } from 'react';
import { User } from '../../../types/user';
import { Beat } from '../../../types/beat';
import { INotificationProps } from '../../Notification';
import { searchBeatsReq } from '../../../lib/axios';
import { playback } from '../../../reducers/playbackReducer';
import styles from './Search.module.css';
import { useLocation } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch } from 'react-redux';
import DashRow from '../../DashRow';
import { Spin } from 'antd';

export default function SearchPage() {
  const [loading, setLoading] = useState<boolean>();
  const [results, setResults] = useState<Beat[]>([]);
  const [moreResults, setMoreResults] = useState<boolean>(true);
  const [entity, setEntity] = useState<'beats' | 'users'>();
  const [msg, setMsg] = useState<INotificationProps>();

  const isMobile = window.innerWidth < 480;

  const dispatch = useDispatch();
  const { search } = useLocation();
  const query = new URLSearchParams(search).get('query') as string;

  useEffect(() => {
    if (query) {
      setResults([]);
      setLoading(true);
      searchBeatsReq(query)
        .then((res) => setResults(res.data.beats))
        .catch((err) => {
          console.error(err);
          setMsg({ type: 'error', message: err.data.msg });
        })
        .finally(() => setLoading(false));
    }
  }, [query]);

  const fetchMoreBeats = async () => {
    try {
      const res = await searchBeatsReq(query, results?.length, 10);
      if (res.data.beats.length === 0) {
        setMoreResults(false);
      } else {
        setResults([...results, ...res.data.beats]);
      }
    } catch (err) {
      setMsg({ type: 'error', message: 'An unknown server error occured.' });
      console.error(err);
    }
  };

  return (
    <div style={{ width: '100vw' }}>
      <div>
        <h2 className={styles['search-results-text']}>Search Results</h2>
      </div>
      <div className={styles['scroll-div']}>
        <InfiniteScroll
          dataLength={results.length || 8}
          hasMore={moreResults}
          next={fetchMoreBeats}
          height="100vh"
          style={{
            paddingBottom: '5vh',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: isMobile ? '0' : '-20vw',
            overflowX: 'hidden',
          }}
          scrollThreshold={0.8}
          loader={<h4 style={{ marginLeft: isMobile ? '0' : '-26vw' }}>Loading beats...</h4>}
          endMessage={<p style={{ marginLeft: isMobile ? '0' : '-26vw' }}>You've seen all the search results</p>}
          className={styles['beats-container']}
          data-cy="beats-container"
        >
          <Spin spinning={loading}>
            {results
              ? results.map((beat) => {
                  return (
                    <DashRow
                      beat={beat}
                      onClick={() => {
                        dispatch(playback(beat));
                      }}
                      buttonType="license"
                      key={beat._id}
                    />
                  );
                })
              : null}
          </Spin>
        </InfiniteScroll>
      </div>
    </div>
  );
}
