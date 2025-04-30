import {configureStore} from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import UserReducer from '../features/userSlice';

const store = configureStore({
    reducer:{
        auth:authReducer,
        users:UserReducer,
    }
})

export default store;