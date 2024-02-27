import { InfoBannersResponse } from "../../../../api/myApi"
import { createSlice } from "@reduxjs/toolkit"
import { fetchBanners } from "./thunks"

interface BannersInitialType {
  banners?: InfoBannersResponse | null
  loading: string
  error?: string
}

const initialState: BannersInitialType = {
  banners: undefined,
  loading: "",
  error: undefined,
}

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchBanners.fulfilled, (state, action) => {
      state.banners = action.payload
      state.loading = "succeeded"
    })

    builder.addCase(fetchBanners.pending, (state) => {
      state.loading = "loading"
    })

    builder.addCase(fetchBanners.rejected, (state, action) => {
      state.loading = "failed"
      state.error = action.error.message
    })
  },
})

export const {} = tasksSlice.actions
export default tasksSlice.reducer
