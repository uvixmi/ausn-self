import { TaskResponse } from "../../../../api/myApi"
import { createSlice } from "@reduxjs/toolkit"
import { fetchTasks } from "./thunks"

interface SourcesInitialType {
  tasks?: TaskResponse
  loading: string
  error?: string
  loaded: boolean
}

const initialState: SourcesInitialType = {
  tasks: undefined,
  loading: "",
  error: undefined,
  loaded: false,
}

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    clearTasks: (state) => {
      state.tasks = undefined
      state.loaded = false
      state.loading = ""
      state.error = undefined
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      state.tasks = action.payload
      state.loading = "succeeded"
      state.loaded = true
    })

    builder.addCase(fetchTasks.pending, (state) => {
      state.loading = "loading"
    })

    builder.addCase(fetchTasks.rejected, (state, action) => {
      state.loading = "failed"
      state.error = action.error.message
      state.loaded = false
    })
  },
})

export const { clearTasks } = tasksSlice.actions
export default tasksSlice.reducer
