import { Link } from 'react-router-dom';

import classNames from 'classnames/bind';

import styles from './Header.module.scss';
import Logo from '@/assets/icons/logo.png';
import Search from './Search';
import Actions from './Actions';

const cx = classNames.bind(styles);

function Header() {
    return (
        <div className={cx('wrapper')}>
            <Link to='/'>
                <div className={cx('logo')}>
                    <img className={cx('logo__image')} src={Logo} alt='logo' />
                    <span className={cx('logo__name')}>PLAYERDUAL</span>
                </div>
            </Link>
            <Search />
            <Actions />
        </div>
    );
}

export default Header;
