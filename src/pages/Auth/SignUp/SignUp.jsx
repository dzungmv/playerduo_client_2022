import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './SignUp.module.scss';
import { CFormCheck } from '@coreui/react';
import '@coreui/coreui/dist/css/coreui.min.css';
import { toast } from 'react-toastify';

import { useDispatch } from 'react-redux';
import {
    handleModalLogin,
    handleModalRegister,
} from '@/_redux/features/modal/modalSlice';

import authApi from '@/api/authApi';

import LoadingIcon from '@/layouts/LoadingIcon';

const cx = classNames.bind(styles);

function SignUp() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const usernameRef = useRef(null);
    const nicknameRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const birthdayRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [gender, setGender] = useState('Male');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [language, setLanguage] = useState('');
    const [nation, setNation] = useState('');

    function isValidEmail(email) {
        return /\S+@\S+\.\S+/.test(email);
    }

    const handleClick = {
        ridirectToSignIn: () => {
            navigate('/login');
        },
        register: async () => {
            if (!username) {
                toast.error('Username is required1');
                usernameRef.current.focus();
                return;
            }

            if (!nickname) {
                toast.error('Nickname is required!');
                nicknameRef.current.focus();
                return;
            }

            if (!email) {
                toast.error('Email is required!');
                emailRef.current.focus();
                return;
            }

            if (!isValidEmail(email)) {
                toast.error('Email is invalid!');
                emailRef.current.focus();
                return;
            }

            if (!password) {
                toast.error('Password is required!');
                passwordRef.current.focus();
                return;
            }

            if (password.length < 6) {
                toast.error('Password must be at least 6 characters!');
                passwordRef.current.focus();
                return;
            }

            if (!dateOfBirth) {
                toast.error('Date of birth is required!');
                birthdayRef.current.focus();
                return;
            }

            try {
                setLoading(true);
                await authApi.post('v1/auth/register', {
                    username,
                    password,
                    email,
                    gender,
                    nickname,
                    dateOfBirth,
                    language,
                    nation,
                });
                toast.success('Register successfully, please login!');
                setLoading(false);
                dispatch(handleModalRegister(false));
                dispatch(handleModalLogin(true));
            } catch (error) {
                toast.error(
                    error?.response?.data?.error || 'Something went wrong!'
                );
                setLoading(false);
            }
        },
    };
    return (
        <div className={cx('wrapper')}>
            {/* <div className={cx('heading')}>
                <div className={cx('logo')}>
                    <img className={cx('logo__image')} src={logo} alt='logo' />
                    <span className={cx('logo__name')}>PLAYERDUAL</span>
                </div>

                <div className={cx('heading__action')}>
                    <span>Already have account?</span>
                    <button onClick={handleClick.ridirectToSignIn}>
                        Sign in
                    </button>
                </div>
            </div> */}
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
                        {/* <div className={cx('logo')}>
                            <div className={cx('logo__image')}>
                                <img src={logo} alt='logo' />
                            </div>
                        </div> */}
                        <div className={cx('form__role')}>
                            <div className={cx('form__role__item')}>
                                <span>
                                    <i className={cx('fa-regular fa-user')}></i>
                                    Username
                                </span>
                                <input
                                    ref={usernameRef}
                                    value={username}
                                    className={cx('form-control')}
                                    type='text'
                                    placeholder='Username'
                                    onChange={(e) =>
                                        setUsername(e.target.value.trim())
                                    }
                                />
                            </div>

                            <div className={cx('form__role__item')}>
                                <span>
                                    <i
                                        className={cx(
                                            'fa-regular fa-signature'
                                        )}
                                    ></i>
                                    Nick name
                                </span>
                                <input
                                    ref={nicknameRef}
                                    value={nickname}
                                    className={cx('form-control')}
                                    type='text'
                                    placeholder='Choose your name to display'
                                    onChange={(e) =>
                                        setNickname(e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <div className={cx('form__role')}>
                            <div className={cx('form__role__item')}>
                                <span>
                                    <i
                                        className={cx('fa-regular fa-envelope')}
                                    ></i>
                                    Email
                                </span>
                                <input
                                    ref={emailRef}
                                    value={email}
                                    className={cx('form-control')}
                                    type='email'
                                    placeholder='abc@example.com'
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className={cx('form__role')}>
                            <div className={cx('form__role__item')}>
                                <span>
                                    <i className={cx('fa-regular fa-lock')}></i>
                                    Password
                                </span>
                                <input
                                    ref={passwordRef}
                                    value={password}
                                    className={cx('form-control')}
                                    type='password'
                                    placeholder='Password'
                                    onChange={(e) =>
                                        setPassword(e.target.value.trim())
                                    }
                                />
                            </div>
                        </div>

                        <div className={cx('form__role')}>
                            <span>
                                <i
                                    className={cx('fa-regular fa-venus-mars')}
                                ></i>
                                Gender
                            </span>
                            <CFormCheck
                                value={'Male'}
                                type='radio'
                                name='gender'
                                id='male'
                                label='Male'
                                onChange={(e) => setGender(e.target.value)}
                                defaultChecked
                            />
                            <CFormCheck
                                value={'Female'}
                                type='radio'
                                name='gender'
                                id='female'
                                onChange={(e) => setGender(e.target.value)}
                                label='Female'
                            />
                        </div>

                        <div className={cx('form__role')}>
                            <div className={cx('form__role__item')}>
                                <span>
                                    <i
                                        className={cx(
                                            'fa-regular fa-cake-candles'
                                        )}
                                    ></i>
                                    Date of birth
                                </span>
                                <input
                                    ref={birthdayRef}
                                    value={dateOfBirth}
                                    className={cx('form-control')}
                                    type='date'
                                    placeholder='Password'
                                    onChange={(e) =>
                                        setDateOfBirth(e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <div className={cx('form__role')}>
                            <div className={cx('form__role__item')}>
                                <span>
                                    <i
                                        className={cx('fa-regular fa-language')}
                                    ></i>
                                    Language
                                </span>
                                <select
                                    value={language}
                                    className={cx('form-control')}
                                    name='language'
                                    id='language'
                                    onChange={(e) =>
                                        setLanguage(e.target.value)
                                    }
                                >
                                    <option value='Vietnamese'>
                                        Vietnamese
                                    </option>
                                    <option value='English'>English</option>
                                    <option value='Chinese'>Chinese</option>
                                    <option value='Spanish'>Spanish</option>
                                    <option value='Arabic'>Arabic</option>
                                    <option value='Russian'>Russian</option>
                                    <option value='Japanese'>Japanese</option>
                                    <option value='Korean'>Korean</option>
                                    <option value='Other'>Other</option>
                                </select>
                            </div>

                            <div className={cx('form__role__item')}>
                                <span>
                                    <i
                                        className={cx(
                                            'fa-regular fa-earth-americas'
                                        )}
                                    ></i>
                                    Nation
                                </span>
                                <select
                                    value={nation}
                                    className={cx('form-control')}
                                    name='nation'
                                    id='nation'
                                    onChange={(e) => setNation(e.target.value)}
                                >
                                    <option value='Vietnam'>Vietnam</option>
                                    <option value='England'>England</option>
                                    <option value='China'>China</option>
                                    <option value='Spain'>Spain</option>
                                    <option value='Arab'>Arab</option>
                                    <option value='Rusia'>Rusia</option>
                                    <option value='Japan'>Japan</option>
                                    <option value='Korea'>Korea</option>
                                    <option value='Other'>Other</option>
                                </select>
                            </div>
                        </div>

                        <div className={cx('form-control-btn')}>
                            {loading ? (
                                <LoadingIcon />
                            ) : (
                                <button
                                    className={cx('form-btn')}
                                    onClick={handleClick.register}
                                >
                                    Sign up
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUp;
