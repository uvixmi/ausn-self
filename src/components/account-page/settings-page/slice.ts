import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { TaxSystemType } from "../../../api/myApi"

// Определение начального состояния
interface SliceState {
  email: string
  phone: string
  inn: string
  error: string | null
  start_year: number
  tax_rate: number | undefined
  tax_system: TaxSystemType | undefined
}

const initialState: SliceState = {
  email: "",
  phone: "",
  inn: "",
  error: null,
  start_year: 0,
  tax_rate: 0,
  tax_system: undefined,
}

// Создание slice
const mySlice = createSlice({
  name: "mySlice",
  initialState,
  reducers: {
    // Обработчик для установки значений email, phone и inn
    setValues: (
      state,
      action: PayloadAction<{ email: string; phone: string; inn: string }>
    ) => {
      state.email = action.payload.email
      state.phone = action.payload.phone
      state.inn = action.payload.inn
    },
    // Обработчик для установки значения ошибки
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
    },
    // Обработчик для сброса ошибки
    clearError: (state) => {
      state.error = null
    },
    setTaxSystem: (
      state,
      action: PayloadAction<{
        start_year: number
        tax_rate: number | undefined
        tax_system: TaxSystemType
        inn: string
      }>
    ) => {
      state.start_year = action.payload.start_year
      state.tax_rate = action.payload.tax_rate
      state.tax_system = action.payload.tax_system
      state.inn = action.payload.inn
    },
  },
})

// Экспорт экшенов и редьюсера
export const { setValues, setError, clearError, setTaxSystem } = mySlice.actions
export default mySlice.reducer
