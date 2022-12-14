import classNames from 'classnames/bind';

import styles from './Messenger.module.scss';

import Image from '@/components/Image';

const cx = classNames.bind(styles);

function Container() {
    return (
        <div className={cx('container__right')}>
            <div className={cx('container__right--header')}>
                <div className={cx('user')}>
                    <div className={cx('user__avatar')}>
                        <Image src={''} />
                    </div>

                    <div className={cx('user__name')}>Ton Duc Thang</div>
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
                            className={cx('fa-solid', 'fa-circle-exclamation')}
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
                        <i className={cx('fa-sharp', 'fa-solid fa-images')}></i>
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
        </div>
    );
}

export default Container;
