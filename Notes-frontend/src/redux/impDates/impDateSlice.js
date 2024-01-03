import { createSlice } from "@reduxjs/toolkit";
import { fetchImpDates, createImpDate } from './impDateActions'


const initialState = {
    impDates: [],
    impDateLoading: false,
    error: null,
};


export const impDateSlice = createSlice({
    name: "impDates",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(fetchImpDates.pending, (state) => {
            state.impDateLoading = true;
        });
        builder.addCase(fetchImpDates.fulfilled, (state, action) => {
            state.impDateLoading = false;
            state.impDates = action.payload.impDates;
            state.error = null;
        });
        builder.addCase(fetchImpDates.rejected, (state, action) => {
            state.impDateLoading = false;
            state.error = action.payload;
        });
        builder.addCase(createImpDate.pending, (state) => {
            state.impDateLoading = true;
        });
        builder.addCase(createImpDate.fulfilled, (state, action) => {
            state.impDateLoading = false;
            state.impDates.push(action.payload.impDate);
            state.error = null;
        });
        builder.addCase(createImpDate.rejected, (state, action) => {
            state.impDateLoading = false;
            state.error = action.payload;
        });
    },
});

export default impDateSlice.reducer;