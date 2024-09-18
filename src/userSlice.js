import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await fetch('https://reqres.in/api/users?page=2');
  const data = await response.json();
  return data.data.map(user => ({
    id: user.id,
    name: `${user.first_name} ${user.last_name}`,
    job: user.job || 'Not Provided', 
    createdAt: user.createdAt || new Date().toISOString(), // Default createdAt to current date if not provided
  }));
});

export const addUser = createAsyncThunk('users/addUser', async (userData) => {
  const response = await fetch('https://reqres.in/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  
  const data = await response.json();
  return {
    ...data,
    createdAt: new Date().toISOString(),
  };
});

const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {
    updateUser: (state, action) => {
      const index = state.users.findIndex((user) => user.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      } else {
        state.users.push(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      });
  },
});

export const { updateUser } = userSlice.actions;
export default userSlice.reducer;
