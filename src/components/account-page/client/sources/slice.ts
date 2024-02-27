import { SourcesInfo } from "./../../../../api/myApi"
import { createSlice } from "@reduxjs/toolkit"
import { fetchSourcesInfo } from "./thunks"

interface SourcesInitialType {
  sourcesInfo?: SourcesInfo
  loading: string
  error?: string
}

const initialState: SourcesInitialType = {
  sourcesInfo: undefined,
  loading: "",
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
    })

    builder.addCase(fetchSourcesInfo.pending, (state) => {
      state.loading = "loading"
    })

    builder.addCase(fetchSourcesInfo.rejected, (state, action) => {
      state.loading = "failed"
      state.error = action.error.message
    })
  },
})

export const {} = sourcesSlice.actions
export default sourcesSlice.reducer
