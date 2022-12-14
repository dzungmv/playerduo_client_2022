import React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames/bind';

import gameApi from '@/api/gameApi';
import userApi from '@/api/userApi';
import transactionApi from '@/api/transactionApi';
import donateApi from '@/api/donateApi';

import {
    setUserInformation,
    setFollowing,
    setTopup,
    setWithdraw,
    setIsTopupData,
    setIsWithdrawData,
    setPlayerContract,
    setUsersDonation,
    setFollowers,
} from '@/_redux/features/user/userSlice';
import { setGames } from '@/_redux/features/games/gamesSlice';
import { setPlayersPro } from '@/_redux/features/player/playerSlice';
import {
    handleModalLogin,
    handleForgotPassModal,
    handleModalRegister,
} from '@/_redux/features/modal/modalSlice';

import styles from './Home.module.scss';
// import GlobalChat from './GlobalChat';
// import Modal from '@/components/Modal';
import Sidebar from './Sidebar';
// import SignIn from '@/pages/Auth/SignIn';
// import SignUp from '@/pages/Auth/SignUp';
import Content from './Content';

import { DynamicTitle } from '@/layouts/DefaultLayout/DynamicTitle/DynamicTitle';

import SignIn from '@/pages/Auth/SignIn';
import SignUp from '@/pages/Auth/SignUp';
import ForgotPassword from '@/pages/Auth/SignIn/ForgotPassword';
import Modal from '@/components/Modal';

// const Content = React.lazy(() => import('./Content'));

const cx = classNames.bind(styles);

function Home() {
    const dispatch = useDispatch();
    DynamicTitle('PlayerDual');

    const userID = useSelector((state) => state?.user?.user.id);

    const checkPlayerPro = useSelector((state) => state?.player?.playersPro);
    const checkListGames = useSelector((state) => state?.games?.games);
    // const checkListFollowing = useSelector(
    //     (state) => state?.user?.user?.following
    // );
    // const checkListTopup = useSelector(
    //     (state) => state?.user?.user?.isTopupData
    // );
    // const checkListWithdraw = useSelector(
    //     (state) => state?.user?.user?.isWithdrawData
    // );

    // const checkUserInformation = useSelector(
    //     (state) => state?.user?.user?.information
    // );
    const checkUser = useSelector((state) => state?.user?.user?.isLogin);

    // Reset modal
    useEffect(() => {
        window.onbeforeunload = () => {
            dispatch(handleModalLogin(false));
            dispatch(handleModalRegister(false));
        };
        return () => {
            window.onbeforeunload = null;
        };
    }, [dispatch]);

    useEffect(() => {
        if (checkUser) {
            const getUserInformation = async () => {
                // if (
                //     checkUserInformation &&
                //     Object.getOwnPropertyNames(checkUserInformation).length ===
                //         0 &&
                //     checkUser
                // ) {
                const { data } = await userApi.get(`v1/user/id/${userID}`);
                dispatch(setUserInformation(data?.data?.user));
                // }
            };

            const getFollowing = async () => {
                // if (
                //     checkListFollowing &&
                //     Object.getOwnPropertyNames(checkListFollowing).length ===
                //         0 &&
                //     checkUser
                // ) {
                const { data } = await userApi.get(`v1/user/following`);
                dispatch(setFollowing(data?.data));
                // }
            };

            const getTransactions = async () => {
                // if (checkUser && (!checkListTopup || !checkListWithdraw)) {
                const { data } = await transactionApi.get(`v1/transaction`);

                dispatch(setTopup(data?.data?.topup));
                dispatch(setIsTopupData(true));

                dispatch(setWithdraw(data?.data?.withdraw));
                dispatch(setIsWithdrawData(true));
                // }
            };

            const getTopDonator = async () => {
                const { data } = await donateApi.get(
                    `v1/player/${userID}/donate`
                );

                dispatch(setUsersDonation(data?.data?.donate));
            };

            const getPlayerContract = async () => {
                const { data } = await userApi.get(
                    `v1/contract/player/${userID}`
                );

                dispatch(setPlayerContract(data?.data?.data));
            };

            const getFollower = async () => {
                const { data } = await userApi.get(
                    `v1/player/${userID}/follower`
                );

                dispatch(setFollowers(data?.data));
            };

            getUserInformation();
            getFollowing();
            getTransactions();
            getPlayerContract();
            getTopDonator();
            getFollower();
            // reload page
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [checkUser]);

    useEffect(() => {
        const getProUsersFunc = async () => {
            if (!checkPlayerPro.length) {
                const { data } = await userApi.get('v1/player');
                dispatch(setPlayersPro(data?.data?.user));
            }
        };

        const getGameStore = async () => {
            if (!checkListGames.length) {
                const { data } = await gameApi.get('v1/game');
                dispatch(setGames(data?.data?.data));
            }
        };
        getProUsersFunc();
        getGameStore();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const modalLogin = useSelector(
        (state) => state?.modal?.modalType?.modalLogin
    );
    const modalRegister = useSelector(
        (state) => state?.modal?.modalType?.modalRegister
    );
    const forgotPassModal = useSelector(
        (state) => state?.modal?.modalType?.forgotPassModal
    );

    return (
        <>
            <div className={cx('wrapper')}>
                {/* <div className={cx('global-chat')}>
                    <GlobalChat />
                </div> */}

                <div className={cx('side-bar')}>
                    {/* <PerfectScrollbar> */}
                    <Sidebar />
                    {/* </PerfectScrollbar> */}
                </div>

                <div className={cx('container')}>
                    {/* use outlet react router-dom in here */}
                    <Content />
                </div>
            </div>

            {modalLogin && (
                <Modal
                    title='Login'
                    show={modalLogin}
                    notCloseOutside={true}
                    close={() => dispatch(handleModalLogin(false))}
                    size={'large'}
                >
                    <>
                        {/* click to swap sign in adn sign up */}

                        <SignIn />
                    </>
                </Modal>
            )}

            {modalRegister && (
                <Modal
                    title='Register'
                    notCloseOutside={true}
                    show={modalRegister}
                    close={() => dispatch(handleModalRegister(false))}
                    size={'large'}
                >
                    <>
                        {/* click to swap sign in adn sign up */}
                        <SignUp />
                    </>
                </Modal>
            )}

            {forgotPassModal && (
                <Modal
                    title={'Forgot Password'}
                    show={forgotPassModal}
                    close={() => dispatch(handleForgotPassModal(false))}
                    size={'medium'}
                >
                    <ForgotPassword />
                </Modal>
            )}
        </>
    );
}

export default Home;
