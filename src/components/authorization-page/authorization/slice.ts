import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface AuthState {
  email: string
  password: string
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  email: "",
  password: "",
  isAuthenticated: false,
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true
      state.error = null
    },
    loginSuccess(state, action: PayloadAction<{ email: string }>) {
      state.loading = false
      state.isAuthenticated = true
      state.email = action.payload.email
      state.password = "" // Убираем пароль после успешного входа
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
      state.isAuthenticated = false
    },
    logout(state) {
      state.email = ""
      state.password = ""
      state.isAuthenticated = false
      state.loading = false
      state.error = null
    },
    setEmail(state, action: PayloadAction<string>) {
      state.email = action.payload
    },
    setPassword(state, action: PayloadAction<string>) {
      state.password = action.payload
    },
  },
})

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  setEmail,
  setPassword,
} = authSlice.actions

export default authSlice.reducer
