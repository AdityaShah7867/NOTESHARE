import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { transferCoins, getTransferCoinsHistory, getTransfercoinsUser, lottery } from './coinsActions'

const initialState = {
    coins: [],
    loading: false,
    error: "",
    success: false,
    coin: null,
    coinLoading: false,
    coinError: "",
    coinSuccess: false,

}

export const coinSlice = createSlice({
    name: 'coin',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        //transfer coins
        builder.addCase(transferCoins.pending, (state, action) => {
            state.loading = true
        }).addCase(transferCoins.fulfilled, (state, action) => {
            state.loading = false
            state.success = true
            state.coins = action.payload.data
        }).addCase(transferCoins.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
        })

        //get all transfer coins history
        builder.addCase(getTransferCoinsHistory.pending, (state, action) => {
            state.loading = true
        }).addCase(getTransferCoinsHistory.fulfilled, (state, action) => {
            state.loading = false
            state.success = true
            state.coins = action.payload.data
        }).addCase(getTransferCoinsHistory.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
        })

        //get transfer coins user
        builder.addCase(getTransfercoinsUser.pending, (state, action) => {
            state.loading = true
        }).addCase(getTransfercoinsUser.fulfilled, (state, action) => {
            state.loading = false
            state.success = true
            state.coins = action.payload.data
        }).addCase(getTransfercoinsUser.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
        })

        //lottery extrareducer
        builder.addCase(lottery.pending, (state, action) => {
            state.loading = true
        }).addCase(lottery.fulfilled, (state, action) => {
            state.loading = false
            state.success = true
            state.coins = action.payload.data
        }).addCase(lottery.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
        })

    }
})


export default coinSlice.reducer



