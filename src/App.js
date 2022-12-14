import { Route, useNavigate, Routes } from 'react-router-dom';
import React, { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector, useDispatch } from 'react-redux';

import { DefaultLayout } from '@/layouts';

import {
    handleModalWithdraw,
    handleModalEditProfile,
    handleModalLogin,
    handleModalRegister,
    handleModalListFollowing,
    handleRentModal,
    handleLoginRequiredModal,
    handlePostModal,
    handleChangePassModal,
    handleForgotPassModal,
    handleTopupModal,
    handleDonateModal,
    handleDonateHistoryModal,
} from '@/_redux/features/modal/modalSlice';
import Modal from '@/components/Modal';
import login_required from '@/assets/icons/login_required_bg.svg';

import Home from '@/pages/Home/Home';
import PlayersProRandom from '@/pages/Home/Content/PlayersProRandom';
import PlayersProFilterByGame from '@/pages/Home/Content/PlayersProFilterByGame';
import Profile from '@/pages/Profile';
import UserProfile from '@/pages/UserProfile';
import Follower from '@/pages/UserProfile/Follower';
import Body from '@/pages/UserProfile/Body';
import Following from '@/pages/UserProfile/Following';
import Messenger from '@/pages/Messenger';
import MessengerNotSelected from '@/pages/Messenger/MessengerNotSelected';
import MessengerContent from '@/pages/Messenger/MessengerContent';
import MessengerNotFound from '@/pages/Messenger/MessengerNotFound';
import ErrorPage from '@/layouts/ErrorPage/ErrorPage';
import TopUpOTP from '@/pages/Auth/TopUpOTP';
import WithDrawOTP from '@/pages/Auth/WithDrawOTP';
import ForgotPassOTP from '@/pages/Auth/ForgotPassOTP';
import Transaction from '@/pages/Transaction';
import Topup from '@/pages/Transaction/Topup';
import Withdraw from '@/pages/Transaction/Withdraw';
import ChangeNewPassword from '@/pages/Auth/SignIn/ChangeNewPassword';

function App() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // close all modal when reload
    useEffect(() => {
        window.onbeforeunload = () => {
            dispatch(handleModalEditProfile(false));
            dispatch(handleModalLogin(false));
            dispatch(handleModalRegister(false));
            dispatch(handleModalWithdraw(false));
            dispatch(handleModalListFollowing(false));
            dispatch(handleRentModal(false));
            dispatch(handleLoginRequiredModal(false));
            dispatch(handlePostModal(false));
            dispatch(handleChangePassModal(false));
            dispatch(handleForgotPassModal(false));
            dispatch(handleTopupModal(false));
            dispatch(handleDonateModal(false));
            dispatch(handleDonateHistoryModal(false));
        };

        return () => (window.onbeforeunload = null);
    }, [dispatch]);

    const store = {
        loginRequiredModal: useSelector(
            (state) => state.modal.modalType.loginRequiredModal
        ),
    };

    return (
        <div className='App'>
            <ToastContainer
                position='top-right'
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme='light'
            />

            <Routes>
                {/* {publicRoutes.map((route, index) => {
                    const Page = route.component;
                    let Layout = DefaultLayout;

                    if(route.index === true) {
                        Layout = Fragment;

                    }

                    if (route.layout) {
                        Layout = route.layout;
                    } else if (route.layout === null) {
                        Layout = Fragment;
                    }
                    return (
                        <Route
                            key={index}
                            path={route.path}
                            element={
                                <Layout>
                                    <Page />
                                </Layout>
                            }
                        />
                    );
                })} */}

                <Route
                    path='*'
                    element={
                        <DefaultLayout>
                            <ErrorPage />
                        </DefaultLayout>
                    }
                />

                <Route
                    path='/'
                    element={
                        <DefaultLayout>
                            <Home />
                        </DefaultLayout>
                    }
                >
                    <Route index element={<PlayersProRandom />} />
                    <Route
                        path='filter/games/:id'
                        element={<PlayersProFilterByGame />}
                    />
                </Route>
                <Route
                    path='/user/profile/:urlCode'
                    element={
                        <DefaultLayout>
                            <UserProfile />
                        </DefaultLayout>
                    }
                >
                    <Route index element={<Body />} />
                    <Route path='follower' element={<Follower />} />
                    <Route path='following' element={<Following />} />
                </Route>

                <Route
                    path='/player/profile/:id'
                    element={
                        <DefaultLayout>
                            <Profile />
                        </DefaultLayout>
                    }
                />
                <Route
                    path='/messengers'
                    element={
                        <DefaultLayout>
                            <Messenger />
                        </DefaultLayout>
                    }
                >
                    <Route index element={<MessengerNotSelected />} />
                    <Route exact path=':id' element={<MessengerContent />} />
                    <Route path='*' element={<MessengerNotFound />} />
                </Route>

                <Route
                    path='/transaction-history'
                    element={
                        <DefaultLayout>
                            <Transaction />
                        </DefaultLayout>
                    }
                >
                    <Route index element={<Topup />} />
                    <Route path='topup' element={<Topup />} />
                    <Route path='withdraw' element={<Withdraw />} />
                </Route>

                <Route path='/top-up-otp/:amount' element={<TopUpOTP />} />
                <Route
                    path='/with-draw-otp/:amount'
                    element={<WithDrawOTP />}
                />
                <Route
                    path='/forgot-pass-otp/:username'
                    element={<ForgotPassOTP />}
                />

                <Route
                    path='/reset-password'
                    element={
                        <DefaultLayout>
                            <ChangeNewPassword />
                        </DefaultLayout>
                    }
                />
            </Routes>

            {store.loginRequiredModal && (
                <Modal
                    title={'Login require'}
                    show={store.loginRequiredModal}
                    close={() => dispatch(handleLoginRequiredModal(false))}
                    size={'medium'}
                >
                    <div className='login-required-container'>
                        <div className='login-require-img'>
                            <img src={login_required} alt='login' />
                        </div>
                        <span className='login-require-tip'>
                            You need login first to use this feature!
                        </span>
                        <div
                            className='login-require-btn'
                            onClick={() => {
                                dispatch(handleLoginRequiredModal(false));
                                navigate('/');
                                dispatch(handleModalLogin(true));
                            }}
                        >
                            Login now!
                        </div>

                        <div
                            className='login-require-close'
                            onClick={() =>
                                dispatch(handleLoginRequiredModal(false))
                            }
                        >
                            Continue as guest
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}

export default App;
