import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    messages: [],
  },
  reducers: {
    setmessages: (state, action) => {
      state.messages = action.payload;
    },
  },
});

export const { setmessages } = messageSlice.actions;
export default messageSlice.reducer;
