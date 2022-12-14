import classNames from 'classnames/bind';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';
import OtpInput from 'react-otp-input';
import { useDispatch } from 'react-redux';
import jwt_decode from 'jwt-decode';

import { login } from '@/_redux/features/user/userSlice';

import authApi from '@/api/authApi';

import LoadingIcon from '@/layouts/LoadingIcon';

import styles from './OTP.module.scss';

import useEnterKeyListener from '@/hooks/useEnterKeyListener';

const cx = classNames.bind(styles);

const style = {
    separaStyle: {
        color: 'rgba(22,24,35,0.2)',
    },

    inputStyle: {
        width: '100%',
        height: '40px',
        fontSize: '20px',
        border: '1px solid rgba(22,24,35,0.2)',
        borderRadius: '5px',
        color: 'black',
    },
};

function ForgotPassOTP() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { username } = useParams();

    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingResend, setLoadingResend] = useState(false);

    useEnterKeyListener({
        querySelectorToExecuteClick: '#btn_veryfy_otp',
    });

    const handleChangeOtp = (otp) => {
        setOtp(otp);
    };

    const handleConfirmOTP = async () => {
        if (otp.length !== 6) {
            toast.error('OTP must be 6 digits');
            return;
        }

        try {
            setLoading(true);
            const { data } = await authApi.post(
                `v1/auth/recover/verification`,
                {
                    username,
                    otp,
                }
            );
            setLoading(false);

            localStorage.setItem('accessToken', data?.accessToken);
            const userID = jwt_decode(data?.accessToken);
            dispatch(login(userID?.id));
            setLoading(false);
            // navigate('/');
            navigate('/reset-password');
            toast.success(
                'Reset password successful, please change your password!'
            );
        } catch (error) {
            toast.error(error?.response?.data?.error || 'Something went wrong');
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        try {
            setLoadingResend(true);
            await authApi.post(`v1/auth/recover`, { username });
            setLoadingResend(false);
            toast.success('Please check your email again!');
        } catch (error) {
            toast.error(error?.response?.data?.error || 'Something went wrong');
        }
    };

    return (
        <>
            <div className={cx('wrapper')}>
                <div className={cx('container')}>
                    <div className={cx('header')}>
                        <div className={cx('header__title')}>
                            Forgot password
                        </div>
                        <div className={cx('hello')}>
                            Hi, <span>{username}</span>!
                        </div>
                        <p className={cx('header__des')}>
                            We have sent a verification code to your email.
                            Please check your email and enter the code below.
                        </p>
                    </div>

                    <div className={cx('otp__form')}>
                        <OtpInput
                            inputStyle={style.inputStyle}
                            value={otp}
                            onChange={handleChangeOtp}
                            numInputs={6}
                            separator={<span>&nbsp; &nbsp;</span>}
                            hasErrored
                            shouldAutoFocus
                            isInputNum
                        />
                    </div>

                    <div className={cx('btn__confirm')}>
                        {loading ? (
                            <LoadingIcon />
                        ) : (
                            <button
                                id={'btn_veryfy_otp'}
                                onClick={handleConfirmOTP}
                                disabled={loading}
                            >
                                Confirm
                            </button>
                        )}
                    </div>

                    <div className={cx('footer')}>
                        <div className={cx('footer__item')}>
                            <div className={cx('footer__item--des')}>
                                Don't receive code?
                            </div>

                            <div className={cx('resend-btn')}>
                                {loadingResend ? (
                                    <LoadingIcon />
                                ) : (
                                    <button onClick={handleResendOTP}>
                                        Resend
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ForgotPassOTP;
