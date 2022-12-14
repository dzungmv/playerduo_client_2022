import classNames from 'classnames/bind';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';
import OtpInput from 'react-otp-input';
import { useDispatch } from 'react-redux';

import transactionApi from '@/api/transactionApi';

import { updateBalance, setWithdraw } from '@/_redux/features/user/userSlice';

import LoadingIcon from '@/layouts/LoadingIcon';

import styles from './OTP.module.scss';

import useEnterKeyListener from '@/hooks/useEnterKeyListener';

import { DynamicTitle } from '@/layouts/DefaultLayout/DynamicTitle/DynamicTitle';

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

function WithDrawOTP() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { amount } = useParams();

    DynamicTitle('Withdraw OTP');

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

            const { data } = await transactionApi.put(`v1/transaction`, {
                otp,
            });

            dispatch(updateBalance(data?.data?.balance));
            dispatch(setWithdraw(data?.data?.transaction?.withdraw));
            navigate('/');
            toast.success(
                `You have successfully withdrawn ${parseInt(
                    amount
                ).toLocaleString()} VND`
            );
        } catch (err) {
            toast.error(err.response.data.error || 'Something went wrong');
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        try {
            setLoadingResend(true);
            await transactionApi.post('v1/transaction', {
                amount: -amount,
            });
            setLoadingResend(false);
            toast.success('Resend OTP successfully');
        } catch (error) {
            toast.error(error.response.data.error || 'Something went wrong');
            setLoadingResend(false);
        }
    };

    return (
        <>
            <div className={cx('wrapper')}>
                <div className={cx('container')}>
                    <div className={cx('header')}>
                        <div className={cx('header__title')}>
                            Withdraw verification
                        </div>
                        <p className={cx('header__des')}>
                            We have sent a verification code to your email
                            address. Please enter the code below to verify your
                            withdraw.
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
                        <button
                            id={'btn_veryfy_otp'}
                            onClick={handleConfirmOTP}
                            disabled={loading}
                        >
                            Confirm
                        </button>
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

export default WithDrawOTP;
