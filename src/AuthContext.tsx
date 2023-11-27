// AuthContext.tsx
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react"

interface AuthContextProps {
  children: ReactNode
}

interface AuthContextValue {
  isAuthenticated: boolean
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider: React.FC<AuthContextProps> = ({ children }) => {
  const [isAuthenticated, setAuthenticated] = useState(() => {
    const storedAuth = localStorage.getItem("isAuthenticated")
    return storedAuth ? JSON.parse(storedAuth) : false
  })

  const login = (token: string) => {
    setAuthenticated(true)
    localStorage.setItem("token", token)
    // Устанавливаем время жизни токена в localStorage (например, 1 час)
    const tokenExpiration = new Date().getTime() + 3600000 // 1 час в миллисекундах
    localStorage.setItem("tokenExpiration", tokenExpiration.toString())
  }

  const logout = () => {
    setAuthenticated(false)
    localStorage.removeItem("token")
    localStorage.removeItem("tokenExpiration")
  }

  useEffect(() => {
    const checkTokenExpiration = () => {
      const tokenExpiration = localStorage.getItem("tokenExpiration")
      if (
        tokenExpiration &&
        new Date().getTime() > parseInt(tokenExpiration, 10)
      ) {
        // Токен истек, производим выход
        logout()
      }
    }

    checkTokenExpiration()

    // Проверка времени жизни токена при каждом изменении isAuthenticated
    if (isAuthenticated) {
      const interval = setInterval(checkTokenExpiration, 60000) // каждую минуту
      return () => clearInterval(interval)
    }
  }, [isAuthenticated])

  const value: AuthContextValue = {
    isAuthenticated,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
