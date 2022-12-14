import { useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import classNames from 'classnames/bind';
import { useSelector, useDispatch } from 'react-redux';
import VNnum2words from 'vn-num2words';
import { toast } from 'react-toastify';
import {
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
} from '@coreui/react';
import '@coreui/coreui/dist/css/coreui.min.css';
import moment from 'moment';

import userApi from '@/api/userApi';
import transactionApi from '@/api/transactionApi';
import contractApi from '@/api/contractApi';

import {
    handleModalWithdraw,
    handleModalListFollowing,
    handleDonateHistoryModal,
    handleAcceptRentModal,
    handleAcceptRentModalData,
    handleContractManagementModal,
    handleUsersDonationModal,
} from '@/_redux/features/modal/modalSlice';
import {
    handleModalLogin,
    handleModalRegister,
    handleChangePassModal,
    handleTopupModal,
} from '@/_redux/features/modal/modalSlice';

import { setPlayerContract } from '@/_redux/features/user/userSlice';

import styles from './Actions.module.scss';
import Profile from './Profile';
import Notifications from './Notifications';
import Modal from '@/components/Modal';
import Image from '@/components/Image';
import LoadingIcon from '@/layouts/LoadingIcon';
import no_following from '@/assets/icons/no_following.svg';
import donate_empty from '@/assets/icons/donate_empty.svg';

const cx = classNames.bind(styles);

function Actions() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const confirmPassRef = useRef(null);
    const notiRef = useRef(null);

    const [changePassLoading, setChangePassLoading] = useState(false);
    const [currentPass, setCurrentPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');

    const [amountTopUp, setAmountTopUp] = useState('');
    const [topUpLoading, setTopUpLoading] = useState(false);

    const [withdrawLoading, setWithdrawLoading] = useState(false);
    const [amountWithdraw, setAmountWithdraw] = useState('');

    const [acceptRentLoading, setAcceptRentLoading] = useState(false);
    const [declineRentLoading, setDeclineRentLoading] = useState(false);

    const store = {
        isLogin: useSelector((state) => state?.user?.user?.isLogin),
        listFollowing: useSelector((state) => state?.user?.user?.following),
        user: useSelector((state) => state?.user?.user?.information),
        player: useSelector((state) => state?.player?.playersPro),
        modalLogin: useSelector((state) => state?.modal?.modalType?.modalLogin),
        modalRegister: useSelector(
            (state) => state?.modal?.modalType?.modalRegister
        ),
        modalWithdraw: useSelector(
            (state) => state?.modal?.modalType?.modalWithdraw
        ),
        changePassModal: useSelector(
            (state) => state?.modal?.modalType?.changePassModal
        ),

        topupModal: useSelector((state) => state?.modal?.modalType?.topupModal),
        usersDonation: useSelector((state) => state?.user?.user?.usersDonation),
        donateHitoryModal: useSelector(
            (state) => state?.modal?.modalType?.donateHistoryModal
        ),
        acceptRentModal: useSelector(
            (state) => state?.modal?.modalType?.acceptRentModal
        ),
        acceptRentModalData: useSelector(
            (state) => state?.modal?.modalType?.acceptRentModalData
        ),
        playerContract: useSelector(
            (state) => state?.user?.user?.playerContract
        ),
        contractManagementModal: useSelector(
            (state) => state?.modal?.modalType?.contractManagementModal
        ),
        usersDonationModal: useSelector(
            (state) => state?.modal?.modalType?.usersDonationModal
        ),
    };

    const contract = store?.playerContract?.find(
        (item) => item.id === store?.acceptRentModalData
    );

    const findPlayerById = (id) => {
        // find and return nickname of player
        const player = store.player.find((player) => player.id === id);
        return player?.name;
    };

    const handleClick = {
        redirectMessenger: () => {
            navigate('/messengers');
        },
        modalLogin: () => {
            navigate('/');
            dispatch(handleModalLogin(true));
        },
        modalRegister: () => {
            navigate('/');
            dispatch(handleModalRegister(true));
        },
        redirectUserProfile: (id) => {
            navigate(`/player/profile/${id}`);
            dispatch(handleModalListFollowing(false));
        },
        changePassword: async () => {
            if (!currentPass || !newPass || !confirmPass) {
                toast.error('Please fill all fields');
                setChangePassLoading(false);
                return;
            }

            if (newPass !== confirmPass) {
                setChangePassLoading(false);
                toast.error('Confirm password is not match, please try again!');
                confirmPassRef.current.focus();
                return;
            }

            try {
                setChangePassLoading(true);
                await userApi.post('v1/auth/password', {
                    password: currentPass,
                    newPassword: confirmPass,
                });

                toast.success('Change password successfully!');
                setChangePassLoading(false);
                dispatch(handleChangePassModal(false));
            } catch (e) {
                toast.error(
                    e?.response?.data?.error ||
                        "Something's wrong, please try later!"
                );
                setChangePassLoading(false);
            }
        },
        topup: async () => {
            if (!amountTopUp) {
                toast.error('Please fill all fields');

                return;
            }

            if (amountTopUp < 100000) {
                toast.error('Minimum top up is 100,000 VND');
                return;
            }

            try {
                setTopUpLoading(true);
                await transactionApi.post('v1/transaction', {
                    amount: amountTopUp,
                });

                setTopUpLoading(false);
                dispatch(handleTopupModal(false));
                navigate(`/top-up-otp/${amountTopUp}`);
                toast.success('Please check your email for OTP!');
            } catch (err) {
                toast.error(
                    err?.response?.data?.error ||
                        "Something's wrong, please try later!"
                );
                setTopUpLoading(false);
            }
        },
        withdraw: async () => {
            if (!amountWithdraw) {
                toast.error('Please fill all fields');
                return;
            }

            if (amountWithdraw < 100000) {
                toast.error('Minimum withdraw is 100,000 VND');
                return;
            }

            if (amountWithdraw > store.user.balance) {
                toast.error('Your balance is not enough');
                return;
            }

            try {
                setWithdrawLoading(true);
                // add minus sign to amount

                await transactionApi.post('v1/transaction', {
                    amount: -amountWithdraw,
                });

                dispatch(handleModalWithdraw(false));
                setWithdrawLoading(false);
                navigate(`/with-draw-otp/${amountWithdraw}`);
                toast.success('OTP has been sent to your email!');
            } catch (err) {
                toast.error(
                    err?.response?.data?.error ||
                        "Something's wrong, please try later!"
                );
                setWithdrawLoading(false);
            }
        },
        acceptRent: async () => {
            try {
                setAcceptRentLoading(true);
                const { data } = await contractApi.put(
                    `v1/contract/${store.acceptRentModalData}`,
                    {
                        status: 'Processing',
                    }
                );

                dispatch(setPlayerContract(data?.data?.data));
                setAcceptRentLoading(false);
                dispatch(handleAcceptRentModal(false));
                toast.success(
                    `You have accepted ${contract?.user_name}'s rent request!`
                );
            } catch (err) {
                toast.error(
                    err?.response?.data?.error ||
                        "Something's wrong, please try later!"
                );
                setAcceptRentLoading(false);
            }
        },

        declineRent: async () => {
            try {
                setDeclineRentLoading(true);
                const { data } = await contractApi.put(
                    `v1/contract/${store.acceptRentModalData}`,
                    {
                        status: 'Canceled',
                    }
                );
                dispatch(setPlayerContract(data?.data?.data));
                setDeclineRentLoading(false);
                dispatch(handleAcceptRentModal(false));
                toast.success(
                    `You have declined required rent of  ${contract.user_name}`
                );
            } catch (err) {
                toast.error(
                    err?.response?.data?.error ||
                        "Something's wrong, please try later!"
                );

                setDeclineRentLoading(false);
            }
        },
    };

    return (
        <>
            <div className={cx('wrapper')}>
                {store.isLogin ? (
                    <>
                        <Tippy
                            ref={notiRef}
                            content={<Notifications notiRef={notiRef} />}
                            trigger='click'
                            placement='bottom'
                            interactive
                            arrow={false}
                            animation='scale'
                            theme='light'
                        >
                            <div className={cx('action__item')}>
                                <i className={cx('fa-solid', 'fa-bell')}></i>
                                {/* {newContract.length > 0 && (
                                    <div className={cx('noti__count')}>
                                        <span>{newContract.length}</span>
                                    </div>
                                )} */}
                            </div>
                        </Tippy>
                        {/* 
                        <div
                            className={cx('action__item')}
                            onClick={handleClick.redirectMessenger}
                        >
                            <i
                                className={cx('fab', ' fa-facebook-messenger')}
                            ></i>
                        </div> */}

                        <Profile />
                    </>
                ) : (
                    <div className={cx('auth__btn')}>
                        {/* <Link to='/login'> */}
                        <span
                            className={cx('auth__btn-login')}
                            onClick={handleClick.modalLogin}
                        >
                            Sign in
                        </span>
                        {/* </Link> */}

                        {/* <Link to='/register'> */}
                        <button
                            className={cx('auth__btn-register')}
                            onClick={handleClick.modalRegister}
                        >
                            Sign up
                        </button>
                        {/* </Link> */}
                    </div>
                )}
            </div>
            {/* Change password modal */}
            {store.changePassModal && (
                <Modal
                    title={'Change password'}
                    show={store.changePassModal}
                    close={() => dispatch(handleChangePassModal(false))}
                    size={'medium'}
                    notCloseOutside={true}
                >
                    <div className={cx('modal__change-pass')}>
                        <div className={cx('form-control-modal')}>
                            <div className={cx('form__role')}>
                                <div className={cx('form__role__item')}>
                                    <span>
                                        <i
                                            className={cx('fa-regular fa-lock')}
                                        ></i>
                                        Current password
                                    </span>
                                    <input
                                        value={currentPass}
                                        className={cx('form-control')}
                                        type='password'
                                        placeholder='Password'
                                        onChange={(e) =>
                                            setCurrentPass(
                                                e.target.value.trim()
                                            )
                                        }
                                    />
                                </div>
                            </div>

                            <div className={cx('form__role')}>
                                <div className={cx('form__role__item')}>
                                    <span>
                                        <i
                                            className={cx('fa-regular fa-lock')}
                                        ></i>
                                        New password
                                    </span>
                                    <input
                                        value={newPass}
                                        className={cx('form-control')}
                                        type='password'
                                        placeholder='Password'
                                        onChange={(e) =>
                                            setNewPass(e.target.value.trim())
                                        }
                                    />
                                </div>
                            </div>

                            <div className={cx('form__role')}>
                                <div className={cx('form__role__item')}>
                                    <span>
                                        <i
                                            className={cx('fa-regular fa-lock')}
                                        ></i>
                                        Confirm new password
                                    </span>
                                    <input
                                        ref={confirmPassRef}
                                        value={confirmPass}
                                        className={cx('form-control')}
                                        type='password'
                                        placeholder='Password'
                                        onChange={(e) =>
                                            setConfirmPass(
                                                e.target.value.trim()
                                            )
                                        }
                                    />
                                </div>
                            </div>

                            <div className={cx('form-control-btn')}>
                                {changePassLoading ? (
                                    <LoadingIcon />
                                ) : (
                                    <button
                                        id={'changePassBtn'}
                                        className={cx('form-btn')}
                                        onClick={handleClick.changePassword}
                                    >
                                        Change password
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Top up modal */}
            {store.topupModal && (
                <Modal
                    title={'Top up'}
                    show={store.topupModal}
                    close={() => dispatch(handleTopupModal(false))}
                    size={'medium'}
                >
                    <div className={cx('modal__topup')}>
                        <div className={cx('form-control-modal')}>
                            <div className={cx('form__role')}>
                                <div className={cx('form__role__item')}>
                                    <span>
                                        <i
                                            className={cx(
                                                'fa-regular fa-money-bill-transfer'
                                            )}
                                        ></i>
                                        Top up amount (VND)
                                    </span>
                                    <input
                                        value={amountTopUp}
                                        className={cx('form-control')}
                                        type='number'
                                        placeholder='Amount'
                                        onChange={(e) =>
                                            setAmountTopUp(
                                                e.target.value.trim()
                                            )
                                        }
                                    />
                                </div>
                            </div>

                            {amountTopUp > 0 && (
                                <>
                                    <div className={cx('amount__display')}>
                                        Money text:{' '}
                                        <span>
                                            {VNnum2words(amountTopUp)} đồng
                                        </span>
                                    </div>

                                    <div className={cx('amount__display')}>
                                        Money number:{' '}
                                        <span>
                                            {parseInt(
                                                amountTopUp
                                            ).toLocaleString()}{' '}
                                            VND
                                        </span>
                                    </div>
                                </>
                            )}
                            <div className={cx('form__role')}>
                                <div className={cx('top-up__btn')}>
                                    {topUpLoading ? (
                                        <LoadingIcon />
                                    ) : (
                                        <button onClick={handleClick.topup}>
                                            Submit
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}

            {/* With draw */}
            {store.modalWithdraw && (
                <Modal
                    title='With Draw'
                    size={'medium'}
                    show={store.modalWithdraw}
                    close={() => dispatch(handleModalWithdraw(false))}
                >
                    <div className={cx('modal__topup')}>
                        <div className={cx('form-control-modal')}>
                            <div className={cx('form__role')}>
                                <div className={cx('form__role__item')}>
                                    <span className={cx('withdraw__label')}>
                                        <i
                                            className={cx(
                                                'fa-regular',
                                                'fa-sack-dollar'
                                            )}
                                        ></i>
                                        Withdraw amount (VND)
                                    </span>
                                    <input
                                        value={amountWithdraw}
                                        className={cx('form-control')}
                                        type='number'
                                        placeholder='Withdraw'
                                        onChange={(e) =>
                                            setAmountWithdraw(
                                                e.target.value.trim()
                                            )
                                        }
                                    />
                                </div>
                            </div>

                            {amountWithdraw > 0 && (
                                <>
                                    <div className={cx('amount__display')}>
                                        Money text:{' '}
                                        <span className={cx('withdraw__label')}>
                                            {VNnum2words(amountWithdraw)} đồng
                                        </span>
                                    </div>
                                    <div className={cx('amount__display')}>
                                        Money number:{' '}
                                        <span className={cx('withdraw__label')}>
                                            {parseInt(
                                                amountWithdraw
                                            ).toLocaleString()}{' '}
                                            VND
                                        </span>
                                    </div>
                                </>
                            )}
                            <div className={cx('form__role')}>
                                <div className={cx('top-up__btn')}>
                                    {withdrawLoading ? (
                                        <LoadingIcon />
                                    ) : (
                                        <button onClick={handleClick.withdraw}>
                                            Withdraw
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Donate history */}
            {store.donateHitoryModal && (
                <Modal
                    title={'Donate history'}
                    show={store.donateHitoryModal}
                    close={() => dispatch(handleDonateHistoryModal(false))}
                    size={'large'}
                >
                    <div className={cx('donate-history__modal')}>
                        {store?.user && store.user.donate_history.length > 0 ? (
                            <CTable>
                                <CTableHead>
                                    <CTableRow>
                                        <CTableHeaderCell scope='col'>
                                            ID
                                        </CTableHeaderCell>
                                        <CTableHeaderCell scope='col'>
                                            Beneficiary
                                        </CTableHeaderCell>
                                        <CTableHeaderCell scope='col'>
                                            Amount donated
                                        </CTableHeaderCell>
                                        <CTableHeaderCell scope='col'>
                                            Display name
                                        </CTableHeaderCell>
                                        <CTableHeaderCell scope='col'>
                                            Message
                                        </CTableHeaderCell>
                                        <CTableHeaderCell scope='col'>
                                            Donated time
                                        </CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {store.user.donate_history.map(
                                        (item, index) => {
                                            return (
                                                <CTableRow key={item.id}>
                                                    <CTableHeaderCell scope='row'>
                                                        {index + 1}
                                                    </CTableHeaderCell>
                                                    <CTableDataCell>
                                                        {findPlayerById(
                                                            item.player
                                                        )}
                                                    </CTableDataCell>
                                                    <CTableDataCell>
                                                        {item.money}
                                                    </CTableDataCell>
                                                    <CTableDataCell>
                                                        {item.displayName}
                                                    </CTableDataCell>
                                                    <CTableDataCell>
                                                        {item.message}
                                                    </CTableDataCell>
                                                    <CTableDataCell>
                                                        {moment(
                                                            item.created_at
                                                        ).calendar()}
                                                    </CTableDataCell>
                                                </CTableRow>
                                            );
                                        }
                                    )}
                                </CTableBody>
                            </CTable>
                        ) : (
                            <div className={cx('donate__empty')}>
                                <div className={cx('donate__empty-img')}>
                                    {' '}
                                    <img src={donate_empty} alt='empty' />
                                </div>
                                <span>You have not donated to anyone yet</span>
                            </div>
                        )}
                    </div>
                </Modal>
            )}

            {/* Users Donation */}
            {store.usersDonationModal && (
                <Modal
                    title={'Users Donation'}
                    show={store.usersDonationModal}
                    close={() => dispatch(handleUsersDonationModal(false))}
                    size={'large'}
                >
                    <div className={cx('donate-history__modal')}>
                        {store?.usersDonation &&
                        store?.usersDonation?.length > 0 ? (
                            <CTable>
                                <CTableHead>
                                    <CTableRow>
                                        <CTableHeaderCell scope='col'>
                                            ID
                                        </CTableHeaderCell>
                                        <CTableHeaderCell scope='col'>
                                            {/* User donated */}
                                            User donated
                                        </CTableHeaderCell>
                                        <CTableHeaderCell scope='col'>
                                            Amount donated
                                        </CTableHeaderCell>
                                        <CTableHeaderCell scope='col'>
                                            Nation
                                        </CTableHeaderCell>
                                        {/* <CTableHeaderCell scope='col'>
                                            Message
                                        </CTableHeaderCell>
                                        <CTableHeaderCell scope='col'>
                                            Donated time
                                        </CTableHeaderCell> */}
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {store?.usersDonation.map((item, index) => {
                                        return (
                                            <CTableRow key={item.user.id}>
                                                <CTableHeaderCell scope='row'>
                                                    {index + 1}
                                                </CTableHeaderCell>
                                                <CTableDataCell>
                                                    {item.user.nickname}
                                                </CTableDataCell>
                                                <CTableDataCell
                                                    style={{
                                                        color: '#fe2c55',
                                                        fontWeight: 'bold',
                                                    }}
                                                >
                                                    {parseInt(
                                                        item.donateTotal
                                                    ).toLocaleString()}{' '}
                                                    VND
                                                </CTableDataCell>
                                                <CTableDataCell>
                                                    {item.user.nation}
                                                </CTableDataCell>
                                                {/* <CTableDataCell>
                                                    {item.message}
                                                </CTableDataCell>
                                                <CTableDataCell>
                                                    {moment(
                                                        item.created_at
                                                    ).calendar()}
                                                </CTableDataCell> */}
                                            </CTableRow>
                                        );
                                    })}
                                </CTableBody>
                            </CTable>
                        ) : (
                            <div className={cx('donate__empty')}>
                                <div className={cx('donate__empty-img')}>
                                    {' '}
                                    <img src={donate_empty} alt='empty' />
                                </div>
                                <span>You have not donated to anyone yet</span>
                            </div>
                        )}
                    </div>
                </Modal>
            )}

            {/* Accept modal */}
            {store.acceptRentModal && (
                <Modal
                    title={'Rental management'}
                    show={store.acceptRentModal}
                    size={'small'}
                    close={() => {
                        dispatch(handleAcceptRentModal(false));
                        dispatch(handleAcceptRentModalData(null));
                    }}
                >
                    <div className={cx('contract-manage__modal')}>
                        <div className={cx('title')}>User request: </div>
                        <div className={cx('user__info')}>
                            <div className={cx('user__avatar')}>
                                <img src={contract.avatar} alt='' />
                            </div>

                            <div className={cx('user__name')}>
                                {contract.user_name}
                            </div>
                        </div>
                        <div className={cx('item')}>
                            <div className={cx('item__title')}>
                                Rental time:{' '}
                            </div>
                            <div className={cx('item__content')}>
                                {contract?.time}{' '}
                                {contract?.time > 1 ? 'hours' : 'hour'}
                            </div>
                        </div>
                        <div className={cx('item')}>
                            <div className={cx('item__title')}>Request at:</div>
                            <div className={cx('item__content')}>
                                {moment(contract.created_at).calendar()}
                            </div>
                        </div>

                        <div className={cx('form__action')}>
                            <button
                                className={cx('form__btn-close')}
                                onClick={handleClick.declineRent}
                            >
                                {declineRentLoading ? (
                                    <LoadingIcon />
                                ) : (
                                    'Decline'
                                )}
                            </button>

                            <div className={cx('form__btn-primary')}>
                                {acceptRentLoading ? (
                                    <LoadingIcon />
                                ) : (
                                    <button onClick={handleClick.acceptRent}>
                                        Accept
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Contract managenent */}
            {store.contractManagementModal && (
                <Modal
                    title={'Contract management'}
                    show={store.contractManagementModal}
                    size={'medium'}
                    close={() => dispatch(handleContractManagementModal(false))}
                >
                    <div className={cx('contract-manage__modal')}>
                        {store?.user?.contract &&
                        store?.user?.contract.length > 0 ? (
                            <CTable>
                                <CTableHead>
                                    <CTableRow>
                                        <CTableHeaderCell scope='col'>
                                            ID
                                        </CTableHeaderCell>
                                        <CTableHeaderCell scope='col'>
                                            Player
                                        </CTableHeaderCell>
                                        <CTableHeaderCell scope='col'>
                                            Rental time
                                        </CTableHeaderCell>
                                        <CTableHeaderCell scope='col'>
                                            Rental fee
                                        </CTableHeaderCell>
                                        <CTableHeaderCell scope='col'>
                                            Status
                                        </CTableHeaderCell>

                                        <CTableHeaderCell scope='col'>
                                            Requested at
                                        </CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {store?.user?.contract?.map(
                                        (item, index) => {
                                            return (
                                                <CTableRow>
                                                    <CTableHeaderCell scope='row'>
                                                        {index + 1}
                                                    </CTableHeaderCell>
                                                    <CTableDataCell>
                                                        {findPlayerById(
                                                            item.user
                                                        )}
                                                    </CTableDataCell>
                                                    <CTableDataCell>
                                                        {item.time}{' '}
                                                        {item.time > 1
                                                            ? 'hours'
                                                            : 'hour'}
                                                    </CTableDataCell>
                                                    <CTableDataCell>
                                                        {item.fee}
                                                    </CTableDataCell>
                                                    <CTableDataCell
                                                        style={{
                                                            fontWeight: 'bold',

                                                            color:
                                                                item.status ===
                                                                'Pending'
                                                                    ? item.status ===
                                                                      'Pending'
                                                                        ? 'orange'
                                                                        : 'green'
                                                                    : 'red',
                                                        }}
                                                    >
                                                        {item.status}
                                                        {item.status ===
                                                        'Pending'
                                                            ? '...'
                                                            : null}
                                                    </CTableDataCell>
                                                    <CTableDataCell>
                                                        {moment(
                                                            item?.created_at
                                                        ).calendar()}
                                                    </CTableDataCell>
                                                </CTableRow>
                                            );
                                        }
                                    )}
                                </CTableBody>
                            </CTable>
                        ) : (
                            <div className={cx('not__following')}>
                                You have no contract!
                            </div>
                        )}
                    </div>
                </Modal>
            )}
        </>
    );
}

export default Actions;
