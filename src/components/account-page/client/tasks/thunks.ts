import { createAsyncThunk } from "@reduxjs/toolkit"
import { api } from "../../../../api/myApi"
import Cookies from "js-cookie"

export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (_, thunkAPI) => {
    try {
      const token = Cookies.get("token")
      const headers = {
        Authorization: `Bearer ${token}`,
      }
      const response = await api.tasks.getTasksTasksGet({ headers })
      return response.data
    } catch (error) {
      if (typeof error === "string") {
        return thunkAPI.rejectWithValue(error)
      } else {
        return thunkAPI.rejectWithValue("Неизвестная ошибка")
      }
    }
  }
)
