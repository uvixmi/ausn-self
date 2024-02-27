import { createAsyncThunk } from "@reduxjs/toolkit"
import Cookies from "js-cookie"
import { GetOperationsRequest, api } from "../../../api/myApi"

export const fetchTaxes = createAsyncThunk(
  "sources/fetchTaxes",
  async (filters: GetOperationsRequest, thunkAPI) => {
    try {
      const token = Cookies.get("token")
      const headers = {
        Authorization: `Bearer ${token}`,
      }
      const operations = await api.operations.getOperationsOperationsPost(
        filters,
        { headers }
      )
      return operations.data
    } catch (error) {
      if (typeof error === "string") {
        return thunkAPI.rejectWithValue(error)
      } else {
        return thunkAPI.rejectWithValue("Неизвестная ошибка")
      }
    }
  }
)
