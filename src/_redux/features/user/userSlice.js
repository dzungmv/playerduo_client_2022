import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: {
            id: '',
            information: {},
            following: {},
            follower: {},
            topup: [],
            withdraw: [],
            usersDonation: [],
            playerContract: [],
            isTopupData: false,
            isWithdrawData: false,
            isLogin: false,
        },
    },
    reducers: {
        login: (state, action) => {
            state.user.id = action.payload;
            state.user.isLogin = true;
        },

        setUserInformation: (state, action) => {
            state.user.information = action.payload;
        },

        setFollowing: (state, action) => {
            state.user.following = action.payload;
        },
        setFollowers: (state, action) => {
            state.user.follower = action.payload;
        },
        updateGame: (state, action) => {
            state.user.information.get_game = action.payload;
        },
        updateFollowing: (state, action) => {
            state.user.following.followingData = action.payload;
        },

        updateContract: (state, action) => {
            state.user.information.contract = action.payload;
        },
        updatePost: (state, action) => {
            state.user.information.post = action.payload;
        },
        updateBalance: (state, action) => {
            state.user.information.balance = action.payload;
        },
        updateDonateHistory: (state, action) => {
            state.user.information.donate_history = action.payload;
        },
        setTopup: (state, action) => {
            state.user.topup = action.payload;
        },
        setWithdraw: (state, action) => {
            state.user.withdraw = action.payload;
        },
        setIsTopupData: (state, action) => {
            state.user.isTopupData = action.payload;
        },
        setIsWithdrawData: (state, action) => {
            state.user.isWithdrawData = action.payload;
        },

        setRemovePost: (state, action) => {
            state.user.information.post = action.payload;
        },
        setPlayerContract: (state, action) => {
            state.user.playerContract = action.payload;
        },
        setUsersDonation: (state, action) => {
            state.user.usersDonation = action.payload;
        },
        logout: (state) => {
            state.user.id = '';
            state.user.information = {};
            state.user.following = {};
            state.user.follower = {};
            state.user.isLogin = false;
            state.user.topup = [];
            state.user.withdraw = [];
            state.user.playerContract = [];
            state.user.usersDonation = [];
            state.user.isTopupData = false;
            state.user.isWithdrawData = false;
        },
    },
});

export const {
    login,
    setUserInformation,
    logout,
    setFollowing,
    updateFollowing,
    updateContract,
    updateGame,
    updatePost,
    updateBalance,
    updateDonateHistory,
    setTopup,
    setWithdraw,
    setIsTopupData,
    setIsWithdrawData,
    setRemovePost,
    setPlayerContract,
    setUsersDonation,
    setFollowers,
} = userSlice.actions;
export default userSlice.reducer;
