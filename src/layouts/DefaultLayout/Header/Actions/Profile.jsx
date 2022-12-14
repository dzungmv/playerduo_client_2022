import { useSelector } from 'react-redux';
import classNames from 'classnames/bind';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';
import 'tippy.js/themes/light.css';

import Image from '@/components/Image';
import styles from './Actions.module.scss';
import Tooltipes from './Tooltipes';
import { useRef } from 'react';

const cx = classNames.bind(styles);

function Profile() {
    const profileHref = useRef();
    const user = useSelector((state) => state?.user?.user?.information);

    return (
        <div className={cx('profile__wrapper')}>
            <Tippy
                ref={profileHref}
                content={<Tooltipes profileHref={profileHref} />}
                trigger='click'
                placement='bottom-start'
                interactive
                arrow={false}
                animation='scale'
                theme='light'
            >
                {user?.avatar ? (
                    <img
                        className={cx('avatar')}
                        src={user?.avatar}
                        alt='avatar'
                    />
                ) : (
                    <Image className={cx('avatar')} src='' alt='avatar' />
                )}
            </Tippy>
        </div>
    );
}

export default Profile;
