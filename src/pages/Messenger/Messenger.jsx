import classNames from 'classnames/bind';
import { Outlet } from 'react-router-dom';
import Tippy from '@tippyjs/react';
import { roundArrow } from 'tippy.js';
import 'tippy.js/themes/light.css';
import 'tippy.js/dist/svg-arrow.css';

import styles from './Messenger.module.scss';
import Image from '@/components/Image';
import Tooltipes from './ActionTippy';

const cx = classNames.bind(styles);

const fake_data_messenger = [
    {
        id: 1,
        name: 'Ton Duc Thang',
        avatar: '',
        message: 'You are friend on facebook',
    },
    {
        id: 2,
        name: 'Nguyen Anh Tuan',
        avatar: '',
        message: 'You are friend on facebook',
    },
    {
        id: 3,
        name: 'Nguyen Anh Binh',
        avatar: '',
        message: 'You are friend on facebook',
    },
    {
        id: 4,
        name: 'Hoang Bao',
        avatar: '',
        message: 'You are friend on facebook',
    },
    {
        id: 5,
        name: 'Hoang Bao',
        avatar: '',
        message: 'You are friend on facebook',
    },
    {
        id: 6,
        name: 'Hoang Bao',
        avatar: '',
        message: 'You are friend on facebook',
    },
    {
        id: 7,
        name: 'Hoang Bao',
        avatar: '',
        message: 'You are friend on facebook',
    },
    {
        id: 8,
        name: 'Hoang Bao',
        avatar: '',
        message: 'You are friend on facebook',
    },
    {
        id: 9,
        name: 'Hoang Bao',
        avatar: '',
        message: 'You are friend on facebook',
    },
    {
        id: 10,
        name: 'Hoang Bao',
        avatar: '',
        message: 'You are friend on facebook',
    },
];

function Messenger() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('container__left')}>
                    <div className={cx('container__left--header')}>
                        <span>Chats</span>
                    </div>

                    <div className={cx('messenger')}>
                        {fake_data_messenger.map((data, index) => {
                            return (
                                <div
                                    key={index}
                                    className={cx('messenger__item')}
                                >
                                    <div
                                        className={cx(
                                            'messenger__item--avatar'
                                        )}
                                    >
                                        <Image src={data.avatar} />
                                    </div>
                                    <div
                                        className={cx(
                                            'messenger__item--content'
                                        )}
                                    >
                                        <div className={cx('info')}>
                                            <div className={cx('info__name')}>
                                                {data.name}
                                            </div>
                                            <div className={cx('info__mess')}>
                                                {data.message}
                                            </div>
                                        </div>
                                    </div>
                                    <Tippy
                                        arrow={roundArrow}
                                        content={<Tooltipes />}
                                        placement='bottom'
                                        interactive
                                        theme='light'
                                        trigger='click'
                                    >
                                        <div className={cx('action')}>
                                            <div className={cx('action__btn')}>
                                                <i
                                                    className={cx(
                                                        'fa-regular',
                                                        'fa-ellipsis'
                                                    )}
                                                ></i>
                                            </div>
                                        </div>
                                    </Tippy>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <Outlet />
                {/* <div className={cx('container__right')}>
                    <div className={cx('container__right--header')}>
                        <div className={cx('user')}>
                            <div className={cx('user__avatar')}>
                                <Image src={''} />
                            </div>

                            <div className={cx('user__name')}>
                                Ton Duc Thang
                            </div>
                        </div>

                        <div className={cx('action')}>
                            <div className={cx('action__icon')}>
                                <i className={cx('fa-solid', 'fa-phone')}></i>
                            </div>
                            <div className={cx('action__icon')}>
                                <i className={cx('fa-solid', 'fa-video')}></i>
                            </div>
                            <div className={cx('action__icon')}>
                                <i
                                    className={cx(
                                        'fa-solid',
                                        'fa-circle-exclamation'
                                    )}
                                ></i>
                            </div>
                        </div>
                    </div>

                    <div className={cx('messenger__container')}>
                        <div className={cx('messenger__container--heading')}>
                            <div className={cx('avatar')}>
                                <Image src={''} />
                            </div>
                            <div className={cx('name')}>Ton Duc Thang</div>
                            <div className={cx('des')}>
                                You aren't friends on Ton Duc Thang University
                            </div>
                        </div>
                    </div>

                    <div className={cx('container__right--footer')}>
                        <div className={cx('upload__image')}>
                            <input type='file' id='upload-file' hidden />
                            <label htmlFor='upload-file' className={cx('icon')}>
                                <i
                                    className={cx(
                                        'fa-sharp',
                                        'fa-solid fa-images'
                                    )}
                                ></i>
                            </label>
                        </div>
                        <div className={cx('input__text')}>
                            <input type='text' placeholder='Aa' />
                        </div>
                        <div className={cx('like__section')}>
                            <div className={cx('icon')}>
                                <i className={cx('fa-solid', 'fa-heart')}></i>
                            </div>
                        </div>

                        <button hidden>Send</button>
                    </div>
                </div> */}
            </div>
        </div>
    );
}

export default Messenger;
