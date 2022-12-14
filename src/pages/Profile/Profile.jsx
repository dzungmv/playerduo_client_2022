import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames/bind';

import userApi from '@/api/userApi';
import donateApi from '@/api/donateApi';
import ratingApi from '@/api/ratingApi';

import {
    setProfile,
    setDonate,
    setRatings,
} from '@/_redux/features/player/playerSlice';

import styles from './Profile.module.scss';
import Header from './Header';
import BodyContent from './Body';
import { DynamicTitle } from '@/layouts/DefaultLayout/DynamicTitle/DynamicTitle';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);

function Profile() {
    let { id } = useParams();
    const dispatch = useDispatch();

    //set title dynamic

    const store = {
        player: useSelector((state) => state?.player?.profile),
    };

    const [title, setTitle] = useState(
        store?.player?.nickname ? store?.player?.nickname : 'Player Profile'
    );

    // const isUserInStore = store.player.filter(
    //     (user) => user.urlCode === urlCode
    // );

    DynamicTitle(title);

    useEffect(() => {
        setTitle(store?.player?.nickname);
    }, [store.player.nickname]);

    useEffect(() => {
        if (store?.player?.id !== id) {
            const getProfile = async () => {
                try {
                    const { data } = await userApi.get(`v1/user/id/${id}`);
                    dispatch(setProfile(data?.data?.user));
                } catch (err) {
                    toast.error(
                        err?.response?.data?.error || 'Something went wrong'
                    );
                }
            };

            const getTopDonator = async () => {
                const { data } = await donateApi.get(`v1/player/${id}/donate`);

                dispatch(setDonate(data?.data?.donate));
            };

            const getRatingList = async () => {
                const { data } = await ratingApi.get(`v1/player/${id}/rating`);
                dispatch(setRatings(data?.data?.rating));
            };

            getProfile();
            getTopDonator();
            getRatingList();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    return (
        <div className={cx('wrapper')}>
            <Header />
            <BodyContent />
        </div>
    );
}

export default Profile;
