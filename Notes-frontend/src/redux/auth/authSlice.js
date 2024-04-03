import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-toastify'
import { initialCall, register, login, resetPassword, getLogedinUser, sendResetPasswordEmail } from './authActions'


const initialState = {
    user: null,
    profileUser: null,
    isAuthenticated: false,
    loading: false,
    error: "",
    success: false,
    token: "",
    initialCallLoading: false,
    sendResetOtpLoading: false

}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(register.pending, (state, action) => {
            state.loading = true

        }).addCase(register.fulfilled, (state, action) => {
            state.loading = false
            state.success = true
            // state.user = action.payload  
            // This is not needed because we are not storing the user in the state. We are redirecting to the login page after registration. Since the login page checks if the user exists in the state, but the user is not verified yet, we are not storing the user in the state.
        }).addCase(register.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
        })
        builder.addCase(login.pending, (state, action) => {
            state.loading = true
        }
        ).addCase(login.fulfilled, (state, action) => {
            state.loading = false
            state.success = true
            state.user = action.payload
        }).addCase(login.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
        }
        )

        //reset password
        builder.addCase(resetPassword.pending, (state, action) => {
            state.loading = true
            state.sendResetOtpLoading = true
        }
        ).addCase(resetPassword.fulfilled, (state, action) => {
            state.loading = false
            state.success = true
            state.sendResetOtpLoading = false
            toast.success(action.payload.message)
        }
        ).addCase(resetPassword.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
            state.sendResetOtpLoading = false
            toast.error(action.payload)
        }
        )

        //get logedin user
        builder.addCase(getLogedinUser.pending, (state, action) => {
            state.loading = true
        }
        ).addCase(getLogedinUser.fulfilled, (state, action) => {
            state.loading = false
            state.success = true
            state.user = action.payload
            state.isAuthenticated = true
        }
        ).addCase(getLogedinUser.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
        }
        )

        //initialcall
        builder.addCase(initialCall.pending, (state, action) => {
            state.initialCallLoading = true
        }
        ).addCase(initialCall.fulfilled, (state, action) => {
            state.initialCallLoading = false
            state.success = true

        }
        ).addCase(initialCall.rejected, (state, action) => {
            state.initialCallLoading = false
            state.error = action.payload
        }
        )

        //send reset otp
        builder.addCase(sendResetPasswordEmail.pending, (state, action) => {
            state.loading = true
            state.sendResetOtpLoading = true
        }
        ).addCase(sendResetPasswordEmail.fulfilled, (state, action) => {
            state.loading = false
            state.success = true
            state.sendResetOtp = true
            state.sendResetOtpLoading = false

        }
        ).addCase(sendResetPasswordEmail.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
            state.sendResetOtpLoading = false

        }
        )

    }
})


export default authSlice.reducer