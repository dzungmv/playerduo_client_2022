import React, { useRef } from 'react';

import classNames from 'classnames/bind';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import moment from 'moment';

import Tippy from '@tippyjs/react';

import { updatePost } from '@/_redux/features/user/userSlice';
import userApi from '@/api/userApi';

import {
    setClickedImg,
    setCurrentIndex,
} from '@/_redux/features/previewer/previewerSlice';

import { handlePostModal } from '@/_redux/features/modal/modalSlice';

import ImagePreviewer from '@/components/ImagePreviewer';

import styles from './Profile.module.scss';

const cx = classNames.bind(styles);

function Body({ ratingRef }) {
    const dispatch = useDispatch();

    const tippyRef = useRef(null);

    const user = useSelector((state) => state?.user?.user?.information);

    const getVideoId = (url) => {
        let videoId;
        if (url.includes('youtu.be')) {
            videoId = url.split('be/')[1];
        }
        if (url.includes('watch?v=')) {
            videoId = url.split('v=')[1];
        }
        return videoId;
    };

    let albumMedia = [];
    if (user?.post?.type === 'Image' && user?.post?.media) {
        albumMedia = JSON.parse(`${user?.post?.media}`);
    }

    const embedYoutobe = (url) => {
        const videoId = getVideoId(url);

        return `https://www.youtube.com/embed/${videoId}`;
    };

    const imgPreviewer = useSelector((state) => state.previewer.previewer);
    // * Image preview

    const handleClick = (item, index) => {
        dispatch(setCurrentIndex(index));
        dispatch(setClickedImg(item));
    };

    const handleClickOpenModalEdit = () => {
        tippyRef.current._tippy.hide();
        dispatch(handlePostModal(true));
    };

    const deletePost = async () => {
        tippyRef.current._tippy.hide();
        if (user?.post?.type === 'photo') {
            try {
                const { data } = await userApi.put('v1/user/bio', {
                    content: '',
                    media: '',
                    type: '',
                });

                dispatch(updatePost(data?.data?.post));
                toast.success('Delete post successfully');
            } catch (error) {
                toast.error(
                    error?.response?.data?.error || 'Something went wrong'
                );
            }
            return;
        }

        try {
            const { data } = await userApi.put('v1/user/bio', {
                content: '',
                media: '',
                type: '',
            });
            dispatch(updatePost(data?.data?.post));
            toast.success('Delete post successfully');
        } catch (error) {
            toast.error(error?.response?.data?.error);
        }
    };

    return (
        <>
            {imgPreviewer?.clickedImg && (
                <ImagePreviewer sourceImage={user?.post?.media} />
            )}
            <div className={cx('body__wrapper')}>
                <div className={cx('container')}>
                    <div className={cx('container__box', 'intro')}>
                        <div className={cx('title')}>Intro</div>
                        <div className={cx('intro__bio')}>
                            <span>{user?.player?.description}</span>
                        </div>
                        <hr />
                        <div className={cx('intro__birtday')}>
                            <i className={cx('fa-thin', 'fa-cake-candles')}></i>
                            <div className={cx('info')}>
                                <p>
                                    {user?.dateOfBirth
                                        ? moment(user?.dateOfBirth).format(
                                              'MMMM Do YYYY'
                                          )
                                        : 'Not set'}
                                </p>
                                <span>Birthday</span>
                            </div>
                        </div>
                    </div>

                    <div className={cx('content')}>
                        {user?.post &&
                            Object.keys(user?.post).length > 0 &&
                            (user?.post?.content !== null ||
                                user?.post?.media !== null) && (
                                <div className={cx('container__box', 'info')}>
                                    <div className={cx('info__title')}>
                                        <span className={cx('title')}>
                                            Infomation
                                        </span>
                                        <Tippy
                                            ref={tippyRef}
                                            content={
                                                <div
                                                    className={cx(
                                                        'tooltip__wrapper'
                                                    )}
                                                >
                                                    <div
                                                        className={cx(
                                                            'tooltip__item'
                                                        )}
                                                        onClick={
                                                            handleClickOpenModalEdit
                                                        }
                                                    >
                                                        <i
                                                            className={cx(
                                                                'fa-regular fa-pen'
                                                            )}
                                                        ></i>
                                                        <span>Edit</span>
                                                    </div>

                                                    <div
                                                        className={cx(
                                                            'tooltip__item'
                                                        )}
                                                        onClick={deletePost}
                                                    >
                                                        <i
                                                            className={cx(
                                                                'fa-regular fa-trash'
                                                            )}
                                                        ></i>
                                                        <span>Delete</span>
                                                    </div>
                                                </div>
                                            }
                                            placement='bottom'
                                            theme='light'
                                            arrow={false}
                                            click={true}
                                            interactive
                                            trigger='click'
                                            animation='scale'
                                            delay={100}
                                            duration={200}
                                        >
                                            <div className={cx('info__action')}>
                                                <i
                                                    className={cx(
                                                        'fa-regular',
                                                        'fa-ellipsis'
                                                    )}
                                                ></i>
                                            </div>
                                        </Tippy>
                                    </div>
                                    {user?.post?.content && (
                                        <div className={cx('info__caption')}>
                                            {user?.post?.content}
                                        </div>
                                    )}

                                    <div className={cx('content__container')}>
                                        {user?.post &&
                                        user?.post?.type === 'Video' ? (
                                            <div
                                                className={cx('video__content')}
                                            >
                                                <iframe
                                                    src={
                                                        user?.post?.media &&
                                                        user?.post?.media
                                                            .length > 0
                                                            ? embedYoutobe(
                                                                  user?.post
                                                                      ?.media
                                                              )
                                                            : ''
                                                    }
                                                    title='Video'
                                                    allowFullScreen
                                                    loading='lazy'
                                                ></iframe>
                                            </div>
                                        ) : (
                                            albumMedia &&
                                            albumMedia.length > 0 && (
                                                <div
                                                    className={cx(
                                                        'info__gallery'
                                                    )}
                                                >
                                                    {albumMedia.map(
                                                        (data, index) => {
                                                            const count =
                                                                albumMedia.length -
                                                                4;
                                                            if (
                                                                albumMedia.length ===
                                                                1
                                                            ) {
                                                                return (
                                                                    <div
                                                                        onClick={() =>
                                                                            handleClick(
                                                                                data,
                                                                                index
                                                                            )
                                                                        }
                                                                        key={
                                                                            index
                                                                        }
                                                                        className={cx(
                                                                            'image__1'
                                                                        )}
                                                                    >
                                                                        <img
                                                                            src={
                                                                                data
                                                                            }
                                                                            alt=''
                                                                        />
                                                                    </div>
                                                                );
                                                            } else if (
                                                                albumMedia.length ===
                                                                2
                                                            ) {
                                                                return (
                                                                    <div
                                                                        onClick={() =>
                                                                            handleClick(
                                                                                data,
                                                                                index
                                                                            )
                                                                        }
                                                                        key={
                                                                            index
                                                                        }
                                                                        className={cx(
                                                                            'image__2'
                                                                        )}
                                                                    >
                                                                        <img
                                                                            src={
                                                                                data
                                                                            }
                                                                            alt=''
                                                                        />
                                                                    </div>
                                                                );
                                                            } else if (
                                                                albumMedia.length ===
                                                                3
                                                            ) {
                                                                return (
                                                                    <div
                                                                        key={
                                                                            index
                                                                        }
                                                                        className={cx(
                                                                            'image__3'
                                                                        )}
                                                                    >
                                                                        <img
                                                                            onClick={() =>
                                                                                handleClick(
                                                                                    data,
                                                                                    index
                                                                                )
                                                                            }
                                                                            src={
                                                                                data
                                                                            }
                                                                            alt=''
                                                                        />
                                                                    </div>
                                                                );
                                                            } else if (
                                                                index < 3
                                                            ) {
                                                                return (
                                                                    <img
                                                                        onClick={() =>
                                                                            handleClick(
                                                                                data,
                                                                                index
                                                                            )
                                                                        }
                                                                        key={
                                                                            index
                                                                        }
                                                                        src={
                                                                            data
                                                                        }
                                                                        alt=''
                                                                    />
                                                                );
                                                            } else if (
                                                                index === 3
                                                            ) {
                                                                return (
                                                                    <div
                                                                        onClick={() =>
                                                                            handleClick(
                                                                                data,
                                                                                index
                                                                            )
                                                                        }
                                                                        key={
                                                                            index
                                                                        }
                                                                        className={cx(
                                                                            'image__more'
                                                                        )}
                                                                        style={{
                                                                            backgroundImage: `${
                                                                                count >
                                                                                0
                                                                                    ? 'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3))'
                                                                                    : 'linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0))'
                                                                            } , url(${data})`,
                                                                        }}
                                                                    >
                                                                        <span
                                                                            className={cx(
                                                                                'image__count'
                                                                            )}
                                                                        >
                                                                            {count >
                                                                            0
                                                                                ? `+${count}`
                                                                                : ''}
                                                                        </span>
                                                                    </div>
                                                                );
                                                            } else {
                                                                return null;
                                                            }
                                                        }
                                                    )}
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}

                        {/* <div
                            ref={ratingRef}
                            className={cx('container__box', 'info__rating')}
                        >
                            <div className={cx('title')}>Rating</div>
                            <div className={cx('rating')}>
                                <div className={cx('rating__item')}>
                                    <div className={cx('rating__item--avatar')}>
                                        {user?.avatar &&
                                        user?.avatar?.length > 0 ? (
                                            <img
                                                src={user.avatar}
                                                alt='avatar'
                                            />
                                        ) : (
                                            <Image src='' alt='avatar' />
                                        )}
                                    </div>
                                    <div
                                        className={cx('rating__item--content')}
                                    >
                                        <div className={cx('user')}>
                                            <div className={cx('header__user')}>
                                                <div
                                                    className={cx('user__name')}
                                                >
                                                    <span>
                                                        {user?.name
                                                            ? user?.name
                                                            : 'Anonymous'}
                                                    </span>
                                                    <div
                                                        className={cx(
                                                            'rating__time'
                                                        )}
                                                    >
                                                        8/3/2022, 6:14:45 PM
                                                    </div>
                                                </div>

                                                <div className={cx('ratings')}>
                                                    <div
                                                        className={cx(
                                                            'ratings__star'
                                                        )}
                                                    >
                                                        <i
                                                            className={cx(
                                                                'fa-solid',
                                                                'fa-star'
                                                            )}
                                                        ></i>
                                                        <i
                                                            className={cx(
                                                                'fa-solid',
                                                                'fa-star'
                                                            )}
                                                        ></i>
                                                        <i
                                                            className={cx(
                                                                'fa-solid',
                                                                'fa-star'
                                                            )}
                                                        ></i>
                                                        <i
                                                            className={cx(
                                                                'fa-solid',
                                                                'fa-star'
                                                            )}
                                                        ></i>
                                                        <i
                                                            className={cx(
                                                                'fa-solid',
                                                                'fa-star'
                                                            )}
                                                        ></i>
                                                    </div>
                                                </div>
                                            </div>

                                            <div
                                                className={cx('user__comment')}
                                            >
                                                In publishing and graphic
                                                design, Lorem ipsum is a
                                                placeholder text commonly used
                                                to demonstrate the visual form
                                                of a document or a typeface
                                                without relying on meaningful
                                                content. Lorem ipsum may be used
                                                as a placeholder before final
                                                copy is available.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Body;
