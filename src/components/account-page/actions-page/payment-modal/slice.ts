import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { PaymentsStore } from "./types"

const initialState: PaymentsStore = {
  payments: [
    { amount: 0, date: "", tax_period: 0, doc_number: " ", tax_type: 1 },
  ],
}

const paymentsSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {
    addPayment: (state) => {
      state.payments = [...state.payments, initialState.payments[0]]
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
      state.payments.forEach((payment) => {
        payment.amount = 0
        payment.date = ""
        payment.tax_period = 0
        payment.doc_number = ""
      })
    },
  },
})

export const { setAmount, setDate, setDocNumber, setYear, addPayment, clear } =
  paymentsSlice.actions
export default paymentsSlice.reducer
