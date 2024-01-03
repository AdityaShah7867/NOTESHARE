import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import logger from 'redux-logger'
import { authSlice } from './redux/auth/authSlice'
import { noteSlice } from './redux/notes/noteSlice';
import { coinSlice } from './redux/coins/coinSlice';
import { todoSlice } from './redux/todo/todoSlice';
import { commentSlice } from './redux/comments/commentSlice'
import { likeSlice } from './redux/likes/likeSlice';
import { userSlice } from './redux/user/userSlice';
import { impDateSlice } from './redux/impDates/impDateSlice';



const middleware = [...getDefaultMiddleware(), logger];
const store = configureStore({
    reducer: {
        user: authSlice.reducer,
        note: noteSlice.reducer,
        coin: coinSlice.reducer,
        todo: todoSlice.reducer,
        comment: commentSlice.reducer,
        like: likeSlice.reducer,
        userDetails: userSlice.reducer,
        impDate: impDateSlice.reducer
    },

})

export default store

