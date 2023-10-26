import { configureStore } from '@reduxjs/toolkit'
import gauthReducer from '../components/GoogleLogin/GAuthSlice'

export default configureStore({
    reducer: {
        gauth: gauthReducer,
    }
})