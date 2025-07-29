import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userdata: null,
    otherusers: null,
    selecteduser: null,
    socket: null,
    onlineuser: null,
    searchdata: null,
  },
  reducers: {
    setuserdata: (state, action) => {
      state.userdata = action.payload;
    },
    setotheruserdata: (state, action) => {
      state.otherusers = action.payload;
    },
    setselecteduser: (state, action) => {
      state.selecteduser = action.payload;
    },
    setsocket: (state, action) => {
      state.socket = action.payload;
    },
    setonlineuser: (state, action) => {
      state.onlineuser = action.payload;
    },
    setsearchdata: (state, action) => {
      state.searchdata = action.payload;
    },
  },
});

export const {
  setuserdata,
  setotheruserdata,
  setselecteduser,
  setsocket,
  setonlineuser,
  setsearchdata,
} = userSlice.actions;
export default userSlice.reducer;
