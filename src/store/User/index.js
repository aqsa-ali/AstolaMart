import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loading: false,
};

const apiSlice = createSlice({
    name: 'User',
    initialState,
    reducers: {
        updateLoading: (state, action) => {
            state.loading = action.payload;
        },
        clearStore: (state) => {
            return initialState;
        }
    },
});
export const {
    updateLoading,
    clearStore,
} = apiSlice.actions;
export default apiSlice.reducer;
