import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createTodo, getTodos, getTodosByUserId, updateTodo, deleteTodo } from './todoActions'

const initialState = {
    todos: [],
    allTodos: [],
    todoLoading: false,
    error: "",
    success: false,

}

export const todoSlice = createSlice({
    name: 'todo',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(createTodo.pending, (state, action) => {
            state.todoLoading = true;
        }).addCase(createTodo.fulfilled, (state, action) => {
            state.todoLoading = false;
            state.todos = action.payload
            state.success = true
        }).addCase(createTodo.rejected, (state, action) => {
            state.todoLoading = false;
            state.error = action.payload
        })

        builder.addCase(getTodos.pending, (state, action) => {
            state.todoLoading = true;
        }
        ).addCase(getTodos.fulfilled, (state, action) => {
            state.todoLoading = false;
            state.allTodos = action.payload
        }
        ).addCase(getTodos.rejected, (state, action) => {
            state.todoLoading = false;
            state.error = action.payload
        }
        )

        builder.addCase(getTodosByUserId.pending, (state, action) => {
            state.todoLoading = true;
        }
        ).addCase(getTodosByUserId.fulfilled, (state, action) => {
            state.todoLoading = false;
            state.todos = action.payload.todos
        }
        ).addCase(getTodosByUserId.rejected, (state, action) => {
            state.todoLoading = false;
            state.error = action.payload
        }
        )

        builder.addCase(updateTodo.pending, (state, action) => {
            state.todoLoading = true;
        }
        ).addCase(updateTodo.fulfilled, (state, action) => {
            state.todoLoading = false;
            state.todos = action.payload
        }
        ).addCase(updateTodo.rejected, (state, action) => {
            state.todoLoading = false;
            state.error = action.payload
        }
        )

        builder.addCase(deleteTodo.pending, (state, action) => {
            state.todoLoading = true;
        }
        ).addCase(deleteTodo.fulfilled, (state, action) => {
            state.todoLoading = false;
            state.todos = action.payload
        }
        ).addCase(deleteTodo.rejected, (state, action) => {
            state.todoLoading = false;
            state.error = action.payload
        }
        )


    }

})


export default todoSlice.reducer