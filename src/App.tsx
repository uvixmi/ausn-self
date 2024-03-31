import { BrowserRouter } from "react-router-dom"
import "./App.css"
import { MainPage } from "./components/main-page"
function App() {
  return (
    <BrowserRouter>
      <MainPage />
    </BrowserRouter>
  )
}

export default App
