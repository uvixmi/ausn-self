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
  login: (token: string, expiresIn: number) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider: React.FC<AuthContextProps> = ({ children }) => {
  const [isAuthenticated, setAuthenticated] = useState(() => {
    const storedAuth = localStorage.getItem("isAuthenticated")
    return storedAuth ? JSON.parse(storedAuth) : false
  })

  const setToken = (token: string, expiresIn: number) => {
    document.cookie = `token=${token}; max-age=${expiresIn}; path=/`
  }

  const login = (token: string, expiresIn: number) => {
    setToken(token, expiresIn)
    setAuthenticated(true)
    localStorage.setItem("isAuthenticated", "true")
  }

  const logout = () => {
    document.cookie = "token=; max-age=0; path=/"
    setAuthenticated(false)
    localStorage.removeItem("isAuthenticated")
  }

  useEffect(() => {
    const checkTokenExpiration = () => {
      const tokenExpiration = document.cookie
        .split(";")
        .find((c) => c.trim().startsWith("tokenExpiration="))

      if (
        tokenExpiration &&
        new Date().getTime() > parseInt(tokenExpiration.split("=")[1], 10)
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
