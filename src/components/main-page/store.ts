import { configureStore } from "@reduxjs/toolkit"
import userReducer from "../authorization-page/slice"
import registationReducer from "../register-page/slice"
import paymentsReducer from "../account-page/actions-page/payment-modal/slice"

// Создайте хранилище с вашим редьюсером
export const store = configureStore({
  reducer: {
    user: userReducer,
    registration: registationReducer,
    payments: paymentsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
