import { createSlice } from '@reduxjs/toolkit';

const previewerSlice = createSlice({
    name: 'previewer',
    initialState: {
        previewer: {
            clickedImg: null,
            currentIndex: null,
        },
    },

    reducers: {
        setClickedImg: (state, action) => {
            state.previewer.clickedImg = action.payload;
        },
        setCurrentIndex: (state, action) => {
            state.previewer.currentIndex = action.payload;
        },
    },
});

export const { setClickedImg, setCurrentIndex } = previewerSlice.actions;

export default previewerSlice.reducer;
