import { useState, useRef } from 'react';
import classNames from 'classnames/bind';
import { toast } from 'react-toastify';
import jwt_decode from 'jwt-decode';
import { useDispatch } from 'react-redux';

// import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
// import firebase from 'firebase/compat/app';
// import 'firebase/compat/auth';

import authApi from '@/api/authApi';
import { login } from '@/_redux/features/user/userSlice';
import {
    handleModalLogin,
    handleModalRegister,
    handleForgotPassModal,
} from '@/_redux/features/modal/modalSlice';

import styles from './SignIn.module.scss';
import login_bg from '@/assets/images/login-bg.svg';
import google_logo from '@/assets/icons/google.png';
import useEnterKeyListener from '@/hooks/useEnterKeyListener';
import LoadingIcon from '@/layouts/LoadingIcon';

const cx = classNames.bind(styles);

// const uiConfig = {
//     signInFlow: 'popup',
//     signInSuccessUrl: '/',
//     signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
// };

function SignIn() {
    const dispatch = useDispatch();

    const usernameRef = useRef(null);
    const passwordRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    useEnterKeyListener({
        querySelectorToExecuteClick: '#submitLoginBtn',
    });

    const handleClick = {
        ridirectToSignUp: () => {
            dispatch(handleModalLogin(false));
            dispatch(handleModalRegister(true));
        },
        redirectForgotPassword: () => {
            dispatch(handleModalLogin(false));
            dispatch(handleForgotPassModal(true));
        },
        Login: async () => {
            if (!username) {
                toast.error('Please enter your username');
                usernameRef.current.focus();
                return;
            }
            if (!password) {
                toast.error('Please enter your password');
                passwordRef.current.focus();
                return;
            }

            try {
                setLoading(true);
                const { data } = await authApi.post('v1/auth/login', {
                    username,
                    password,
                });
                localStorage.setItem('accessToken', data?.accessToken);
                const userID = jwt_decode(data?.accessToken);
                dispatch(login(userID?.id));
                dispatch(handleModalLogin(false));
                setLoading(false);
                // navigate('/');
                toast.success('Login success!');
            } catch (error) {
                toast.error(error?.response?.data?.error);
                setLoading(false);
            }
        },
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('image')}>
                    <img
                        className={cx('image__action')}
                        src={login_bg}
                        alt='login'
                    />
                </div>
                <div className={cx('form')}>
                    <div className={cx('form__container')}>
                        {/* <h3 className={cx('form__title')}>Sign in</h3> */}
                        {/* <div className={cx('logo')}>
                            <div className={cx('logo__image')}>
                                <img src={logo} alt='logo' />
                            </div>
                        </div> */}

                        <input
                            ref={usernameRef}
                            value={username}
                            className={cx('form-control')}
                            type='text'
                            placeholder='Username'
                            onChange={(e) => setUsername(e.target.value.trim())}
                        />

                        <input
                            ref={passwordRef}
                            value={password}
                            className={cx('form-control')}
                            type='password'
                            placeholder='Password'
                            onChange={(e) => setPassword(e.target.value.trim())}
                        />

                        <div className={cx('form-control-btn')}>
                            {loading ? (
                                <LoadingIcon />
                            ) : (
                                <button
                                    id='submitLoginBtn'
                                    className={cx('form-btn')}
                                    onClick={handleClick.Login}
                                >
                                    Sign in
                                </button>
                            )}
                        </div>

                        <div
                            className={cx('forgot-password')}
                            onClick={handleClick.redirectForgotPassword}
                        >
                            <span>Forgot password?</span>
                        </div>

                        {/* 
                        <div className={cx('hr')}>
                            <div className={cx('hr-custom')}>
                                <span className={cx('hr-custom__title')}>
                                    Or sign in with
                                </span>
                            </div>
                        </div> */}

                        {/* <div className={cx('form__footer')}>
                            <div className={cx('form__footer-container')}>
                                <div
                                    className={cx('google__btn')}
                                    onClick={() => {
                                        document
                                            .querySelector(
                                                '.firebaseui-idp-button'
                                            )
                                            .click();
                                    }}
                                >
                                    <div className={cx('google__btn-icon')}>
                                        <img src={google_logo} alt='' />
                                    </div>
                                    <span>Sign in with google</span>
                                </div>
                                <div style={{ display: 'none' }}>
                                    <StyledFirebaseAuth
                                        uiConfig={uiConfig}
                                        firebaseAuth={firebase.auth()}
                                    />
                                </div>
                            </div>
                        </div> */}

                        <div
                            className={cx('auth')}
                            onClick={handleClick.ridirectToSignUp}
                        >
                            Don't have an account?
                            <span>Sign up now</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignIn;
