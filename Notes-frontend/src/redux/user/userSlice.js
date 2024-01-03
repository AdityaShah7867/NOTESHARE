import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios';

import { lottery, removeSkills, seachUser, getUserInfo, getUsersLeaderBoard, getUserProfile, editProfile, getUserSkills, addSkills } from './userActions'

const initialState = {
    userDetails: {},
    leaderBoard: [],
    searchedUser: [],
    userDetailsLoading: false,
    error: '',
    userProfile: {},
    skills: []

}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearUserDetails: (state) => {
            state.userDetails = {}
        },

        addSkills: (state, payload) => {
            state.skills = payload.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getUserInfo.pending, (state, action) => {
            state.userDetailsLoading = true;
        })
        builder.addCase(getUserInfo.fulfilled, (state, action) => {
            state.userDetailsLoading = false;
            state.userDetails = action.payload.userDetails;
        })
        builder.addCase(getUserInfo.rejected, (state, action) => {
            state.userDetailsLoading = false;
            state.error = action.payload;
        })

        builder.addCase(getUsersLeaderBoard.pending, (state, action) => {
            state.userDetailsLoading = true;
        })

        builder.addCase(getUsersLeaderBoard.fulfilled, (state, action) => {
            state.userDetailsLoading = false;
            state.leaderBoard = action.payload;
        })

        builder.addCase(getUsersLeaderBoard.rejected, (state, action) => {
            state.userDetailsLoading = false;
            state.error = action.payload;
        })

        builder.addCase(getUserProfile.pending, (state, action) => {
            state.userDetailsLoading = true;
        })

        builder.addCase(getUserProfile.fulfilled, (state, action) => {
            state.userDetailsLoading = false;
            state.userProfile = action.payload.user;
        })

        builder.addCase(getUserProfile.rejected, (state, action) => {
            state.userDetailsLoading = false;
            state.error = action.payload;
        })


        //edit profile redux 
        builder.addCase(editProfile.pending, (state, action) => {
            state.userDetailsLoading = true;
        })

        builder.addCase(editProfile.fulfilled, (state, action) => {
            state.userDetailsLoading = false;
            state.userDetails = action.payload;
        })

        builder.addCase(editProfile.rejected, (state, action) => {
            state.userDetailsLoading = false;
            state.error = action.payload;
        })


        //search user
        builder.addCase(seachUser.pending, (state, action) => {
            state.userDetailsLoading = true;
        })

        builder.addCase(seachUser.fulfilled, (state, action) => {
            state.userDetailsLoading = false;
            state.searchedUser = action.payload.user;
        })

        builder.addCase(seachUser.rejected, (state, action) => {
            state.userDetailsLoading = false;
            state.error = action.payload;
        })


        //lottery
        builder.addCase(lottery.pending, (state, action) => {
            state.userDetailsLoading = true;
        })


        builder.addCase(lottery.fulfilled, (state, action) => {
            state.userDetailsLoading = false;
        })

        builder.addCase(lottery.rejected, (state, action) => {
            state.userDetailsLoading = false;
            state.error = action.payload;
        })



        //get user skills

        builder.addCase(getUserSkills.pending, (state, action) => {
            state.userDetailsLoading = true;
        })


        builder.addCase(getUserSkills.fulfilled, (state, action) => {
            state.userDetailsLoading = false;
            state.skills = action.payload.skills;
        })

        builder.addCase(getUserSkills.rejected, (state, action) => {
            state.userDetailsLoading = false;
            state.error = action.payload;
        })


        //add skills

        builder.addCase(addSkills.pending, (state, action) => {
            state.userDetailsLoading = true;
        })


        builder.addCase(addSkills.fulfilled, (state, action) => {
            state.userDetailsLoading = false;
            console.log(action.payload)
            state.skills = action.payload.skills;
        })

        builder.addCase(addSkills.rejected, (state, action) => {
            state.userDetailsLoading = false;
            state.error = action.payload;
        })

        //remove skills

        builder.addCase(removeSkills.pending, (state, action) => {
            state.userDetailsLoading = true;
        })


        builder.addCase(removeSkills.fulfilled, (state, action) => {
            state.userDetailsLoading = false;
            state.skills = action.payload.skills;
        })

        builder.addCase(removeSkills.rejected, (state, action) => {
            state.userDetailsLoading = false;
            state.error = action.payload;
        })



    }
})




