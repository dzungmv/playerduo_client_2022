import { useState } from 'react';
import classNames from 'classnames/bind';
import { useDispatch, useSelector } from 'react-redux';
import StarRatings from 'react-star-ratings';
import { toast } from 'react-toastify';
import VNnum2words from 'vn-num2words';
import Tippy from '@tippyjs/react';
// import { DateSelect } from 'react-ymd-date-select/dist/esm/presets/mui';

import followApi from '@/api/followApi';
import contractApi from '@/api/contractApi';
import donateApi from '@/api/donateApi';

import {
    updateFollowing,
    updateContract,
    updateBalance,
    updateDonateHistory,
} from '@/_redux/features/user/userSlice';
import { updateFollowers } from '@/_redux/features/player/playerSlice';
import {
    handleRentModal,
    handleLoginRequiredModal,
    handleDonateModal,
    handleTopupModal,
} from '@/_redux/features/modal/modalSlice';

import { setDonate } from '@/_redux/features/player/playerSlice';

import styles from './Profile.module.scss';
import ImageCover from '@/components/ImageCover';
import Image from '@/components/Image';
import LoadingIcon from '@/layouts/LoadingIcon';
import Modal from '@/components/Modal';

const cx = classNames.bind(styles);

function Header() {
    const dispatch = useDispatch();

    const store = {
        profile: useSelector((state) => state.player.profile),
        player: useSelector((state) => state?.player?.profile),
        following: useSelector(
            (state) => state?.user?.user?.following?.followingData
        ),
        userContract: useSelector(
            (state) => state?.user?.user?.information?.contract
        ),
        rentModal: useSelector((state) => state?.modal?.modalType?.rentModal),
        donateModal: useSelector(
            (state) => state?.modal?.modalType?.donateModal
        ),
        user: useSelector((state) => state?.user?.user?.information),
        isLogin: useSelector((state) => state?.user?.user?.isLogin),
    };

    const [time, setTime] = useState('1');

    const [followLoading, setFollowLoading] = useState(false);
    const [unFollowLoading, setUnFollowLoading] = useState(false);
    const [rentLoading, setRentLoading] = useState(false);

    // Donate
    const [money, setMoney] = useState('');
    const [donateLoading, setDonateLoading] = useState(false);
    const [displayName, setDisplayName] = useState('');
    const [message, setMessage] = useState('');

    const exeScrollRating = () => {
        const rating = document.getElementById('rating__container');

        rating.scrollIntoView();
    };

    const moneyRent = store?.player?.player?.fee * parseInt(time);

    const handleClick = {
        follow: async () => {
            try {
                setFollowLoading(true);
                const { data } = await followApi.post(
                    `v1/player/${store?.player?.id}/follower`
                );

                dispatch(updateFollowing(data?.data?.following));
                dispatch(updateFollowers(data?.data?.playerFollower));

                setFollowLoading(false);
            } catch (error) {
                toast.error(
                    error?.response?.data?.error || "Something's wrong"
                );
                setFollowLoading(false);
            }
        },
        unfollow: async () => {
            try {
                setUnFollowLoading(true);
                const { data } = await followApi.put(
                    `v1/player/${store?.player?.id}/follower`
                );

                dispatch(updateFollowing(data?.data?.following));
                dispatch(updateFollowers(data?.data?.playerFollower));

                setUnFollowLoading(false);
            } catch (error) {
                toast.error(error?.response?.data?.error);
                setUnFollowLoading(false);
            }
        },
        rentModal: () => {
            if (store?.isLogin === false) {
                dispatch(handleLoginRequiredModal(true));
                return;
            }
            dispatch(handleRentModal(true));
        },
        rent: async () => {
            if (store?.user?.balance < store?.player?.player?.fee) {
                toast.error('Your balance is not enough, please top up!');
                dispatch(handleTopupModal(true));
                return;
            }

            if (moneyRent > store?.user?.balance) {
                toast.error('Your balance is not enough, please top up!');
                dispatch(handleTopupModal(true));
                return;
            }
            try {
                setRentLoading(true);
                const { data } = await contractApi.post(`v1/contract`, {
                    player: store?.player?.id,
                    time,
                });

                dispatch(updateContract(data?.data?.contract));
                dispatch(handleTopupModal(false));
                setRentLoading(false);
                dispatch(handleRentModal(false));
                toast.success('Rent successfully!');
            } catch (e) {
                toast.error(e?.response?.data?.error);
                setRentLoading(false);
            }
        },
        donateModal: () => {
            if (store?.isLogin === false) {
                dispatch(handleLoginRequiredModal(true));
                return;
            }
            dispatch(handleDonateModal(true));
        },

        donate: async () => {
            if (store?.user?.balance < money) {
                toast.error('Your balance is not enough, please top up!');
                dispatch(handleDonateModal(false));
                dispatch(handleTopupModal(true));
                return;
            }
            if (
                money === '' ||
                money === 0 ||
                money === '0' ||
                money === '0.0' ||
                money === '0.00'
            ) {
                toast.error('Please enter a valid amount');
                return;
            }

            if (displayName === '') {
                toast.error('Please enter a display name');
                return;
            }

            try {
                setDonateLoading(true);
                const { data } = await donateApi.post(
                    `v1/player/${store?.profile?.id}/donate`,
                    {
                        money,
                        displayName,
                        message,
                    }
                );
                dispatch(updateBalance(data?.data?.balance));
                dispatch(updateDonateHistory(data?.data?.donateHistory));
                dispatch(setDonate(data?.data?.topDonate));
                setDonateLoading(false);
                toast.success(
                    `Donate ${parseInt(money).toLocaleString()} VND for ${
                        store?.player?.nickname
                    } successfully!`
                );

                dispatch(handleDonateModal(false));
                setDisplayName('');
                setMoney('');
                setMessage('');
            } catch (err) {
                toast.error(
                    err?.response?.data?.error || 'Something went wrong'
                );
                setDonateLoading(false);
            }
        },
    };

    // const formatNumberOnChange = (value) => {
    //     const number = Number(value.replace(/\D/g, ''));
    //     setMoney(number);
    // };

    return (
        <>
            <div className={cx('header')}>
                <div className={cx('header__container')}>
                    <div className={cx('cover__photo')}>
                        <ImageCover
                            src={store?.player?.coverImage || ''}
                            alt=''
                        />
                    </div>
                    <div className={cx('avatar')}>
                        <div className={cx('avatar__image')}>
                            {store?.player?.avatar ? (
                                <img src={store?.player?.avatar} alt='' />
                            ) : (
                                <Image src={''} alt='' />
                            )}
                        </div>
                    </div>

                    <div className={cx('info')}>
                        <div className={cx('info__left')}>
                            <div className={cx('name')}>
                                <div className={cx('name__wrapper')}>
                                    {store?.player?.nickname}
                                </div>

                                <div className={cx('follow')}>
                                    {followLoading || unFollowLoading ? (
                                        <LoadingIcon />
                                    ) : (
                                        store?.player?.nickname &&
                                        (store.following ? (
                                            store.following?.filter(
                                                (item) =>
                                                    item?.player_id ===
                                                    store?.player?.id
                                            ).length === 0 ? (
                                                <div
                                                    className={cx(
                                                        'follow__btn'
                                                    )}
                                                    onClick={handleClick.follow}
                                                >
                                                    +&nbsp;Follow
                                                </div>
                                            ) : (
                                                <div
                                                    className={cx(
                                                        'followed__btn'
                                                    )}
                                                    onClick={
                                                        handleClick.unfollow
                                                    }
                                                >
                                                    <i
                                                        className={cx(
                                                            'fa-regular fa-check'
                                                        )}
                                                    ></i>
                                                    &nbsp;Followed
                                                </div>
                                            )
                                        ) : null)
                                    )}
                                </div>
                            </div>
                            <div className={cx('game__play')}>
                                {store?.player?.get_game &&
                                store?.player?.get_game?.length > 0
                                    ? store?.player?.get_game?.map(
                                          (data, index) => {
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
                                          }
                                      )
                                    : null}
                            </div>
                            <div className={cx('achie')}>
                                <div className={cx('achie__item')}>
                                    <span>Follower</span>
                                    <p>
                                        {store?.player?.player?.follower || 0}
                                    </p>
                                </div>

                                <div className={cx('achie__item')}>
                                    <span>Has been active</span>
                                    <p>
                                        {store?.player?.player?.hiredTime} hours
                                    </p>
                                </div>

                                <div className={cx('achie__item')}>
                                    <span>Completion rate</span>
                                    <p>
                                        {store?.player?.player?.completeRate}%
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className={cx('info__right')}>
                            <div className={cx('services')}>
                                <div className={cx('info__price')}>
                                    <span>
                                        {store?.player?.player?.fee.toLocaleString()}
                                        &nbsp;VND/hour
                                    </span>
                                </div>
                                <div className={cx('info__rating')}>
                                    <div className={cx('info__rating-star')}>
                                        <StarRatings
                                            rating={
                                                store?.player?.player?.avgRate
                                            }
                                            starRatedColor='#ffcd3c'
                                            // changeRating={this.changeRating}
                                            numberOfStars={5}
                                            name='rating'
                                        />
                                    </div>
                                    <div>
                                        ({store?.player?.player?.avgRate}
                                        &nbsp;ratings)
                                    </div>
                                </div>
                            </div>

                            <div className={cx('info__action')}>
                                <div
                                    className={cx(
                                        'info__action-btn',
                                        'donate__btn'
                                    )}
                                    onClick={handleClick.donateModal}
                                >
                                    <i
                                        className={cx(
                                            'fa-regular fa-circle-dollar-to-slot'
                                        )}
                                    ></i>
                                    Donate
                                </div>
                                <div
                                    className={cx('info__action-btn')}
                                    onClick={handleClick.rentModal}
                                >
                                    <i
                                        className={cx(
                                            'fa-solid',
                                            'fa-rectangle-history-circle-user'
                                        )}
                                    ></i>
                                    Rent
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div className={cx('navigation')}>
                        <div className={cx('navigation__left')}>
                            <div className={cx('navigation__item')}>
                                Introduction
                            </div>
                            <div
                                className={cx('navigation__item')}
                                onClick={exeScrollRating}
                            >
                                Rating
                            </div>
                        </div>
                        <div className={cx('navigation__right')}>
                            <Tippy
                                content={
                                    <div className={cx('header__tooltip')}>
                                        <div
                                            className={cx(
                                                'header__tooltip-item'
                                            )}
                                        >
                                            <i
                                                className={cx(
                                                    'fa-regular fa-bug'
                                                )}
                                            ></i>
                                            <span>Report</span>
                                        </div>
                                    </div>
                                }
                                placement='bottom'
                                interactive={true}
                                trigger='click'
                                theme='light'
                            >
                                <div className={cx('item')}>
                                    <i
                                        className={cx('fa-solid fa-ellipsis')}
                                    ></i>
                                </div>
                            </Tippy>
                        </div>
                    </div>
                </div>
            </div>

            {/* Rent modal */}
            {store.rentModal && (
                <Modal
                    title='Rent player'
                    show={store.rentModal}
                    close={() => dispatch(handleRentModal(false))}
                    size={'small'}
                >
                    <div className={cx('rent__modal')}>
                        <div className={cx('user')}>
                            <div className={cx('user__avatar')}>
                                <img src={store?.player?.avatar} alt='avatar' />
                            </div>
                            <div className={cx('user__name')}>
                                {store?.player?.nickname}
                            </div>
                        </div>
                        <div className={cx('rent__item')}>
                            <div className={cx('rent__item-title')}>
                                Time to rent
                            </div>
                            <div className={cx('rent__item-content')}>
                                <select
                                    value={time}
                                    className={cx('form-control')}
                                    onChange={(e) => setTime(e.target.value)}
                                >
                                    <option value='1'>1 hour</option>
                                    <option value='2'>2 hours</option>
                                    <option value='3'>3 hours</option>
                                    <option value='4'>4 hours</option>
                                    <option value='5'>5 hours</option>
                                    <option value='6'>6 hours</option>
                                    <option value='7'>7 hours</option>
                                    <option value='8'>8 hours</option>
                                    <option value='9'>9 hours</option>
                                    <option value='10'>10 hours</option>
                                    <option value='11'>11 hours</option>
                                    <option value='12'>12 hours</option>
                                </select>
                            </div>
                        </div>

                        <div className={cx('rent__item')}>
                            <div className={cx('rent__item-title')}>Cost</div>
                            <div className={cx('rent__item-content')}>
                                <span>
                                    {moneyRent.toLocaleString()}
                                    &nbsp;VND
                                </span>
                            </div>
                        </div>

                        <div className={cx('rent__item')}>
                            <div className={cx('rent__item-title')}>
                                Your balance
                            </div>
                            <div className={cx('rent__item-content')}>
                                {store?.user?.balance <
                                    store?.player?.player?.fee && (
                                    <div
                                        className={cx('top__up-btn')}
                                        onClick={() => {
                                            dispatch(handleRentModal(false));
                                            dispatch(handleTopupModal(true));
                                        }}
                                    >
                                        <i
                                            className={cx(
                                                'fa-regular fa-circle-plus'
                                            )}
                                        ></i>
                                    </div>
                                )}
                                <span
                                    className={cx(
                                        store?.user?.balance >=
                                            store?.player?.player?.fee
                                            ? 'user__money'
                                            : 'user__money-not-enough'
                                    )}
                                >
                                    {store?.user?.balance?.toLocaleString()}
                                    &nbsp;VND
                                </span>
                            </div>
                        </div>

                        <div className={cx('form__action')}>
                            <button
                                className={cx('form__btn-close')}
                                onClick={() => dispatch(handleRentModal(false))}
                            >
                                Close
                            </button>

                            <div className={cx('form__btn-primary')}>
                                {rentLoading ? (
                                    <LoadingIcon />
                                ) : (
                                    <button onClick={handleClick.rent}>
                                        Rent
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Donate modal */}
            {store.donateModal && (
                <Modal
                    title='Donate'
                    show={store.donateModal}
                    close={() => dispatch(handleDonateModal(false))}
                    size={'medium'}
                >
                    <div className={cx('donate__modal')}>
                        <div className={cx('donate__item')}>
                            <div className={cx('donate__item-title')}>
                                Receiver:
                            </div>
                            <div className={cx('donate__item-content')}>
                                <span className={cx('name__player')}>
                                    {store?.player?.nickname}
                                </span>
                            </div>
                        </div>

                        <div className={cx('donate__item')}>
                            <div className={cx('donate__item-title')}>
                                Current balance:
                            </div>
                            <div className={cx('donate__item-content')}>
                                {store?.user?.balance?.toLocaleString()} VND
                            </div>
                        </div>

                        <div className={cx('donate__item')}>
                            <div className={cx('donate__item-title')}>
                                The amount to Donate:
                            </div>
                            <div className={cx('donate__item-content')}>
                                <div>
                                    <input
                                        value={money}
                                        type='number'
                                        required
                                        onChange={(e) =>
                                            setMoney(e.target.value)
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={cx('donate__item')}>
                            <div className={cx('donate__item-title')}>
                                Display name:
                            </div>
                            <div className={cx('donate__item-content')}>
                                <input
                                    value={displayName}
                                    type='text'
                                    required
                                    onChange={(e) =>
                                        setDisplayName(e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <div className={cx('display')}>
                            <span>Money number: </span>
                            <span className={cx('display__money')}>
                                {money && money > 0
                                    ? parseInt(money).toLocaleString() + 'VND'
                                    : null}
                            </span>
                        </div>

                        <div className={cx('display')}>
                            <span>Money text: </span>
                            <span className={cx('display__money')}>
                                {money && money > 0
                                    ? VNnum2words(money) + ' đồng'
                                    : null}
                            </span>
                        </div>

                        <div className={cx('display')}>
                            <span>Service fee: </span>
                            <span className={cx('display__money')}>
                                {money && money > 0
                                    ? (money * 0.1).toLocaleString() + 'VND'
                                    : null}
                            </span>
                        </div>

                        <div className={cx('donate__messenger')}>
                            <textarea
                                value={message}
                                className={cx('text__area')}
                                name=''
                                id=''
                                placeholder='Type your message here...'
                                onChange={(e) => setMessage(e.target.value)}
                            ></textarea>
                        </div>

                        <div className={cx('form__action')}>
                            <button
                                className={cx('form__btn-close')}
                                onClick={() =>
                                    dispatch(handleDonateModal(false))
                                }
                            >
                                Close
                            </button>

                            <div className={cx('form__btn-primary')}>
                                {donateLoading ? (
                                    <LoadingIcon />
                                ) : (
                                    <button onClick={handleClick.donate}>
                                        Donate
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
        </>
    );
}

export default Header;
