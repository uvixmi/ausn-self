import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import { Draft } from "immer"
import { User, api } from "../../api/myApi"
import Cookies from "js-cookie"
import { useAuth } from "../../AuthContext"

export const fetchCurrentUser = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>("user/fetchCurrentUser", async (_, thunkAPI) => {
  try {
    const token = Cookies.get("token")
    const headers = {
      Authorization: `Bearer ${token}`,
    }
    const response = await api.users.currentUserUsersGet({ headers })

    return response.data
  } catch (error) {
    if (typeof error === "string") {
      return thunkAPI.rejectWithValue(error)
    } else {
      return thunkAPI.rejectWithValue("Неизвестная ошибка")
    }
  }
})

const userSlice = createSlice({
  name: "user",
  initialState: {
    data: {} as User,
    loading: "" as string,
    loaded: false,
    error: null as string | null,
  },
  reducers: {
    updateInn: (state, action: PayloadAction<string>) => {
      state.data.inn = action.payload
    },
    clearData: (state) => {
      state.data = {} as User
      state.loaded = false
    },
    refreshRole: (state) => {
      state.loaded = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        fetchCurrentUser.pending,
        (
          state: Draft<{ data: User; loading: string; error: string | null }>
        ) => {
          state.loading = "loading"
          state.error = null
        }
      )
      .addCase(
        fetchCurrentUser.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.loading = "succeeded"
          state.data = action.payload
          if (!state.loaded) state.loaded = true
        }
      )
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        if (action.payload !== undefined) {
          state.error = action.payload
        } else if (action.error) {
          state.error = action.error.message || null
        } else {
          state.error = "Неизвестная ошибка"
        }
        state.loading = "failed"
      })
  },
})

export const { updateInn, clearData, refreshRole } = userSlice.actions
export default userSlice.reducer
