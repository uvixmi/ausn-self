import { configureStore } from "@reduxjs/toolkit"
import userReducer from "../authorization-page/slice"
import registationReducer from "../register-page/slice"
import paymentsReducer from "../account-page/actions-page/payment-modal/slice"
import sourcesReducer from "../account-page/client/sources/slice"
import tasksReducer from "../account-page/client/tasks/slice"
import bannersReducer from "../account-page/client/banners/slice"
import taxesReducer from "../account-page/taxes-page/slice"

// Создайте хранилище с вашим редьюсером
export const store = configureStore({
  reducer: {
    user: userReducer,
    registration: registationReducer,
    payments: paymentsReducer,
    sources: sourcesReducer,
    tasks: tasksReducer,
    banners: bannersReducer,
    taxes: taxesReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
