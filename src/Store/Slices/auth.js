import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { setMessage } from "./message";
import AuthService from "../Services/auth.service";

const user = JSON.parse(localStorage.getItem("userData"));

export const login = createAsyncThunk(
  "auth/login",
  async ({ name, password }, thunkAPI) => {
    try {
      const data = await AuthService.login(name, password);
      const message =
        (data.response && data.response.data && data.response.data.msg) ||
        data.msg ||
        data.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.fulfillWithValue({ user: data });
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue();
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  await AuthService.logout();
});

const initialState = user
  ? { isLoggedIn: true, user }
  : { isLoggedIn: false, user: null };

const authSlice = createSlice({
  name: "auth",
  initialState,
  extraReducers: {
    [login.fulfilled]: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload.user;
    },
    [login.rejected]: (state, action) => {
      state.isLoggedIn = false;
      state.user = null;
    },
    [logout.fulfilled]: (state, action) => {
      state.isLoggedIn = false;
      state.user = null;
    },
  },
});

const { reducer } = authSlice;
export default reducer;
