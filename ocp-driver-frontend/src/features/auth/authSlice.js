import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const API_URL = 'http://127.0.0.1:8000/api'

// ================= LOGIN =================
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password, role }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/${role}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const text = await res.text()
      const data = text ? JSON.parse(text) : {}

      if (!res.ok) {
        return rejectWithValue(data.error || data.message || 'Login failed')
      }

      return { ...data, role }
    } catch (err) {
      return rejectWithValue('Failed to fetch')
    }
  }
)

// ================= REGISTER =================
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ name, email, password, phone, role }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/${role}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ name, email, password, phone }),
      })

      const text = await res.text()
      const data = text ? JSON.parse(text) : {}

      if (!res.ok) {
        return rejectWithValue(
          data.error || data.message || 'Registration failed'
        )
      }

      return { ...data, role }
    } catch (err) {
      return rejectWithValue('Failed to fetch')
    }
  }
)

// ================= INITIAL STATE =================
const initialToken =
  typeof window !== 'undefined' ? localStorage.getItem('token') : null

const initialRole =
  typeof window !== 'undefined' ? localStorage.getItem('role') : null

const initialUser =
  typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('user'))
    : null

// ================= SLICE =================
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: initialUser,
    token: initialToken,
    role: initialRole,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    logout(state) {
      state.user = null
      state.token = null
      state.role = null
      state.error = null
      state.successMessage = null

      localStorage.removeItem('token')
      localStorage.removeItem('role')
      localStorage.removeItem('user')
    },
    clearStatus(state) {
      state.error = null
      state.successMessage = null
    },
  },
  extraReducers: (builder) => {
    builder
      // ================= LOGIN =================
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
        state.successMessage = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false

        state.user =
          action.payload.user ||
          action.payload.client ||
          action.payload.chauffeur

        state.token = action.payload.token
        state.role = action.payload.role

        state.successMessage =
          action.payload.message ||
          `Connexion réussie (${
            action.payload.role === 'chauffeur' ? 'Chauffeur' : 'Client'
          })`

        // ✅ persistence
        localStorage.setItem('token', action.payload.token)
        localStorage.setItem('role', action.payload.role)
        localStorage.setItem('user', JSON.stringify(state.user))
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // ================= REGISTER =================
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
        state.successMessage = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false

        state.user = null
        state.token = null
        state.role = null

        state.successMessage =
          action.payload.message ||
          'Compte créé avec succès. Veuillez vous connecter.'

        localStorage.removeItem('token')
        localStorage.removeItem('role')
        localStorage.removeItem('user')
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { logout, clearStatus } = authSlice.actions
export default authSlice.reducer
