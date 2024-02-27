import { createSlice } from "@reduxjs/toolkit"
import { fetchTaxes } from "./thunks"
import { OperationsResponse } from "../../../api/myApi"

interface BannersInitialType {
  taxes?: OperationsResponse | null
  loading: string
  error?: string
}

const initialState: BannersInitialType = {
  taxes: undefined,
  loading: "",
  error: undefined,
}

const taxesSlice = createSlice({
  name: "taxes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTaxes.fulfilled, (state, action) => {
      state.taxes = action.payload
      state.loading = "succeeded"
    })

    builder.addCase(fetchTaxes.pending, (state) => {
      state.loading = "loading"
    })

    builder.addCase(fetchTaxes.rejected, (state, action) => {
      state.loading = "failed"
      state.error = action.error.message
    })
  },
})

export const {} = taxesSlice.actions
export default taxesSlice.reducer
