// src/features/trip/tripSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const API_URL = 'http://127.0.0.1:8000/api'

export const createTrip = createAsyncThunk(
  'trip/createTrip',
  async ({ departure, arrival, seats = 1, total_price = 50 }, { rejectWithValue }) => {
    const token = localStorage.getItem('token')
    if (!token) return rejectWithValue('Utilisateur non connecté')

    try {
      const response = await fetch(`${API_URL}/trip/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ departure, arrival, seats, total_price }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Erreur lors de la création du trajet.')

      return data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

const tripSlice = createSlice({
  name: 'trip',
  initialState: {
    loading: false,
    successMessage: null,
    error: null,
  },
  reducers: {
    clearStatus(state) {
      state.error = null
      state.successMessage = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTrip.pending, (state) => {
        state.loading = true
        state.error = null
        state.successMessage = null
      })
      .addCase(createTrip.fulfilled, (state, action) => {
        state.loading = false
        state.successMessage = action.payload.message || 'Trajet créé avec succès'
      })
      .addCase(createTrip.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Erreur lors de la création du trajet'
      })
  },
})

export const { clearStatus } = tripSlice.actions
export default tripSlice.reducer
