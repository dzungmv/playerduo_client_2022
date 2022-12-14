import { createSlice } from '@reduxjs/toolkit';

const gamesSlice = createSlice({
    name: 'games',
    initialState: {
        games: [],
    },
    reducers: {
        setGames: (state, action) => {
            state.games = action.payload;
        },
    },
});

export const { setGames } = gamesSlice.actions;

export default gamesSlice.reducer;
