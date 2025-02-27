// virtualPatientSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isModalOpen: true
};

const virtualPatientSlice = createSlice({
    name: 'virtualPatient',
    initialState,
    reducers: {
        openModal: (state) => {
            state.isModalOpen = true;
        },
        closeModal: (state) => {
            state.isModalOpen = false;
        },
        toggleModal: (state) => {
            state.isModalOpen = !state.isModalOpen;
        }
    }
});

export const { openModal, closeModal, toggleModal } = virtualPatientSlice.actions;
export default virtualPatientSlice.reducer;