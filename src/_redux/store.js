import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';

import modalSlice from './features/modal/modalSlice';
import previewerSlice from './features/previewer/previewerSlice';
import gamesSlice from './features/games/gamesSlice';
import userSlice from './features/user/userSlice';
import playerSlice from './features/player/playerSlice';

const reducers = combineReducers({
    user: userSlice,
    player: playerSlice,
    modal: modalSlice,
    previewer: previewerSlice,
    games: gamesSlice,
});

const persistConfig = {
    key: 'root',
    storage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware({
        serializableCheck: false,
    }),
});

export default store;
