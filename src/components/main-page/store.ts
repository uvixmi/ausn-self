import { configureStore } from "@reduxjs/toolkit"
import userReducer from "../authorization-page/slice"
import registationReducer from "../register-page/slice"

// Создайте хранилище с вашим редьюсером
export const store = configureStore({
  reducer: {
    user: userReducer,
    registration: registationReducer,
    // Замените на ваш собственный редьюсер, если он имеет другое имя
    // Другие редьюсеры могут быть добавлены по аналогии
  },
})

// Определите тип RootState для использования в компонентах
export type RootState = ReturnType<typeof store.getState>

// Определите тип AppDispatch для использования в useDispatch
export type AppDispatch = typeof store.dispatch
