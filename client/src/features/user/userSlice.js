import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api, { AUTH_TOKEN_KEY } from "../../api/axios.js";
import toast from "react-hot-toast";

const initialState = {
  value: null,
  loading: true,
};

export const fetchUser = createAsyncThunk("user/fetchUser", async () => {
  const { data } = await api.get("/api/auth/me");
  return data.success ? data.user : null;
});

export const loginUser = createAsyncThunk("user/login", async (payload) => {
  const { data } = await api.post("/api/auth/login", payload);
  if (!data.success) throw new Error(data.message);
  if (data.token) localStorage.setItem(AUTH_TOKEN_KEY, data.token);
  return data.user;
});

export const registerUser = createAsyncThunk("user/register", async (payload) => {
  const { data } = await api.post("/api/auth/register", payload);
  if (!data.success) throw new Error(data.message);
  if (data.token) localStorage.setItem(AUTH_TOKEN_KEY, data.token);
  return data.user;
});

export const logoutUser = createAsyncThunk("user/logout", async () => {
  const { data } = await api.post("/api/auth/logout");
  if (!data.success) throw new Error(data.message);
  localStorage.removeItem(AUTH_TOKEN_KEY);
  return null;
});

export const updateUser = createAsyncThunk("user/update", async (userData) => {
  const { data } = await api.post("/api/user/update", userData);
  if (!data.success) throw new Error(data.message);
  toast.success(data.message);
  return data.user;
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.value = action.payload;
        state.loading = false;
        if (!action.payload) localStorage.removeItem(AUTH_TOKEN_KEY);
      })
      .addCase(fetchUser.rejected, (state) => {
        state.value = null;
        state.loading = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.value = action.payload;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.value = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.value = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.value = action.payload;
      });
  },
});

export default userSlice.reducer;
