import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { PaymentsStore } from "./types"

const initialState: PaymentsStore = {
  payments: [
    { amount: 0, date: "", tax_period: 0, doc_number: "", tax_type: 4 },
  ],
}

const paymentsSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {
    addPayment: (state) => {
      state.payments = [...state.payments, initialState.payments[0]]
    },
    deletePayment: (state, action: PayloadAction<{ index: number }>) => {
      state.payments = state.payments.filter(
        (payment, index) => index !== action.payload.index
      )
    },
    setAmount: (
      state,
      action: PayloadAction<{ amount: string; index: number }>
    ) => {
      state.payments.forEach((payment, index) => {
        if (index === action.payload.index)
          payment.amount = parseFloat(action.payload.amount) || 0
      })
    },
    setDate: (
      state,
      action: PayloadAction<{ date: string; index: number }>
    ) => {
      state.payments.forEach((payment, index) => {
        if (index === action.payload.index) payment.date = action.payload.date
      })
    },
    setYear: (
      state,
      action: PayloadAction<{ tax_period: number; index: number }>
    ) => {
      state.payments.forEach((payment, index) => {
        if (index === action.payload.index)
          payment.tax_period = action.payload.tax_period
      })
    },
    setDocNumber: (
      state,
      action: PayloadAction<{ doc_number: string; index: number }>
    ) => {
      state.payments.forEach((payment, index) => {
        if (index === action.payload.index)
          payment.doc_number = action.payload.doc_number
      })
    },
    clear: (state) => {
      state.payments = initialState.payments
    },
  },
})

export const {
  setAmount,
  setDate,
  setDocNumber,
  setYear,
  addPayment,
  clear,
  deletePayment,
} = paymentsSlice.actions
export default paymentsSlice.reducer
