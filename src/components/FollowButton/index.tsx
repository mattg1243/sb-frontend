import { useEffect, useState } from 'react';
import { Button } from 'antd';
import axios from 'axios';
import gatewayUrl from '../../config/routing';
import { followUserReq, unfollowUserReq } from '../../lib/axios';
import styles from './FollowButton.module.css';
import { ensureLoggedIn } from '../../utils/auth';

interface IFollowButtonProps {
  currentUser: string;
  viewedUser: string;
  stubFn?: () => void;
}

export default function FollowButton(props: IFollowButtonProps) {
  // props are the way we can pass data downt the component tree to
  // other components that may need data that the parent component already has
  const { currentUser, viewedUser, stubFn } = props;
  // State within a React component is created by calling the useState hook that
  // returns an array with two elements, the first being the data member and the
  // second being a functino that sets and updates the state
  // State can hold anything that
  const [isFollowing, setIsFollowing] = useState<boolean>();
  const [isLoading, setIsLoading] = useState<boolean>();
  // the useEffect function is a React hook that is called whenver the
  // component renders (the first time it appears on a page or when the state
  // is updated). It is useful if there are things you need to do anytime the
  // component renders.
  useEffect(() => {
    // something that needs to be done when this component is mounted is
    // determining wether or not the current user is already following the
    // user whos page they are viewing (where this button renders)
    // to do this, we have to make an API call / HTTP request to our User server
    // dont make this call if component is being tested
    if (!stubFn) {
      axios
        .get(`${gatewayUrl}/user/isfollowing?user=${currentUser}&userToCheck=${viewedUser}`)
        .then((res) => {
          setIsFollowing(res.data.isFollowing);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, []);

  const reqFn = isFollowing ? unfollowUserReq : followUserReq;

  /**
   * Wrapper function that handles loading state, making follow / unfollow request based on
   * following status and catching errors within these requests.
   */
  const followAction = async () => {
    try {
      setIsLoading(true);
      await ensureLoggedIn();
      const res = await reqFn(viewedUser);
      console.log(res);
      if (res.status === 200) {
        setIsFollowing(!isFollowing);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const clickFn = stubFn
    ? () => {
        stubFn();
        setIsLoading(true);
        setIsFollowing(!isFollowing);
        setIsLoading(false);
      }
    : async () => {
        await followAction();
      };

  return (
    <Button type="ghost" onClick={clickFn} loading={isLoading} className={styles.btn} id="follow-btn">
      {isFollowing ? 'Unfollow ' : 'Follow '}
    </Button>
  );
}
