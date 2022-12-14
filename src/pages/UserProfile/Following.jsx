import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import followApi from '@/api/followApi';

import { resetProfile } from '@/_redux/features/player/playerSlice';

import { updateFollowing } from '@/_redux/features/user/userSlice';

import { updateFollowers } from '@/_redux/features/player/playerSlice';

import classNames from 'classnames/bind';

import styles from './Profile.module.scss';

const cx = classNames.bind(styles);

function Follower() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state?.user?.user?.following);

    const findPlayerById = (id) => {
        dispatch(resetProfile());
        navigate(`/player/profile/${id}`);
    };

    const unfollow = async (player_id) => {
        try {
            const { data } = await followApi.put(
                `v1/player/${player_id}/follower`
            );

            dispatch(updateFollowing(data?.data?.following));
            dispatch(updateFollowers(data?.data?.playerFollower));
        } catch (error) {
            toast.error(error?.response?.data?.error || 'Unfollow failed');
        }
    };

    return (
        <div className={cx('follower__container')}>
            <div className={cx('container')}>
                {user.followingData && user.followingData.length > 0
                    ? user?.followingData.map((item) => {
                          return (
                              <div className={cx('item')} key={item.player_id}>
                                  <div className={cx('user__info')}>
                                      <div
                                          className={cx('user__avatar')}
                                          onClick={() =>
                                              findPlayerById(item.player_id)
                                          }
                                      >
                                          <img src={item.avatar} alt='avatar' />
                                      </div>
                                      <div
                                          className={cx('user__name')}
                                          onClick={() =>
                                              findPlayerById(item.player_id)
                                          }
                                      >
                                          {item.nickname}
                                      </div>
                                  </div>

                                  <div
                                      className={cx('user__action')}
                                      onClick={() => unfollow(item.player_id)}
                                  >
                                      Unfollow
                                  </div>
                              </div>
                          );
                      })
                    : 'No following'}
            </div>
        </div>
    );
}

export default Follower;
