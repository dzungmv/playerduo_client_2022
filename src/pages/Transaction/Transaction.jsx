import { NavLink, Outlet } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Transaction.module.scss';

const cx = classNames.bind(styles);

function Transaction() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('title')}>
                    <span>Transaction History</span>
                </div>

                <div className={cx('action')}>
                    {/* use navlink to design active */}

                    <NavLink
                        to='/transaction-history/topup'
                        activeclassname={cx('active')}
                        className={cx('action__btn')}
                        // defaultActiveClassName={cx('active')}
                        // default active in the first time
                    >
                        Top up
                    </NavLink>

                    <NavLink
                        to='/transaction-history/withdraw'
                        activeclassname={cx('active')}
                        className={cx('action__btn')}
                    >
                        Withdraw
                    </NavLink>

                    {/* <div className={cx('action__btn')}>Top up</div>
                    <div className={cx('action__btn')}>Withdraw</div> */}
                </div>

                <div className={cx('content')}>
                    {/* use outlet react router-dom in here */}
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default Transaction;
