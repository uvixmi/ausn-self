import { TaskResponse } from "../../../../api/myApi"
import { createSlice } from "@reduxjs/toolkit"
import { fetchTasks } from "./thunks"

interface SourcesInitialType {
  tasks?: TaskResponse
  loading: string
  error?: string
}

const initialState: SourcesInitialType = {
  tasks: undefined,
  loading: "",
  error: undefined,
}

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      state.tasks = action.payload
      state.loading = "succeeded"
    })

    builder.addCase(fetchTasks.pending, (state) => {
      state.loading = "loading"
    })

    builder.addCase(fetchTasks.rejected, (state, action) => {
      state.loading = "failed"
      state.error = action.error.message
    })
  },
})

export const {} = tasksSlice.actions
export default tasksSlice.reducer
