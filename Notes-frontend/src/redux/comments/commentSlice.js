import { createSlice } from "@reduxjs/toolkit";
import { createComment, getCommentsByNoteId } from "./commentActions";

const initialState = {
    comments: [],
    loading: false,
    error: "",
};

export const commentSlice = createSlice({

    name: 'comment',
    initialState,
    reducers: {

    },

    extraReducers: (builder) => {
        builder.addCase(createComment.pending, (state, action) => {
            state.loading = true
        }
        ).addCase(createComment.fulfilled, (state, action) => {
            state.loading = false
            state.comments = action.payload
        }
        ).addCase(createComment.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
        }
        )
        builder.addCase(getCommentsByNoteId.pending, (state, action) => {
            state.loading = true
        }
        ).addCase(getCommentsByNoteId.fulfilled, (state, action) => {
            state.loading = false
            state.comments = action.payload.comments
        }
        ).addCase(getCommentsByNoteId.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
        }
        )
    }

})


export default commentSlice.reducer
