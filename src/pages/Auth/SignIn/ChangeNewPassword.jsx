import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './SignIn.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import userApi from '@/api/userApi';
import transactionApi from '@/api/transactionApi';

import {
    setUserInformation,
    setFollowing,
    setTopup,
    setWithdraw,
} from '@/_redux/features/user/userSlice';

import {
    handleModalLogin,
    handleForgotPassModal,
} from '@/_redux/features/modal/modalSlice';

import LoadingIcon from '@/layouts/LoadingIcon';
import { DynamicTitle } from '@/layouts/DefaultLayout/DynamicTitle/DynamicTitle';

// import login_bg from '@/assets/images/login-bg.png';

const cx = classNames.bind(styles);

function ChangeNewPassword() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    DynamicTitle('Reset password');

    const userID = useSelector((state) => state?.user?.user.id);

    const checkListFollowing = useSelector(
        (state) => state?.user?.user?.following
    );
    const checkListTopup = useSelector((state) => state?.user?.user?.topup);
    const checkListWithdraw = useSelector(
        (state) => state?.user?.user?.withdraw
    );

    const checkUserInformation = useSelector(
        (state) => state?.user?.user?.information
    );
    const checkUser = useSelector((state) => state?.user?.user?.isLogin);

    useEffect(() => {
        if (checkUser) {
            const getUserInformation = async () => {
                if (
                    checkUserInformation &&
                    Object.getOwnPropertyNames(checkUserInformation).length ===
                        0 &&
                    checkUser
                ) {
                    const { data } = await userApi.get(`v1/user/id/${userID}`);
                    dispatch(setUserInformation(data?.data?.user));
                }
            };

            const getFollowing = async () => {
                if (
                    checkListFollowing &&
                    Object.getOwnPropertyNames(checkListFollowing).length ===
                        0 &&
                    checkUser
                ) {
                    const { data } = await userApi.get(`v1/user/following`);
                    dispatch(setFollowing(data?.data));
                }
            };

            const getTransactions = async () => {
                if (
                    checkListTopup &&
                    checkListTopup.length === 0 &&
                    checkListWithdraw &&
                    checkListWithdraw.length === 0 &&
                    checkUser
                ) {
                    const { data } = await transactionApi.get(`v1/transaction`);
                    dispatch(setTopup(data?.data?.topup));
                    dispatch(setWithdraw(data?.data?.withdraw));
                }
            };

            getUserInformation();
            getFollowing();
            getTransactions();
            // reload page
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [checkUser]);

    // function isValidEmail(email) {
    //     return /\S+@\S+\.\S+/.test(email);
    // }

    const handleSubmitForm = async () => {
        if (!password) {
            toast.error('Password is required!');
            return;
        }

        if (!confirmPassword) {
            toast.error('Confirm password is required!');
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Password and confirm password must be the same!');
            return;
        }

        try {
            setLoading(true);

            await userApi.post(`v1/auth/recover/new-password`, {
                newPassword: password,
            });
            setLoading(false);
            navigate('/');
            dispatch(handleForgotPassModal(false));
            toast.success('Reset password successful!');
        } catch (error) {
            toast.error(
                error?.response?.data?.error || 'Something went wrong!'
            );
            setLoading(false);
        }
    };
    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                {/* <div className={cx('image')}>
                    <img
                        className={cx('image__action')}
                        src={login_bg}
                        alt='login'
                    />
                </div> */}
                <div className={cx('form')}>
                    <div className={cx('form__container')}>
                        <h3 className={cx('form__title')}>
                            Reset your password
                        </h3>
                        <div className={cx('description')}>
                            <span>{/* please change new password */}</span>
                        </div>
                        <input
                            className={cx('form-control')}
                            type='password'
                            placeholder='New password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <input
                            className={cx('form-control')}
                            type='password'
                            placeholder='Confirm new password'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />

                        <div className={cx('forgot__btn')}>
                            {loading ? (
                                <LoadingIcon />
                            ) : (
                                <button onClick={handleSubmitForm}>
                                    Reset
                                </button>
                            )}
                        </div>

                        <div
                            className={cx('redirect__login')}
                            onClick={() => {
                                dispatch(handleForgotPassModal(false));
                                dispatch(handleModalLogin(true));
                            }}
                        >
                            Back to login.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChangeNewPassword;
