import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
const API_URL = import.meta.env.VITE_API_URL;

const storedUser = JSON.parse(localStorage.getItem("user"));
const storedAuth = JSON.parse(localStorage.getItem("isAuthenticated"));

const initialState = {
  user: storedUser || null,
  isAuthenticated: storedAuth || false,
  isLoading: true,
};

export const registerUser = createAsyncThunk("auth/register", async (formData) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/register`,formData,{ withCredentials: true });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const loginUser = createAsyncThunk("auth/login", async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/login`,formData,{ withCredentials: true });
    localStorage.setItem("token", response.data.token);
    return response.data;
  } catch (error) {
    toast.error('Login Failed Invalid Credential')
    console.log(error);  }
});

export const fetchUserDetails = createAsyncThunk("auth/fetchUser", async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/api/auth/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
});

export const updateUser = createAsyncThunk("auth/updateUser", async (userData, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");

    const formData = new FormData();
    Object.keys(userData).forEach((key) => formData.append(key, userData[key]));

    const response = await axios.put(`${API_URL}/api/profile/update`, formData, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });

    localStorage.setItem("user", JSON.stringify(response.data.user));

    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const logoutUser = createAsyncThunk("/auth/logout", async () => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/logout`,{},{ withCredentials: true });
    return response.data;
  } catch (error) {
    console.log(error);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })

      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
      
        const user = action.payload?.user || null;
        const success = action.payload?.success || false;
      
        state.user = success ? user : null;
        state.isAuthenticated = success;
      
        if (success) {
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("isAuthenticated", JSON.stringify(true));
        } else {
          localStorage.removeItem("user");
          localStorage.setItem("isAuthenticated", JSON.stringify(false));
        }
      })
      
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("isAuthenticated");
      });
  },
});

// export const {loginSuccess,logout} = authSlice.actions;
export default authSlice.reducer;
