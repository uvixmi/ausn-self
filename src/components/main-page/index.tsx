import styles from "./styles.module.scss"
import { LogoIcon } from "./logo-icon"
import { AuthorizationPage } from "../authorization-page"
import { Routes, Route, useNavigate, Navigate } from "react-router-dom"
import { RegisterPage } from "../register-page"
import { AccountPage } from "../account-page"
import { useEffect, useState } from "react"
import { useAuth } from "../../AuthContext"

export const MainPage = () => {
  const navigate = useNavigate()
  const { isAuthenticated, login, logout } = useAuth()

  const [accessToken, setAccessToken] = useState("")
  const [isAuth, setIsAuth] = useState(false)
  const [token_type, setTokenType] = useState("")
  useEffect(() => {
    console.log(isAuthenticated)
  }, [isAuthenticated])
  if (!isAuthenticated)
    return (
      <>
        <div className={styles["main-wrapper"]}>
          <div className={styles["register-header"]}>
            <LogoIcon
              onClick={() => navigate("/login")}
              type="icon-custom"
              className={styles["logo-item"]}
            />
          </div>
          <div className={styles["background-cover"]}>
            <Routes>
              <Route
                path="/login"
                Component={() => (
                  <AuthorizationPage
                    setTokenType={setTokenType}
                    setAccessToken={setAccessToken}
                    setIsAuth={setIsAuth}
                    login={login}
                  />
                )}
              />
              <Route path="/register" Component={RegisterPage} />
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
          <div>
            <div className={styles["register-footer"]}></div>
          </div>
        </div>
      </>
    )
  else
    return (
      <div className={styles["main-wrapper"]}>
        <Routes>
          <Route
            path="/main"
            Component={() => (
              <AccountPage
                accessToken={accessToken}
                token_type={token_type}
                logOut={logout}
              />
            )}
          />
          <Route path="/*" element={<Navigate to="/main" replace />} />
        </Routes>
      </div>
    )
}
