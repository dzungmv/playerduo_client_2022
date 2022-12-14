import { createSlice } from '@reduxjs/toolkit';

const modalSlice = createSlice({
    name: 'modal',
    initialState: {
        modalType: {
            modalWithdraw: false,
            modalEditProfile: false,
            modalLogin: false,
            modalRegister: false,
            modalListFollowing: false,
            rentModal: false,
            loginRequiredModal: false,
            postModal: false,
            changePassModal: false,
            forgotPassModal: false,
            topupModal: false,
            donateModal: false,
            donateHistoryModal: false,
            acceptRentModal: false,
            acceptRentModalData: '',
            contractManagementModal: false,
            usersDonationModal: false,
        },
    },
    reducers: {
        handleModalWithdraw: (state, action) => {
            state.modalType.modalWithdraw = action.payload;
        },
        handleModalEditProfile: (state, action) => {
            state.modalType.modalEditProfile = action.payload;
        },
        handleModalLogin: (state, action) => {
            state.modalType.modalLogin = action.payload;
        },
        handleModalRegister: (state, action) => {
            state.modalType.modalRegister = action.payload;
        },
        handleModalListFollowing: (state, action) => {
            state.modalType.modalListFollowing = action.payload;
        },
        handleRentModal: (state, action) => {
            state.modalType.rentModal = action.payload;
        },
        handleLoginRequiredModal: (state, action) => {
            state.modalType.loginRequiredModal = action.payload;
        },
        handlePostModal: (state, action) => {
            state.modalType.postModal = action.payload;
        },
        handleChangePassModal: (state, action) => {
            state.modalType.changePassModal = action.payload;
        },
        handleForgotPassModal: (state, action) => {
            state.modalType.forgotPassModal = action.payload;
        },
        handleTopupModal: (state, action) => {
            state.modalType.topupModal = action.payload;
        },
        handleDonateModal: (state, action) => {
            state.modalType.donateModal = action.payload;
        },
        handleDonateHistoryModal: (state, action) => {
            state.modalType.donateHistoryModal = action.payload;
        },
        handleAcceptRentModal: (state, action) => {
            state.modalType.acceptRentModal = action.payload;
        },
        handleAcceptRentModalData: (state, action) => {
            state.modalType.acceptRentModalData = action.payload;
        },
        handleContractManagementModal: (state, action) => {
            state.modalType.contractManagementModal = action.payload;
        },
        handleUsersDonationModal: (state, action) => {
            state.modalType.usersDonationModal = action.payload;
        },
    },
});

export const {
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
    handleAcceptRentModal,
    handleAcceptRentModalData,
    handleContractManagementModal,
    handleUsersDonationModal,
} = modalSlice.actions;

export default modalSlice.reducer;
