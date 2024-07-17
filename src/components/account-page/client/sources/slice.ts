import { SourcesInfo } from "./../../../../api/myApi"
import { createSlice } from "@reduxjs/toolkit"
import { fetchSourcesInfo } from "./thunks"

interface SourcesInitialType {
  sourcesInfo?: SourcesInfo
  loading: string
  error?: string
  loaded: boolean
  isLoadingForPage: boolean
}

const initialState: SourcesInitialType = {
  sourcesInfo: undefined,
  loading: "",
  loaded: false,
  error: undefined,
  isLoadingForPage: false,
}

const sourcesSlice = createSlice({
  name: "sources",
  initialState,
  reducers: {
    clearSources: (state) => {
      state.sourcesInfo = undefined
      state.loaded = false
      state.loading = ""
      state.error = undefined
      state.isLoadingForPage = false
    },
    newPage: (state) => {
      state.isLoadingForPage = false
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSourcesInfo.fulfilled, (state, action) => {
      state.sourcesInfo = action.payload
      state.loading = "succeeded"
      state.loaded = true
      state.isLoadingForPage = false
    })

    builder.addCase(fetchSourcesInfo.pending, (state) => {
      state.loading = "loading"
      state.isLoadingForPage = true
    })

    builder.addCase(fetchSourcesInfo.rejected, (state, action) => {
      state.loading = "failed"
      state.error = action.error.message
      state.loaded = false
    })
  },
})

export const { clearSources, newPage } = sourcesSlice.actions
export default sourcesSlice.reducer
