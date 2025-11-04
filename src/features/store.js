import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import bankReducer from "./ARTbank/bankSlice";

 export const store = configureStore(
    {
        reducer:{
            auth:authReducer,
            artBank:bankReducer,
        }
    })
