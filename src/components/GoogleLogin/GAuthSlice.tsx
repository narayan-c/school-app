import { createSlice } from '@reduxjs/toolkit'

export const gauthslice = createSlice({
    name: 'gauth',
    initialState: {
        isLoggedIn: false,
        name: '',
        email: '',
        accessToken: '',
        scope: '',
        expires_in: 0,
    },
    reducers: {
        login: (state, action) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.isLoggedIn = true;
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.accessToken = action.payload.token;
            state.scope = action.payload.scope;
            state.expires_in = action.payload.expires_in;
        },
        logout: state => {
            state.isLoggedIn = false;
            state.name = '';
            state.email = '';
        }
    }
})

export const { login, logout } = gauthslice.actions

export default gauthslice.reducer