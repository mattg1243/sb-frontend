import { useEffect, useState } from 'react';
import { Button } from 'antd';
import axios from 'axios';
import gatewayUrl from '../../config/routing';
import styles from './FollowButton.module.css';

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
    axios
      .get(`${gatewayUrl}/user/isfollowing?currentUser=${currentUser}&userToFollow=${viewedUser}`)
      .then((res) => {
        setIsFollowing(res.data.isFollowing);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const followUser = async (viewedUser: string) => {
    try {
      setIsLoading(true);
      const res = await axios.post(
        `${gatewayUrl}/user/follow`,
        { userToFollow: viewedUser },
        { withCredentials: true }
      );
      console.log(res);
      if (res.status === 200) {
        setIsFollowing(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const unfollowUser = async (viewedUser: string) => {
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${gatewayUrl}/user/unfollow`,
        { userToUnfollow: viewedUser },
        { withCredentials: true }
      );
      console.log(res);
      if (res.status === 200) {
        setIsFollowing(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  // check for stub fn passed to component during unit test
  const clickFn: (viewedUser: string) => void = stubFn
    ? () => {
        stubFn();
        setIsLoading(true);
        setTimeout(() => {
          console.log('done waiting for test');
        }, 1000);
        setIsLoading(false);
        setIsFollowing(!isFollowing);
      }
    : isFollowing
    ? unfollowUser
    : followUser;

  return (
    <Button
      type="ghost"
      onClick={() => {
        clickFn(viewedUser);
      }}
      loading={isLoading}
      className={styles.btn}
      id="follow-btn"
    >
      {isFollowing ? 'Unfollow 🔨' : 'Follow 🔨'}
    </Button>
  );
}
