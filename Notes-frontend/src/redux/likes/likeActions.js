import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const authToken = localStorage.getItem('authtoken');
const host = process.env.REACT_APP_API_HOST;

export const likeUnlikeNote = createAsyncThunk(
    'like/likeUnlikePost',
    async (noteId, { rejectWithValue, dispatch }) => {
        try {
            const response = await axios.post(`${host}/api/v1/likes/likeUnlikeNote/${noteId}`, null, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (response.status === 200) {
                console.log(response.data);
                return response.data;
            } else {
                console.log('error');
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);
