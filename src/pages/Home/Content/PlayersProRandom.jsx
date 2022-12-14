import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import StarRatings from 'react-star-ratings';

import userApi from '@/api/userApi';
import {
    resetProfile,
    setPlayersPro,
} from '@/_redux/features/player/playerSlice';

import styles from './Content.module.scss';
import Image from '@/components/Image';

const cx = classNames.bind(styles);

function PlayersProRandom() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const player = useSelector((state) => state?.player?.playersPro);
    const user = useSelector((state) => state?.user?.user?.information);

    const [usersPro, setUsersPro] = useState(player);
    const [gender, setGender] = useState('');

    useEffect(() => {
        setUsersPro(player);
    }, [player]);

    const [loadmore, setLoadmore] = useState(8);

    const handleClickToProfile = (id) => {
        dispatch(resetProfile());
        if (id === user.id) {
            navigate(`/user/profile/${id}`);
            return;
        }

        navigate(`/player/profile/${id}`);
    };

    // filter by gendef

    useEffect(() => {
        if (gender.length > 0) {
            const handleFilter = player.filter((user) => {
                return user.user ? user.user.gender === gender : '';
            });
            setUsersPro(handleFilter);
        } else {
            setUsersPro(player);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gender]);

    const handleUpdateProStore = async () => {
        //    reload page
        const { data } = await userApi.get('v1/player');
        dispatch(setPlayersPro(data?.data?.user));
    };

    const handleLoadMore = () => {
        if (loadmore < usersPro.length) {
            setLoadmore(usersPro.length);
        }

        if (loadmore >= usersPro.length) {
            setLoadmore(8);
        }
    };

    return (
        <div className={cx('player')}>
            <div className={cx('heading')}>
                <span className={cx('player__title')}>VIP PLAYER</span>
                <div className={cx('heading__right')}>
                    <div className={cx('filter')}>
                        <select onChange={(e) => setGender(e.target.value)}>
                            <option value=''>Filter by gender</option>
                            <option value='male'>Male</option>
                            <option value='female'>Female</option>
                        </select>
                    </div>
                    <div className={cx('reload')}>
                        <div
                            className={cx('reload__btn')}
                            onClick={handleUpdateProStore}
                        >
                            <i
                                className={cx('fa-regular fa-arrows-rotate')}
                            ></i>
                            <span>Reload</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className={cx('card__wrapper')}>
                {usersPro && usersPro.length > 0
                    ? usersPro.map((player, index) =>
                          index < loadmore ? (
                              <div
                                  className={cx('card')}
                                  key={player?.id}
                                  onClick={() =>
                                      handleClickToProfile(player?.id)
                                  }
                              >
                                  <div className={cx('card__image')}>
                                      {player?.user?.avatar &&
                                      player?.user?.avatar !== '' ? (
                                          <img
                                              src={player?.user?.avatar}
                                              alt='avatar'
                                          />
                                      ) : (
                                          <Image src='' alt='avatar' />
                                      )}
                                      {player.fee ? (
                                          <div className={cx('fee')}>
                                              <span>
                                                  {player.fee.toLocaleString()}{' '}
                                                  VND/hour
                                              </span>
                                          </div>
                                      ) : null}
                                  </div>

                                  <div className={cx('card__content')}>
                                      <div className={cx('heading')}>
                                          <div className={cx('user__name')}>
                                              <span>{player?.name}</span>
                                          </div>
                                          {player?.user && (
                                              <div className={cx('gender')}>
                                                  {player.user.gender ===
                                                  'female' ? (
                                                      <span
                                                          className={cx(
                                                              'female'
                                                          )}
                                                      >
                                                          Female
                                                      </span>
                                                  ) : (
                                                      <span
                                                          className={cx('male')}
                                                      >
                                                          Male
                                                      </span>
                                                  )}
                                              </div>
                                          )}
                                      </div>

                                      <div className={cx('bio')}>
                                          <span>{player?.description}</span>
                                      </div>

                                      <div className={cx('footer')}>
                                          <div className={cx('game__play')}>
                                              {player?.get_game &&
                                              player?.get_game.length > 0
                                                  ? player?.get_game.map(
                                                        (data, index) => {
                                                            const count =
                                                                player?.get_game
                                                                    .length - 5;
                                                            return index < 4 ? (
                                                                <img
                                                                    key={
                                                                        data.id
                                                                    }
                                                                    src={
                                                                        data.gameImg
                                                                    }
                                                                    alt=''
                                                                />
                                                            ) : index === 4 ? (
                                                                <div
                                                                    key={
                                                                        data.id
                                                                    }
                                                                    className={cx(
                                                                        'game__count'
                                                                    )}
                                                                    style={{
                                                                        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${data.gameImg})`,
                                                                    }}
                                                                >
                                                                    <span
                                                                        className={cx(
                                                                            'count'
                                                                        )}
                                                                    >
                                                                        +{count}
                                                                    </span>
                                                                </div>
                                                            ) : null;
                                                        }
                                                    )
                                                  : null}
                                          </div>
                                          <div className={cx('rating')}>
                                              <StarRatings
                                                  rating={player.avgRate}
                                                  starRatedColor='#ffcd3c'
                                                  // changeRating={this.changeRating}
                                                  numberOfStars={5}
                                                  name='rating'
                                              />
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          ) : null
                      )
                    : null}
                {/* Load more button */}
                {usersPro.length > 8 && (
                    <div className={cx('load-more')}>
                        <span onClick={handleLoadMore}>
                            {loadmore < usersPro.length
                                ? 'Load more'
                                : 'Show less'}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PlayersProRandom;
