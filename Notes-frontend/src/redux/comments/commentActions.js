import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const host = process.env.REACT_APP_API_HOST;
const authToken = localStorage.getItem('authtoken');

export const createComment = createAsyncThunk(
    'comment/createComment',
    async ({
        comment,
        noteId
    }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${host}/api/v1/comments/createComment/${noteId}`,
                {
                    comment: comment,
                },
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,

                    },
                }
            );
            if (response.status === 200) {
                toast.success(response.data.message);
                return response.data.comment;
            } else {
                toast.error(response.data.message);
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message);
            return rejectWithValue(error.response?.data?.message);
        }
    }
)


export const getCommentsByNoteId = createAsyncThunk(
    'comment/getCommentsByNoteId',
    async (noteId, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${host}/api/v1/comments/getCommentsByNoteId/${noteId}`,
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                }
            );
            if (response.status === 200) {
                return response.data;
            } else {
                toast.error(response.data.message);
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message);
            return rejectWithValue(error.response?.data?.message);
        }
    }
)




