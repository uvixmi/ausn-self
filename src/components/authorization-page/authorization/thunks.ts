import { createAsyncThunk } from "@reduxjs/toolkit"
import { jwtDecode } from "jwt-decode"
import { api } from "../../../api/myApi"

export const login = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await api.auth.loginAuthPost({
        username: email,
        password: password,
      })

      // Проверка наличия свойства data в ответе
      if (response.data) {
        const { token_type, access_token } = response.data
        const { exp } = jwtDecode<{ exp: number }>(access_token)

        let expiresIn: number
        if (exp) {
          const expDate = new Date(exp * 1000)
          expiresIn = Math.floor((expDate.getTime() - Date.now()) / 1000)
        } else {
          expiresIn = 86400 // Значение по умолчанию, если exp отсутствует
        }

        return {
          accessToken: access_token,
          tokenType: token_type,
          expiresIn,
        }
      } else {
        console.error("Отсутствует свойство data в ответе API.")
        return rejectWithValue("Отсутствует свойство data в ответе API.")
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Ошибка при выполнении запроса:", error)
      return rejectWithValue(
        error.response?.data?.message || "Ошибка при выполнении запроса."
      )
    }
  }
)
