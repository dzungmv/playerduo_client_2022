import { useState } from 'react';
import classNames from 'classnames/bind';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import moment from 'moment';

import LoadingIcon from '@/layouts/LoadingIcon';

import userApi from '@/api/userApi';
import imgbbApi from '@/api/imgbbApi';

import {
    setUserInformation,
    updateGame,
} from '@/_redux/features/user/userSlice';

import Modal from '@/components/Modal';
import styles from './Profile.module.scss';
import { handleModalEditProfile } from '@/_redux/features/modal/modalSlice';
import Image from '@/components/Image';
import no_game from '@/assets/icons/no-game.svg';

const cx = classNames.bind(styles);

function ModalEditProfile() {
    const dispatch = useDispatch();

    const user = useSelector((state) => state?.user?.user?.information);
    const gameList = useSelector((state) => state?.games?.games);

    const modal = useSelector(
        (state) => state.modal.modalType.modalEditProfile
    );

    const [loadingNickName, setLoadingNickName] = useState(false);
    const [loadingUrlCode, setLoadingUrlCode] = useState(false);
    const [loadingAvatar, setLoadingAvatar] = useState(false);
    const [loadingDateOfBirth, setLoadingDateOfBirth] = useState(false);
    const [loadingGender, setLoadingGender] = useState(false);
    const [loadingGame, setLoadingGame] = useState(false);
    const [loadingDescription, setLoadingDescription] = useState(false);
    const [rentMoneyLoading, setRentMoneyLoading] = useState(false);

    const [nicknameForm, setNicknameForm] = useState(false);
    const [usernameForm, setUsernameForm] = useState(false);
    const [birthdayForm, setBirthdayForm] = useState(false);
    const [genderForm, setGenderForm] = useState(false);
    const [descriptionForm, setDescriptionForm] = useState(false);
    const [gameForm, setGameForm] = useState(false);
    const [rentMoneyForm, setRentMoneyForm] = useState(false);

    const [avatar, setAvatar] = useState('');
    const [urlCode, setUrlCode] = useState(user?.urlCode || '');
    const [nickname, setNickname] = useState(user?.nickname || '');
    const [dateOfBirth, setDateOfBirth] = useState(user?.dateOfBirth || '');
    const [gender, setGender] = useState(user?.gender || '');
    const [game, setGame] = useState({ games: [], response: [] });
    const [rentMoney, setRentMoney] = useState(user?.player?.fee || '');
    const [description, setDescription] = useState(
        user?.player?.description || ''
    );

    const [previewAvatar, setPreviewAvatar] = useState(user?.avatar);

    // Multiple game
    const handleChangeGames = (e) => {
        const { value, checked } = e.target;
        const { games } = game;

        // Case 1 : The user checks the box
        if (checked) {
            setGame({
                games: [...games, value],
                response: [...games, value],
            });
        }

        // Case 2  : The user unchecks the box
        else {
            setGame({
                games: games.filter((e) => e !== value),
                response: games.filter((e) => e !== value),
            });
        }
    };

    const handleUploadGames = async () => {
        if (game.games.length === 0) {
            toast.error('Please get your game to update!');
            return;
        }

        try {
            setLoadingGame(true);
            const { data } = await userApi.put('v1/user/game', {
                game: game.games,
            });
            dispatch(updateGame(data?.data?.user?.get_game));
            setLoadingGame(false);
            setGameForm(false);
            toast.success('Update list game successfully!');
        } catch (err) {
            toast.error(err?.response?.data?.error || 'Something went wrong!');
            setLoadingGame(false);
        }
    };

    const handleUpdateNickName = async () => {
        if (!nickname) {
            toast.error('Nickname is required');
            return;
        }

        try {
            setLoadingNickName(true);
            const { data } = await userApi.put('v1/user', { nickname });
            dispatch(setUserInformation(data?.data?.user));
            toast.success('Update nickname successfully!');
            setLoadingNickName(false);
            setNicknameForm(false);
        } catch (error) {
            toast.error(
                error?.response?.data?.error || 'Something went wrong!'
            );
            setLoadingNickName(false);
        }
    };

    const handleUpdateDescription = async () => {
        if (!description) {
            toast.error('Description is required');
            return;
        }
        try {
            setLoadingDescription(true);
            const { data } = await userApi.put('v1/user', { description });
            dispatch(setUserInformation(data?.data?.user));
            toast.success('Update description successfully!');
            setLoadingDescription(false);
            setDescriptionForm(false);
        } catch (error) {
            toast.error(
                error?.response?.data?.error || 'Something went wrong!'
            );
            setLoadingDescription(false);
        }
    };

    const handleUploadAvatar = (e) => {
        if (e.target && e.target.files && e.target.files[0]) {
            setPreviewAvatar(URL.createObjectURL(e.target.files[0]));
            setAvatar(e.target.files[0]);
        }
    };

    const handleUpdateAvatar = async () => {
        const formData = new FormData();
        formData.append('image', avatar);

        try {
            setLoadingAvatar(true);
            const res = await imgbbApi.post('upload', formData);

            const { data } = await userApi.put('v1/user', {
                avatar: res?.data?.data?.display_url,
            });

            dispatch(setUserInformation(data?.data?.user));
            setLoadingAvatar(false);
            setAvatar('');
            setPreviewAvatar(data?.data?.user?.avatar);

            toast.success('Update avatar successfully!');
        } catch (error) {
            setLoadingAvatar(false);
            toast.error(error?.response?.data?.error);
        }
    };

    const handleUpdateUrlCode = async () => {
        if (!urlCode) {
            toast.error('Url code is required!');
            return;
        }

        try {
            setLoadingUrlCode(true);
            const { data } = await userApi.put('v1/user', { urlCode });
            dispatch(setUserInformation(data?.data?.user));

            toast.success('Update url code successfully!');
            setLoadingUrlCode(false);
            setUsernameForm(false);
        } catch (error) {
            toast.error(
                error?.response?.data?.error || 'Something went wrong!'
            );
            setLoadingUrlCode(false);
        }
    };

    const handleUpdateGender = async () => {
        try {
            setLoadingGender(true);
            const { data } = await userApi.put('v1/user', { gender });
            dispatch(setUserInformation(data?.data?.user));

            toast.success('Update gender successfully!');
            setLoadingGender(false);
            setGenderForm(false);
        } catch (e) {
            toast.error(e?.response?.data?.error);
            setLoadingGender(false);
        }
    };

    const handleUpdateDateOfBirth = async () => {
        if (!dateOfBirth) {
            toast.error('Date of birth is required!');
            return;
        }

        try {
            setLoadingDateOfBirth(true);
            const { data } = await userApi.put('v1/user', { dateOfBirth });
            dispatch(setUserInformation(data?.data?.user));
            toast.success('Update date of birth successfully!');
            setLoadingDateOfBirth(false);
            setBirthdayForm(false);
        } catch (error) {
            toast.error(error?.response?.data?.error);
            setLoadingDateOfBirth(false);
        }
    };

    const handleUpdateFee = async () => {
        if (!rentMoney) {
            toast.error('Fee is required!');
            return;
        }

        try {
            setRentMoneyLoading(true);
            const { data } = await userApi.put('v1/user', { fee: rentMoney });
            dispatch(setUserInformation(data?.data?.user));
            toast.success('Update fee successfully!');
            setRentMoneyLoading(false);
            setRentMoneyForm(false);
        } catch (error) {
            toast.error(
                error?.response?.data?.error || 'Something went wrong!'
            );
            setRentMoneyLoading(false);
        }
    };

    const handleClickOpenForm = {
        name: () => {
            setNicknameForm((prev) => !prev);
        },

        username: () => {
            setUsernameForm((prev) => !prev);
        },

        birthday: () => {
            setBirthdayForm((prev) => !prev);
        },

        gender: () => {
            setGenderForm((prev) => !prev);
        },

        game: () => {
            setGameForm((prev) => !prev);
        },

        description: () => {
            setDescriptionForm((prev) => !prev);
        },
        fee: () => {
            setRentMoneyForm((prev) => !prev);
        },
    };

    return (
        <Modal
            title={'Edit profile'}
            size={'large'}
            show={modal}
            close={() => {
                setNicknameForm(false);
                setUsernameForm(false);
                setBirthdayForm(false);
                setGenderForm(false);
                setDescriptionForm(false);
                dispatch(handleModalEditProfile(false));
            }}
        >
            <div className={cx('edit-profile_modal__wrapper')}>
                {/* avatar */}
                <div className={cx('form__group')}>
                    <div className={cx('heading')}>
                        <div className={cx('title')}>Profile picture</div>
                        <input
                            type='file'
                            id='upload-avatar'
                            hidden
                            onChange={(e) => handleUploadAvatar(e)}
                        />
                        <label htmlFor='upload-avatar'>Edit</label>
                    </div>

                    <div className={cx('content')}>
                        {previewAvatar ? (
                            <div className={cx('avatar')}>
                                <img src={previewAvatar} alt='' />
                            </div>
                        ) : (
                            <div className={cx('avatar')}>
                                <Image src={''} alt='' />
                            </div>
                        )}
                        {avatar && (
                            <div
                                className={cx(
                                    'content__edit',
                                    'content__edit-avatar'
                                )}
                            >
                                <div className={cx('form__action')}>
                                    <button
                                        onClick={() => {
                                            setPreviewAvatar(user?.avatar);
                                            setAvatar('');
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    {loadingAvatar ? (
                                        <LoadingIcon />
                                    ) : (
                                        <button onClick={handleUpdateAvatar}>
                                            Save
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* nickname */}
                <div className={cx('form__group')}>
                    <div className={cx('heading')}>
                        <div className={cx('title')}>Nick name</div>
                        {!loadingNickName && (
                            <div
                                className={cx('action')}
                                onClick={handleClickOpenForm.name}
                            >
                                {nicknameForm ? (
                                    <span>Cancel</span>
                                ) : (
                                    <span>Edit</span>
                                )}
                            </div>
                        )}
                    </div>

                    <div className={cx('content')}>
                        {nicknameForm ? (
                            <div className={cx('content__edit')}>
                                <div className={cx('form__input')}>
                                    <input
                                        type='text'
                                        value={nickname}
                                        onChange={(e) =>
                                            setNickname(e.target.value)
                                        }
                                    />
                                </div>
                                <div className={cx('form__action')}>
                                    <button
                                        onClick={() => {
                                            setNicknameForm(false);
                                        }}
                                    >
                                        Cancel
                                    </button>

                                    {loadingNickName ? (
                                        <LoadingIcon />
                                    ) : (
                                        <button onClick={handleUpdateNickName}>
                                            Save
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className={cx('display__name')}>
                                <span>{user?.nickname}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* url code */}
                <div className={cx('form__group')}>
                    <div className={cx('heading')}>
                        <div className={cx('title')}>URL code</div>
                        {!loadingUrlCode && (
                            <div
                                className={cx('action')}
                                onClick={handleClickOpenForm.username}
                            >
                                {usernameForm ? (
                                    <span>Cancel</span>
                                ) : (
                                    <span
                                        onClick={() =>
                                            setUrlCode(user?.urlCode)
                                        }
                                    >
                                        Edit
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    <div className={cx('content')}>
                        {usernameForm ? (
                            <div className={cx('content__edit')}>
                                <div className={cx('form__input')}>
                                    <input
                                        type='text'
                                        value={urlCode}
                                        onChange={(e) =>
                                            setUrlCode(e.target.value)
                                        }
                                    />
                                </div>
                                <div className={cx('form__action')}>
                                    <button
                                        onClick={() => {
                                            setUsernameForm(false);
                                            setUrlCode(user?.urlCode);
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    {loadingUrlCode ? (
                                        <LoadingIcon />
                                    ) : (
                                        <button onClick={handleUpdateUrlCode}>
                                            Save
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className={cx('display__name')}>
                                <span>
                                    https://soa-playerdual.herokuapp.com/
                                    {user?.urlCode}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Birthday */}
                <div className={cx('form__group')}>
                    <div className={cx('heading')}>
                        <div className={cx('title')}>Birthday</div>
                        {!loadingDateOfBirth && (
                            <div
                                className={cx('action')}
                                onClick={handleClickOpenForm.birthday}
                            >
                                {birthdayForm ? (
                                    <span>Cancel</span>
                                ) : (
                                    <span
                                        onClick={() =>
                                            setDateOfBirth(user?.dateOfBirth)
                                        }
                                    >
                                        Edit
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    <div className={cx('content')}>
                        <div className={cx('birthday')}>
                            {birthdayForm ? (
                                <div className={cx('content__edit')}>
                                    <div className={cx('form__input')}>
                                        <input
                                            value={dateOfBirth}
                                            type='date'
                                            onChange={(e) =>
                                                setDateOfBirth(e.target.value)
                                            }
                                        />
                                    </div>
                                    <div className={cx('form__action')}>
                                        <button
                                            onClick={() =>
                                                setBirthdayForm(false)
                                            }
                                        >
                                            Cancel
                                        </button>
                                        {loadingDateOfBirth ? (
                                            <LoadingIcon />
                                        ) : (
                                            <button
                                                onClick={
                                                    handleUpdateDateOfBirth
                                                }
                                            >
                                                Save
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <i
                                        className={cx(
                                            'fa-light fa-cake-candles'
                                        )}
                                    ></i>
                                    <span>
                                        {moment(user?.dateOfBirth).format(
                                            'MMMM Do YYYY'
                                        )}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Gender */}
                <div className={cx('form__group')}>
                    <div className={cx('heading')}>
                        <div className={cx('title')}>Gender</div>
                        {!loadingGender && (
                            <div
                                className={cx('action')}
                                onClick={handleClickOpenForm.gender}
                            >
                                {genderForm ? (
                                    <span>Cancel</span>
                                ) : (
                                    <span
                                        onClick={() => {
                                            setGender(user?.gender);
                                        }}
                                    >
                                        Edit
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    <div className={cx('content')}>
                        <div className={cx('birthday')}>
                            {genderForm ? (
                                <div className={cx('content__edit')}>
                                    <div className={cx('form__input')}>
                                        <select
                                            value={gender}
                                            onChange={(e) =>
                                                setGender(e.target.value)
                                            }
                                        >
                                            <option value='Male'>Male</option>
                                            <option value='Female'>
                                                Female
                                            </option>
                                        </select>
                                    </div>
                                    <div className={cx('form__action')}>
                                        <button
                                            onClick={() => setGenderForm(false)}
                                        >
                                            Cancel
                                        </button>
                                        {loadingGender ? (
                                            <LoadingIcon />
                                        ) : (
                                            <button
                                                onClick={handleUpdateGender}
                                            >
                                                Save
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <span>{user?.gender}</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Game */}
                <div className={cx('form__group')}>
                    <div className={cx('heading')}>
                        <div className={cx('title')}>Game</div>
                        {!loadingGame && (
                            <div
                                className={cx('action')}
                                onClick={handleClickOpenForm.game}
                            >
                                {gameForm ? (
                                    <span>Cancel</span>
                                ) : (
                                    <span
                                        onClick={() => {
                                            setGender(
                                                user?.get_game
                                                    ? user?.get_game
                                                    : game
                                            );
                                        }}
                                    >
                                        Edit
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    <div className={cx('content')}>
                        <div className={cx('game__container')}>
                            {gameForm ? (
                                <div className={cx('content__edit')}>
                                    <div className={cx('form__input')}>
                                        {gameList
                                            ? gameList.map((item) => {
                                                  return (
                                                      <div
                                                          className='form-check'
                                                          key={item.id}
                                                      >
                                                          <input
                                                              className='form-check-input'
                                                              type='checkbox'
                                                              value={item.id}
                                                              id={item.id}
                                                              onChange={
                                                                  handleChangeGames
                                                              }
                                                          />

                                                          <label
                                                              className='form-check-label'
                                                              htmlFor={item.id}
                                                          >
                                                              {item.game}
                                                          </label>
                                                      </div>
                                                  );
                                              })
                                            : null}
                                    </div>
                                    <div className={cx('form__action')}>
                                        <button
                                            onClick={() => setGameForm(false)}
                                        >
                                            Cancel
                                        </button>
                                        {loadingGame ? (
                                            <LoadingIcon />
                                        ) : (
                                            <button onClick={handleUploadGames}>
                                                Save
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ) : user?.get_game && user?.get_game.length > 0 ? (
                                user?.get_game.map((item) => {
                                    return (
                                        <div
                                            key={item.id}
                                            className={cx('game__item')}
                                        >
                                            <span>{item.game}</span>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className={cx('game')}>
                                    <div className={cx('no__game')}>
                                        <div className={cx('no__game-img')}>
                                            <img src={no_game} alt='nogame' />
                                        </div>
                                        <span>
                                            Choose your game you can play
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className={cx('form__group')}>
                    <div className={cx('heading')}>
                        <div className={cx('title')}>Bio</div>
                        <div
                            className={cx('action')}
                            onClick={handleClickOpenForm.description}
                        >
                            {descriptionForm ? (
                                <span>Cancel</span>
                            ) : (
                                <span>Edit</span>
                            )}
                        </div>
                    </div>

                    <div className={cx('content')}>
                        <div className={cx('bio')}>
                            {descriptionForm ? (
                                <div className={cx('content__edit')}>
                                    <div className={cx('form__input')}>
                                        <input
                                            type='text'
                                            value={description}
                                            onChange={(e) =>
                                                setDescription(e.target.value)
                                            }
                                        />
                                    </div>
                                    <div className={cx('form__action')}>
                                        <button
                                            onClick={() =>
                                                setDescriptionForm(false)
                                            }
                                        >
                                            Cancel
                                        </button>
                                        {loadingDescription ? (
                                            <LoadingIcon />
                                        ) : (
                                            <button
                                                onClick={
                                                    handleUpdateDescription
                                                }
                                            >
                                                Save
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <span>
                                    {description === 'Blank description'
                                        ? 'Add bio'
                                        : description}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Fee */}
                <div className={cx('form__group')}>
                    <div className={cx('heading')}>
                        <div className={cx('title')}>Rental fee</div>
                        <div
                            className={cx('action')}
                            onClick={handleClickOpenForm.fee}
                        >
                            {rentMoneyForm ? (
                                <span>Cancel</span>
                            ) : (
                                <span>Edit</span>
                            )}
                        </div>
                    </div>

                    <div className={cx('content')}>
                        <div className={cx('bio')}>
                            {rentMoneyForm ? (
                                <div className={cx('content__edit')}>
                                    <div className={cx('form__input')}>
                                        <input
                                            type='number'
                                            value={rentMoney}
                                            onChange={(e) =>
                                                setRentMoney(e.target.value)
                                            }
                                        />
                                    </div>
                                    <div className={cx('form__action')}>
                                        <button
                                            onClick={() =>
                                                setRentMoneyForm(false)
                                            }
                                        >
                                            Cancel
                                        </button>
                                        {rentMoneyLoading ? (
                                            <LoadingIcon />
                                        ) : (
                                            <button onClick={handleUpdateFee}>
                                                Save
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <span>
                                    {user?.player?.fee?.toLocaleString()} VND
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default ModalEditProfile;
