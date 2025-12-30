import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/api/profile/users`, {
        headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    return response.data.users;
  } catch (error) {
    throw Error(error.response?.data?.message || "Failed to fetch users");
  }
});

export const updateUsers = createAsyncThunk("users/updateUser", async ({ id, formData }, { rejectWithValue }) => {
  try {
      const token = localStorage.getItem("token");
  
      if (!token) {
        return rejectWithValue("No token found. Please log in.");
      }

      const response = await axios.put(`${API_URL}/api/user/update/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to update user");
    }
});

export const deleteUser = createAsyncThunk("users/deleteUser", async (id, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    await axios.delete(`${API_URL}/api/user/delete/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "Failed to delete user");
  }
});

export const createUsers = createAsyncThunk("users/createUser", async ({ formData }, { rejectWithValue }) => {
try {
    const token = localStorage.getItem("token");

    if (!token) {
      return rejectWithValue("No token found. Please log in.");
    }

    const response = await axios.post(`${API_URL}/api/user/create`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.user;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "Failed to update user");
  }
});

const userSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(updateUsers.fulfilled, (state, action) => {
        state.users = state.users.map((user) =>
          user._id === action.payload._id ? action.payload : user
        )
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user._id !== action.payload);
      })
      .addCase(createUsers.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
  },
});

export default userSlice.reducer;
