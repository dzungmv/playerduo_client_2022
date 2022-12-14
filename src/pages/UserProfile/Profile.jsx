import classNames from 'classnames/bind';
import { Outlet } from 'react-router-dom';

import styles from './Profile.module.scss';
import { useSelector } from 'react-redux';
import Header from './Header';
import { DynamicTitle } from '@/layouts/DefaultLayout/DynamicTitle/DynamicTitle';

const cx = classNames.bind(styles);

function Profile() {
    const username = useSelector(
        (state) => state?.user?.user?.information?.urlCode
    );

    DynamicTitle(username ? username : 'Profile');
    return (
        <div className={cx('wrapper')}>
            <Header />
            <Outlet />
        </div>
    );
}

export default Profile;
