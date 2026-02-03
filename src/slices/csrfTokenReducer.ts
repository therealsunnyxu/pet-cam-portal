import { createSlice } from "@reduxjs/toolkit";

const csrfTokenSlice = createSlice({
    name: "csrfToken",
    initialState: {
        value: ""
    },
    reducers: {
        setCSRFToken: (state, action) => {
            state.value = action.payload;
        }
    }
});

export const {setCSRFToken} = csrfTokenSlice.actions;
export default csrfTokenSlice.reducer;