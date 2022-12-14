import { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './SignIn.module.scss';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import authApi from '@/api/authApi';

import {
    handleModalLogin,
    handleForgotPassModal,
} from '@/_redux/features/modal/modalSlice';

import LoadingIcon from '@/layouts/LoadingIcon';

// import login_bg from '@/assets/images/login-bg.png';

const cx = classNames.bind(styles);

function ForgotPassword() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);

    // function isValidEmail(email) {
    //     return /\S+@\S+\.\S+/.test(email);
    // }

    const handleSubmitForm = async () => {
        if (!username) {
            toast.error('Username is required!');
            return;
        }

        try {
            setLoading(true);

            await authApi.post(`v1/auth/recover`, {
                username,
            });
            setLoading(false);
            navigate(`/forgot-pass-otp/${username}`);
            toast.success('Please check your email!');
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
                        <h3 className={cx('form__title')}>Find your account</h3>
                        <div className={cx('description')}>
                            <span>
                                Please enter your email address to search for
                                your account. We will send your code in your
                                email address. Please check your email.
                            </span>
                        </div>
                        <input
                            className={cx('form-control')}
                            type='text'
                            placeholder='Username'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />

                        <div className={cx('forgot__btn')}>
                            {loading ? (
                                <LoadingIcon />
                            ) : (
                                <button onClick={handleSubmitForm}>
                                    Submit
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

export default ForgotPassword;
