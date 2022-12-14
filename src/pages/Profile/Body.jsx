import React from 'react';

import classNames from 'classnames/bind';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import StarRatings from 'react-star-ratings';

import {
    setClickedImg,
    setCurrentIndex,
} from '@/_redux/features/previewer/previewerSlice';

import Image from '@/components/Image';
import ImagePreviewer from '@/components/ImagePreviewer';

import styles from './Profile.module.scss';

const cx = classNames.bind(styles);

function Body({ ratingRef }) {
    const distpach = useDispatch();

    const store = {
        player: useSelector((state) => state?.player?.profile),
        playerRatings: useSelector((state) => state?.player?.ratings),
        playerDonate: useSelector((state) => state?.player?.donate),
    };

    const imgPreviewer = useSelector((state) => state.previewer.previewer);
    // * Image preview

    const handleClick = (item, index) => {
        distpach(setCurrentIndex(index));
        distpach(setClickedImg(item));
    };

    let albumGallery = [];
    if (store?.player?.player?.album) {
        albumGallery = JSON.parse(`${store?.player?.player?.album}`);
    }

    let albumMedia = [];
    if (store?.player?.post?.type === 'Image' && store?.player?.post?.media) {
        albumMedia = JSON.parse(`${store?.player?.post?.media}`);
    }

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

    const embedYoutobe = (url) => {
        const videoId = getVideoId(url);

        return `https://www.youtube.com/embed/${videoId}`;
    };

    // //* Truncate text
    // const _text = `💬 Hi mn. Tôi tên Chi 🤍`;
    // const [text] = useState(_text);
    // const [expanded, setExpanded] = useState(false);
    // const [ref, { noClamp, clampedText, key }] = useClampText({
    //     text,
    //     lines: 6,
    //     ellipsis: 100,
    //     expanded,
    // });
    // const toggleExpanded = () => setExpanded((state) => !state);

    //* Scroll to Rating

    return (
        <>
            {imgPreviewer?.clickedImg && (
                <ImagePreviewer sourceImage={albumGallery} />
            )}
            <div className={cx('body__wrapper')}>
                <div className={cx('container')}>
                    <div className={cx('intro')}>
                        <div className={cx('container__box')}>
                            <div className={cx('title')}>Intro</div>
                            <div className={cx('intro__bio')}>
                                <span>
                                    {store?.player?.player?.description}
                                </span>
                            </div>
                            <hr />
                            <div className={cx('intro__birtday')}>
                                <i
                                    className={cx('fa-thin', 'fa-cake-candles')}
                                ></i>
                                <div className={cx('info')}>
                                    <p>
                                        {moment(
                                            store?.player?.dateOfBirth
                                        ).format('MMMM Do YYYY')}
                                    </p>
                                    <span>Birthday</span>
                                </div>
                            </div>
                        </div>

                        {store?.playerDonate &&
                        store?.playerDonate?.length > 0 ? (
                            <div
                                className={cx('container__box', 'top__donate')}
                            >
                                <div className={cx('title')}>Top Donate</div>
                                {store?.playerDonate?.map((item, index) => (
                                    <div
                                        key={index}
                                        className={cx('top__donate__list')}
                                    >
                                        <div className={cx('rank__donate')}>
                                            {index + 1}
                                        </div>

                                        <div className={cx('donater__avatar')}>
                                            <img
                                                src={item.user.avatar}
                                                alt=''
                                            />
                                        </div>

                                        <div className={cx('donater__info')}>
                                            <span> {item?.user?.nickname}</span>
                                            <span>
                                                Total donated:{' '}
                                                <i>
                                                    {parseInt(
                                                        item?.donateTotal
                                                    ).toLocaleString()}{' '}
                                                    VND
                                                </i>
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : null}
                    </div>

                    <div className={cx('content')}>
                        {(store?.player?.post ||
                            (store?.player?.player?.album &&
                                albumGallery.length > 0)) && (
                            <div className={cx('container__box', 'info')}>
                                <div className={cx('info__title')}>
                                    <span className={cx('title')}>
                                        Infomation
                                    </span>
                                    <div className={cx('info__action')}>
                                        <i
                                            className={cx(
                                                'fa-regular',
                                                'fa-ellipsis'
                                            )}
                                        ></i>
                                    </div>
                                </div>
                                {store?.player?.post?.content && (
                                    <div className={cx('info__caption')}>
                                        <span>
                                            {store?.player?.post?.content}
                                        </span>
                                    </div>
                                )}

                                <div className={cx('content__container')}>
                                    {store?.player?.post ? (
                                        store?.player?.post?.type ===
                                        'Video' ? (
                                            <div
                                                className={cx('video__content')}
                                            >
                                                <iframe
                                                    src={
                                                        store?.player?.post
                                                            ?.media &&
                                                        store?.player?.post
                                                            ?.media.length > 0
                                                            ? embedYoutobe(
                                                                  store?.player
                                                                      ?.post
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
                                            store?.player?.post?.media &&
                                            store?.player?.post?.media.length >
                                                0 && (
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
                                        )
                                    ) : (
                                        albumGallery !== null && (
                                            <div
                                                className={cx('info__gallery')}
                                            >
                                                {albumGallery.map(
                                                    (data, index) => {
                                                        const count =
                                                            albumGallery.length -
                                                            4;
                                                        if (
                                                            albumGallery.length ===
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
                                                                    key={index}
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
                                                            albumGallery.length ===
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
                                                                    key={index}
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
                                                            albumGallery.length ===
                                                            3
                                                        ) {
                                                            return (
                                                                <div
                                                                    key={index}
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
                                                        } else if (index < 3) {
                                                            return (
                                                                <img
                                                                    onClick={() =>
                                                                        handleClick(
                                                                            data,
                                                                            index
                                                                        )
                                                                    }
                                                                    key={index}
                                                                    src={data}
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
                                                                    key={index}
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

                                {/* {albumGallery !== null && (
                                <div className={cx('info__gallery')}>
                                    {albumGallery.map((data, index) => {
                                        const count = albumGallery.length - 4;
                                        if (albumGallery.length === 1) {
                                            return (
                                                <div
                                                    onClick={() =>
                                                        handleClick(data, index)
                                                    }
                                                    key={index}
                                                    className={cx('image__1')}
                                                >
                                                    <img src={data} alt='' />
                                                </div>
                                            );
                                        } else if (albumGallery.length === 2) {
                                            return (
                                                <div
                                                    onClick={() =>
                                                        handleClick(data, index)
                                                    }
                                                    key={index}
                                                    className={cx('image__2')}
                                                >
                                                    <img src={data} alt='' />
                                                </div>
                                            );
                                        } else if (albumGallery.length === 3) {
                                            return (
                                                <div
                                                    key={index}
                                                    className={cx('image__3')}
                                                >
                                                    <img
                                                        onClick={() =>
                                                            handleClick(
                                                                data,
                                                                index
                                                            )
                                                        }
                                                        src={data}
                                                        alt=''
                                                    />
                                                </div>
                                            );
                                        } else if (index < 3) {
                                            return (
                                                <img
                                                    onClick={() =>
                                                        handleClick(data, index)
                                                    }
                                                    key={index}
                                                    src={data}
                                                    alt=''
                                                />
                                            );
                                        } else if (index === 3) {
                                            return (
                                                <div
                                                    onClick={() =>
                                                        handleClick(data, index)
                                                    }
                                                    key={index}
                                                    className={cx(
                                                        'image__more'
                                                    )}
                                                    style={{
                                                        backgroundImage: `${
                                                            count > 0
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
                                                        {count > 0
                                                            ? `+${count}`
                                                            : ''}
                                                    </span>
                                                </div>
                                            );
                                        } else {
                                            return null;
                                        }
                                    })}
                                </div>
                            )} */}
                            </div>
                        )}
                        {/* )} */}

                        {store.playerRatings &&
                        store.playerRatings.length > 0 ? (
                            <div
                                id={'rating__container'}
                                ref={ratingRef}
                                className={cx('container__box', 'info__rating')}
                            >
                                <div className={cx('title')}>Rating</div>
                                <div className={cx('rating')}>
                                    {store.playerRatings.map((data, index) => {
                                        return (
                                            <div
                                                key={index}
                                                className={cx('rating__item')}
                                            >
                                                <div
                                                    className={cx(
                                                        'rating__item--avatar'
                                                    )}
                                                >
                                                    <Image
                                                        src={data.avatar || ''}
                                                        alt='avatar'
                                                    />
                                                </div>

                                                <div
                                                    className={cx(
                                                        'rating__content'
                                                    )}
                                                >
                                                    <div className={cx('user')}>
                                                        <div
                                                            className={cx(
                                                                'user__name'
                                                            )}
                                                        >
                                                            <span>
                                                                {data?.nickname}
                                                            </span>
                                                            <div
                                                                className={cx(
                                                                    'rating__time'
                                                                )}
                                                            >
                                                                {moment(
                                                                    data?.created_at
                                                                ).calendar()}
                                                            </div>
                                                        </div>
                                                        <div
                                                            className={cx(
                                                                'ratings'
                                                            )}
                                                        >
                                                            <StarRatings
                                                                rating={
                                                                    data?.rate
                                                                }
                                                                starRatedColor='#ffcd3c'
                                                                // changeRating={this.changeRating}
                                                                numberOfStars={
                                                                    5
                                                                }
                                                                name='rating'
                                                            />
                                                        </div>
                                                    </div>

                                                    <div>
                                                        {data?.comment}
                                                        {/* Lorem Ipsum is simply
                                                        dummy text of the
                                                        printing and typesetting
                                                        industry. Lorem Ipsum
                                                        has been the industry's
                                                        standard dummy text ever
                                                        since the 1500s, when an
                                                        unknown printer took a
                                                        galley of type and
                                                        scrambled it to make a
                                                        type specimen book. It
                                                        has survived not only
                                                        five centuries, but also
                                                        the leap into electronic
                                                        typesetting, remaining
                                                        essentially unchanged.
                                                        It was popularised in
                                                        the 1960s with the
                                                        release of Letraset
                                                        sheets containing Lorem
                                                        Ipsum passages, and more
                                                        recently with desktop
                                                        publishing software like
                                                        Aldus PageMaker
                                                        including versions of
                                                        Lorem Ipsum */}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Body;
