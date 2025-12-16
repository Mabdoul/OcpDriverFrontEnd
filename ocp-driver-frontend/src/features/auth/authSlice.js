import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Placeholder async API calls - replace with real HTTP requests later
const mockApiLogin = async (payload) => {
  // simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // simple fake validation
  if (payload.email === 'error@example.com') {
    const error = new Error('Invalid credentials')
    error.status = 401
    throw error
  }

  return {
    token: 'fake-jwt-token',
    user: {
      name: 'Demo User',
      email: payload.email,
    },
    message: 'Login successful',
  }
}

const mockApiRegister = async (payload) => {
  await new Promise((resolve) => setTimeout(resolve, 800))

  if (payload.email === 'exists@example.com') {
    const error = new Error('Email already in use')
    error.status = 409
    throw error
  }

  return {
    token: 'fake-jwt-token',
    user: {
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
    },
    message: 'Registration successful',
  }
}

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await mockApiLogin(credentials)
      return response
    } catch (err) {
      return rejectWithValue(err.message || 'Login failed')
    }
  },
)

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (data, { rejectWithValue }) => {
    try {
      const response = await mockApiRegister(data)
      return response
    } catch (err) {
      return rejectWithValue(err.message || 'Registration failed')
    }
  },
)

const initialToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: initialToken,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    logout(state) {
      state.user = null
      state.token = null
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
      }
    },
    clearStatus(state) {
      state.error = null
      state.successMessage = null
    },
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
        state.successMessage = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.successMessage = action.payload.message
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', action.payload.token)
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Login failed'
      })
      // register
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
        state.successMessage = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.successMessage = action.payload.message
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', action.payload.token)
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Registration failed'
      })
  },
})

export const { logout, clearStatus } = authSlice.actions

export default authSlice.reducer


