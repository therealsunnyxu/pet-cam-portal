import { configureStore } from "@reduxjs/toolkit";
import csrfTokenReducer from "./slices/csrfTokenReducer";

export const reduxStore = configureStore({
    reducer: {
        csrfToken: csrfTokenReducer
    }
});
