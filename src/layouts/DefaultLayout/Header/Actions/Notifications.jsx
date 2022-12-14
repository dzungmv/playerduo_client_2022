import classNames from 'classnames/bind';
import { useSelector, useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';

import {
    handleAcceptRentModal,
    handleAcceptRentModalData,
} from '@/_redux/features/modal/modalSlice';

import Image from '@/components/Image';
import styles from './Actions.module.scss';

const cx = classNames.bind(styles);

function NoticationTT({ notiRef }) {
    // const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state?.user?.user);

    // const playerContract = useSelector(
    //     (state) => state?.user?.user?.playerContract
    // );

    // concat 2 array
    // const newContract = user?.playerContract?.concat(
    //     user?.information?.contract
    // );

    const handleClickNotiItem = (id) => {
        notiRef.current._tippy.hide();

        dispatch(handleAcceptRentModal(true));
        dispatch(handleAcceptRentModalData(id));

        // navigate(`/rent-manage/${id}`);
    };

    return (
        <div className={cx('tooltip-container-notification')}>
            <span className={cx('title')}>Notifications</span>

            {user?.playerContract && user?.playerContract?.length > 0 ? (
                user?.playerContract.map((noti) => {
                    return (
                        <div
                            key={noti.id}
                            className={cx('tooltip-item')}
                            onClick={() => handleClickNotiItem(noti?.id)}
                        >
                            <div>
                                <Image
                                    className={cx('tooltip-item__avatar')}
                                    src={noti?.avatar}
                                />
                            </div>
                            <div className={cx('container')}>
                                <div className={cx('content')}>
                                    <div>
                                        <span className={cx('info-content')}>
                                            {noti.user_name}
                                        </span>
                                        {noti.title}
                                    </div>
                                    {noti.status === 'Pending' ? (
                                        <span
                                            className={cx('tooltip-item__time')}
                                        >
                                            This user has sent you a contract
                                        </span>
                                    ) : (
                                        <span
                                            className={cx('tooltip-item__time')}
                                        >
                                            This user has accepted your contract
                                        </span>
                                    )}
                                </div>

                                <div className={cx('tooltip-item__check')}>
                                    <i
                                        className={cx('fa-solid', 'fa-circle')}
                                    ></i>
                                </div>
                            </div>
                        </div>
                    );
                })
            ) : (
                <div className={cx('no-notification')}>
                    <span>No notification</span>
                </div>
            )}
        </div>
    );
}

export default NoticationTT;
