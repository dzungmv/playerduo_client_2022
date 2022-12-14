import classNames from 'classnames/bind';
import { useDispatch, useSelector } from 'react-redux';
import StarRatings from 'react-star-ratings';
import { NavLink } from 'react-router-dom';

import ModalEditProfile from './ModalEditProfile';
import PostModal from './PostModal';
import {
    handleModalEditProfile,
    handlePostModal,
} from '@/_redux/features/modal/modalSlice';

import styles from './Profile.module.scss';
import Image from '@/components/Image';
import ImageCover from '@/components/ImageCover';
const cx = classNames.bind(styles);

function Header({ exeScrollRating }) {
    const dispatch = useDispatch();
    const user = useSelector((state) => state?.user?.user?.information);

    const editProfileModal = useSelector(
        (state) => state?.modal?.modalType?.modalEditProfile
    );

    const postModal = useSelector((state) => state?.modal?.modalType.postModal);

    const handleClick = {
        editProfileModal: () => {
            dispatch(handleModalEditProfile(true));
        },
        postModal: () => {
            dispatch(handlePostModal(true));
        },
    };

    return (
        <>
            <div className={cx('header')}>
                <div className={cx('header__container')}>
                    <div className={cx('cover__photo')}>
                        <ImageCover
                            src={user?.coverImage ? user.coverImage : ''}
                            alt=''
                        />
                    </div>
                    <div className={cx('avatar')}>
                        <div className={cx('avatar__image')}>
                            {user?.avatar && user?.avatar.length > 0 ? (
                                <img src={user?.avatar} alt='avatar' />
                            ) : (
                                <Image src='' alt='avatar' />
                            )}
                        </div>
                    </div>

                    <div className={cx('info')}>
                        <div className={cx('info__left')}>
                            <div className={cx('name')}>
                                <span>{user?.nickname}</span>
                            </div>
                            <div className={cx('game__play')}>
                                {user?.gamePlay?.map((data, index) => {
                                    return index < 5 ? (
                                        <img key={index} src={data} alt='' />
                                    ) : index === 5 ? (
                                        <div
                                            key={index}
                                            className={cx('game__play-image')}
                                            style={{
                                                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${data})`,
                                            }}
                                        >
                                            <i
                                                className={cx(
                                                    'fa-regular',
                                                    'fa-ellipsis'
                                                )}
                                            ></i>
                                        </div>
                                    ) : null;
                                })}
                            </div>
                            <div className={cx('game__play')}>
                                {user?.get_game && user?.get_game?.length > 0
                                    ? user?.get_game?.map((data, index) => {
                                          return index < 5 ? (
                                              <img
                                                  key={data.id}
                                                  src={data.gameImg}
                                                  alt='game'
                                              />
                                          ) : index === 5 ? (
                                              <div
                                                  key={data.id}
                                                  className={cx(
                                                      'game__play-image'
                                                  )}
                                                  style={{
                                                      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${data.gameImg})`,
                                                  }}
                                              >
                                                  <i
                                                      className={cx(
                                                          'fa-regular',
                                                          'fa-ellipsis'
                                                      )}
                                                  ></i>
                                              </div>
                                          ) : null;
                                      })
                                    : null}
                            </div>
                            <div className={cx('achie')}>
                                <div className={cx('achie__item')}>
                                    <span>Follower</span>
                                    <p>{user?.player?.follower || 0}</p>
                                </div>

                                <div className={cx('achie__item')}>
                                    <span>Has been active</span>
                                    <p>{user?.player?.hiredTime || 0} hours</p>
                                </div>

                                <div className={cx('achie__item')}>
                                    <span>Completion rate</span>
                                    <p>{user?.player?.completeRate || 0}%</p>
                                </div>
                            </div>
                        </div>

                        <div className={cx('info__right')}>
                            <div className={cx('services')}>
                                <div className={cx('info__price')}>
                                    <span>
                                        {user?.player?.fee.toLocaleString()}
                                        &nbsp;VND/hour
                                    </span>
                                </div>
                                <div className={cx('info__rating')}>
                                    <div className={cx('info__rating-star')}>
                                        <StarRatings
                                            rating={user?.player?.avgRate}
                                            starRatedColor='#ffcd3c'
                                            // changeRating={this.changeRating}
                                            numberOfStars={5}
                                            name='rating'
                                        />
                                    </div>
                                    <div>
                                        ({user?.player?.avgRate}
                                        &nbsp;ratings)
                                    </div>
                                </div>
                            </div>
                            <div className={cx('info__action')}>
                                {(user?.post === null ||
                                    (user?.post &&
                                        user?.post?.type === null)) && (
                                    <div
                                        className={cx('info__action-btn')}
                                        onClick={handleClick.postModal}
                                    >
                                        <i
                                            className={cx(
                                                'fa-solid fa-circle-plus'
                                            )}
                                        ></i>
                                        Add to information
                                    </div>
                                )}
                                <div
                                    className={cx(
                                        'info__action-btn',
                                        'edit__btn'
                                    )}
                                    onClick={handleClick.editProfileModal}
                                >
                                    <i className={cx('fa-solid fa-pen')}></i>
                                    Edit profile
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div className={cx('navigation')}>
                        <NavLink
                            to={`/user/profile/${user.id}`}
                            className={cx('navigation__item')}
                            end
                        >
                            Introduction
                        </NavLink>

                        <NavLink
                            to={`/user/profile/${user.id}/follower`}
                            className={cx('navigation__item')}
                        >
                            Follower
                        </NavLink>

                        <NavLink
                            to={`/user/profile/${user.id}/following`}
                            className={cx('navigation__item')}
                        >
                            Following
                        </NavLink>

                        <div
                            className={cx('navigation__item')}
                            onClick={exeScrollRating}
                        >
                            Rating
                        </div>
                    </div>
                </div>
            </div>
            {editProfileModal && <ModalEditProfile />}
            {postModal && <PostModal />}
        </>
    );
}

export default Header;
