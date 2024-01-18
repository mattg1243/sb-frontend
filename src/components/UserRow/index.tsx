import { useEffect, useState } from 'react';
import { User } from '../../types';
import { getUserIdFromLocalStorage } from '../../utils/localStorageParser';
import axios from 'axios';
import styles from './UserRow.module.css';
import gatewayUrl, { imgCdnHostName } from '../../config/routing';
import { Avatar, Row, Statistic } from 'antd';
import { useNavigate } from 'react-router-dom';
import FollowButton from '../FollowButton';
import { getFollowersReq } from '../../lib/axios';

interface IUserRowProps {
  user: User;
}

const isMobile: boolean = window.innerWidth < 480;

export default function UserRow(props: IUserRowProps) {
  const { user } = props;

  const currentUser = getUserIdFromLocalStorage();

  const [uploadCount, setUploadCount] = useState<number>();
  const [followerCount, setFollowerCount] = useState<number>();

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${gatewayUrl}/beats/beats-count?user=${user._id}`)
      .then((res) => setUploadCount(res.data.count))
      .catch((err) => console.error(err));
    getFollowersReq(user._id).then((res) => setFollowerCount(res.data.followers.length));
  });

  return (
    <>
      <Row className={styles['row-container']} style={{ paddingLeft: '6rem' }}>
        <Row style={{ alignItems: 'center', marginRight: 'auto', paddingLeft: '1vw' }}>
          <Avatar
            src={`${imgCdnHostName}/${user.avatar}`}
            size={isMobile ? 75 : 125}
            onClick={() => {
              navigate(`/app/user?id=${user._id}`);
            }}
            className={styles.avatar}
            style={{ marginRight: '3vw' }}
          />
          <div className={styles['text-container']}>
            <h2 style={{ textAlign: 'start' }}>{user.artistName}</h2>
            {/* this needs to have a fixed width and not wrap on text overflow */}
            <strong
              style={{
                textAlign: 'start',
                maxWidth: '250px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {user.bio}
            </strong>
            <p style={{ textAlign: 'start' }}>
              Joined{' '}
              {new Date(user.created_at).toLocaleDateString('en-us', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </p>
          </div>
        </Row>
        <Row style={{ alignItems: 'flex-end', paddingRight: '15vw' }}>
          <Row style={{ paddingRight: '5vw' }}>
            <Statistic style={{ paddingRight: '2vw' }} title="Uploads" value={uploadCount} />
            <Statistic title="Followers" value={followerCount} />
          </Row>
          <FollowButton currentUser={currentUser as string} viewedUser={user._id} />
        </Row>
      </Row>
    </>
  );
}
