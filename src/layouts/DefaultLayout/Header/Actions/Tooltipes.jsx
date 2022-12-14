import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';

import {
    handleModalWithdraw,
    handleChangePassModal,
    handleTopupModal,
    handleDonateHistoryModal,
    handleContractManagementModal,
    handleUsersDonationModal,
} from '@/_redux/features/modal/modalSlice';
import { logout } from '@/_redux/features/user/userSlice';

import styles from './Actions.module.scss';
import Image from '@/components/Image';

const cx = classNames.bind(styles);

function Tooltipes({ profileHref }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector((state) => state?.user?.user?.information);

    const handleClick = {
        withDrawModal: () => {
            dispatch(handleModalWithdraw(true));
        },
        topupModal: () => {
            dispatch(handleTopupModal(true));
        },
        changePassModal: () => {
            dispatch(handleChangePassModal(true));
        },
        donateHistoryModal: () => {
            dispatch(handleDonateHistoryModal(true));
        },
        transactionHistory: () => {
            navigate('/transaction-history');
        },
        contractManagement: () => {
            // navigate('/contract-management');
            dispatch(handleContractManagementModal(true));
        },
        usersDonation: () => {
            dispatch(handleUsersDonationModal(true));
        },
        logout: () => {
            localStorage.removeItem('accessToken');
            dispatch(logout());
            navigate('/');
            setTimeout(() => {
                window.location.reload();
            }, 1000);
            toast.success('Logout successfully!');
        },
    };

    return (
        <div className={cx('tooltip')}>
            <div className={cx('tooltip-container')}>
                <Link
                    to={`/user/profile/${user?.urlCode}`}
                    onClick={profileHref.current._tippy.hide()}
                >
                    <div className={cx('tooltip-item', 'profile')}>
                        {user?.avatar ? (
                            <img
                                className={cx('avatar')}
                                src={user?.avatar}
                                alt='avatar'
                            />
                        ) : (
                            <Image
                                className={cx('avatar')}
                                src=''
                                alt='avatar'
                            />
                        )}

                        <div className={cx('info')}>
                            <span className={cx('name')}>{user?.nickname}</span>
                            <span className={cx('id')}>
                                Balance:&nbsp;
                                <span className={cx('id__name')}>
                                    {user?.balance
                                        ? user?.balance.toLocaleString()
                                        : 0}
                                    &nbsp;VND
                                </span>
                            </span>
                        </div>
                    </div>
                </Link>

                <div
                    className={cx('tooltip-item')}
                    onClick={handleClick.topupModal}
                >
                    <div className={cx('label__icon')}>
                        <i className={cx('fa-regular', 'fa-credit-card')}></i>
                    </div>
                    <span className={cx('tooltip-item__label')}>Top up</span>
                </div>

                <div
                    className={cx('tooltip-item')}
                    onClick={handleClick.withDrawModal}
                >
                    <div className={cx('label__icon')}>
                        <i className={cx('fa-regular', 'fa-sack-dollar')}></i>
                    </div>
                    <span className={cx('tooltip-item__label')}>Withdraw</span>
                </div>

                <div
                    className={cx('tooltip-item')}
                    onClick={handleClick.transactionHistory}
                >
                    <div className={cx('label__icon')}>
                        <i className={cx('fa-regular fa-cloud')}></i>
                    </div>
                    <span className={cx('tooltip-item__label')}>
                        Transaction history
                    </span>
                </div>

                <div
                    className={cx('tooltip-item')}
                    onClick={handleClick.usersDonation}
                >
                    <div className={cx('label__icon')}>
                        <i
                            className={cx(
                                'fa-regular fa-rectangle-history-circle-user'
                            )}
                        ></i>
                    </div>
                    <span className={cx('tooltip-item__label')}>
                        List of user donation
                    </span>
                </div>

                <div
                    className={cx('tooltip-item')}
                    onClick={handleClick.donateHistoryModal}
                >
                    <div className={cx('label__icon')}>
                        <i
                            className={cx(
                                'fa-regular fa-rectangle-history-circle-user'
                            )}
                        ></i>
                    </div>
                    <span className={cx('tooltip-item__label')}>
                        Donate history
                    </span>
                </div>

                {/* <div
                    className={cx('tooltip-item')}
                    onClick={handleClick.followListModal}
                >
                    <div className={cx('label__icon')}>
                        <i className={cx('fa-regular', 'fa-user-group')}></i>
                    </div>
                    <span className={cx('tooltip-item__label')}>
                        Follower list
                    </span>
                </div> */}

                <div
                    className={cx('tooltip-item')}
                    onClick={handleClick.contractManagement}
                >
                    <div className={cx('label__icon')}>
                        <i className={cx('fa-regular fa-folder-user')}></i>
                    </div>
                    <span className={cx('tooltip-item__label')}>
                        Contract management
                    </span>
                </div>

                <div
                    className={cx('tooltip-item')}
                    onClick={handleClick.changePassModal}
                >
                    <div className={cx('label__icon')}>
                        <i className={cx('fa-regular', 'fa-gear')}></i>
                    </div>
                    <span className={cx('tooltip-item__label')}>
                        Change password
                    </span>
                </div>

                <hr />

                <div
                    className={cx('tooltip-item', 'tooltip-item__logout')}
                    onClick={handleClick.logout}
                >
                    <div className={cx('label__icon')}>
                        <i
                            className={cx(
                                'fa-regular',
                                'fa-right-from-bracket'
                            )}
                        ></i>
                    </div>

                    <span className={cx('tooltip-item__label')}>Log out</span>
                </div>
            </div>
        </div>
    );
}

export default Tooltipes;
