import { SourcesInfo } from "./../../../../api/myApi"
import { createSlice } from "@reduxjs/toolkit"
import { fetchSourcesInfo } from "./thunks"

interface SourcesInitialType {
  sourcesInfo?: SourcesInfo
  loading: string
  error?: string
  loaded: boolean
}

const initialState: SourcesInitialType = {
  sourcesInfo: undefined,
  loading: "",
  loaded: false,
  error: undefined,
}

const sourcesSlice = createSlice({
  name: "sources",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSourcesInfo.fulfilled, (state, action) => {
      state.sourcesInfo = action.payload
      state.loading = "succeeded"
      state.loaded = true
    })

    builder.addCase(fetchSourcesInfo.pending, (state) => {
      state.loading = "loading"
    })

    builder.addCase(fetchSourcesInfo.rejected, (state, action) => {
      state.loading = "failed"
      state.error = action.error.message
      state.loaded = false
    })
  },
})

export const {} = sourcesSlice.actions
export default sourcesSlice.reducer
