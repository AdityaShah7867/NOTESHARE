
import { createSlice } from "@reduxjs/toolkit";

import { likeUnlikeNote } from './likeActions'

const initialState = {
    likes: [],
    loading: false,
    error: "",
};


export const likeSlice = createSlice({

    name: 'like',
    initialState,
    reducers: {

    },

    extraReducers: (builder) => {
        builder.addCase(likeUnlikeNote.pending, (state, action) => {
            state.loading = true
        }
        ).addCase(likeUnlikeNote.fulfilled, (state, action) => {
            state.loading = false
            state.likes = action.payload.likes
        }
        ).addCase(likeUnlikeNote.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
        }
        )
    }

})


export default likeSlice.reducer;
