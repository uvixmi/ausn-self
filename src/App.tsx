import { BrowserRouter } from "react-router-dom"
import "./App.css"
import { MainPage } from "./components/main-page"
import { useEffect } from "react"

function App() {
  useEffect(()=>{ console.log("")},[])
  return (
    <BrowserRouter>
      <MainPage />
    </BrowserRouter>
  )
}

export default App
