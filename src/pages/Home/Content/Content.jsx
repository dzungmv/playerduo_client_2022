import classNames from 'classnames/bind';
import { Outlet } from 'react-router-dom';

import styles from './Content.module.scss';
import Swipers from './Swipers';

import Sidebar from '../Sidebar';

const cx = classNames.bind(styles);

function Content() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('slider')}>
                <Swipers />
            </div>

            <div className={cx('sidebar__response')}>
                <Sidebar />
            </div>

            <div className={cx('player')}>
                <Outlet />
            </div>
        </div>
    );
}

export default Content;
