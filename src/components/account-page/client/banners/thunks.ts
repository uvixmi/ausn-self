import { convertDateFormat } from "../../actions-page/payment-modal/utils"
import { createAsyncThunk } from "@reduxjs/toolkit"
import { api } from "../../../../api/myApi"
import Cookies from "js-cookie"

export const fetchBanners = createAsyncThunk(
  "sources/fetchBanners",
  async (_, thunkAPI) => {
    try {
      const token = Cookies.get("token")
      const headers = {
        Authorization: `Bearer ${token}`,
      }
      const response = await api.banners.getUserBannersBannersGet(
        {
          current_date: convertDateFormat(new Date().toLocaleDateString("ru")),
        },
        {
          headers,
        }
      )
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
