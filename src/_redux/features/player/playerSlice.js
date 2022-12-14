import { createSlice } from '@reduxjs/toolkit';

const playerSlice = createSlice({
    name: 'player',
    initialState: {
        playersPro: [],
        profile: {},
        donate: [],
        ratings: [],
    },
    reducers: {
        setPlayersPro: (state, action) => {
            state.playersPro = action.payload;
        },

        updatePlayerPro: (state, action) => {
            state.playersPro = action.payload;
        },
        setProfile: (state, action) => {
            state.profile = action.payload;
        },
        updateProfile: (state, action) => {
            state.profile = action.payload;
        },
        updateFollowers: (state, action) => {
            state.profile.player.follower = action.payload;
        },
        setDonate: (state, action) => {
            state.donate = action.payload;
        },
        setRatings: (state, action) => {
            state.ratings = action.payload;
        },
        resetProfile: (state) => {
            state.profile = {};
            state.donate = [];
            state.ratings = [];
        },
    },
});

export const {
    setPlayersPro,
    setProfile,
    updatePlayerPro,
    updateProfile,
    updateFollowers,
    setDonate,
    setRatings,
    resetProfile,
} = playerSlice.actions;
export default playerSlice.reducer;
