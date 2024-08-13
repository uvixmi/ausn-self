import styles from "./styles.module.scss"
import { LogoIcon } from "./logo-icon"
import { AuthorizationPage } from "../authorization-page"
import {
  Routes,
  Route,
  useNavigate,
  Navigate,
  useLocation,
} from "react-router-dom"
import { RegisterPage } from "../register-page"
import { AccountPage } from "../account-page"
import { useEffect, useState } from "react"
import { useAuth } from "../../AuthContext"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "./store"
import { NonTargetPage } from "../non-target-page"
import { clearData, fetchCurrentUser } from "../authorization-page/slice"
import Cookies from "js-cookie"
import { ActionsPage } from "../account-page/actions-page"
import { TaxesPage } from "../account-page/taxes-page"
import { SettingsPage } from "../account-page/settings-page"
import { ReportsPage } from "../account-page/reports-page"
import { jwtDecode } from "jwt-decode"
import { clearSources } from "../account-page/client/sources/slice"
import { clearTasks } from "../account-page/client/tasks/slice"
import { ResetPasswordPage } from "../reset-password-page"
import { getQueryParam } from "./utils"

export const MainPage = () => {
  const navigate = useNavigate()
  const { role, login, setRole, logout } = useAuth()

  const [accessToken, setAccessToken] = useState("")
  const [isAuth, setIsAuth] = useState(false)
  const [token_type, setTokenType] = useState("")
  const dispatch = useDispatch<AppDispatch>()
  const {
    data: currentUser,
    loaded,
    loading,
  } = useSelector((state: RootState) => state.user)

  const token = Cookies.get("token")

  const clearAll = () => {
    dispatch(clearData())
    dispatch(clearTasks())
    dispatch(clearSources())
  }

  useEffect(() => {
    if (loading === "failed") {
      logout(), clearAll(), navigate("/login")
    }
  }, [loading])

  const [reset, setReset] = useState("")

  const location = useLocation()

  useEffect(() => {
    const updateVh = () => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty("--vh", `${vh}px`)
    }

    // Обновляем переменную при загрузке и изменении размера окна
    updateVh()
    window.addEventListener("resize", updateVh)

    return () => window.removeEventListener("resize", updateVh)
  }, [])

  useEffect(() => {
    const resetToken = location.search.substring(
      location.search.indexOf("=") + 1
    )

    if (location.pathname === "/password_change") {
      localStorage.setItem("resetToken", resetToken)

      setRole("reset", 86400)
    }
  }, [])

  useEffect(() => {
    if (loaded && token) {
      let expiresIn = 0
      const { exp } = jwtDecode(token)
      if (exp) {
        const expDate = new Date(exp * 1000)
        expiresIn = Math.floor((expDate.getTime() - Date.now()) / 1000)
      }

      if (!currentUser.inn && !currentUser.is_lead) {
        if (expiresIn !== 0) setRole("register", expiresIn)
        setRole("register", 86400)
      } else if (currentUser.is_lead == true)
        if (expiresIn !== 0) setRole("lead", expiresIn)
        else setRole("lead", 86400)
      else {
        if (expiresIn !== 0) setRole("account", expiresIn)
        else setRole("account", 86400)
      }
    }
  }, [currentUser.inn, currentUser.is_lead, loaded, token])

  if (!role)
    return (
      <>
        <div className={styles["main-wrapper"]}>
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
              <Route
                path="/register"
                Component={() => (
                  <RegisterPage
                    setTokenType={setTokenType}
                    setAccessToken={setAccessToken}
                    setIsAuth={setIsAuth}
                    login={login}
                  />
                )}
              />
              <Route
                path="/non-target"
                Component={() => (
                  <NonTargetPage
                    accessToken={accessToken}
                    token_type={token_type}
                    logOut={logout}
                  />
                )}
              />
              <Route
                path="/reset"
                Component={() => (
                  <ResetPasswordPage
                    setTokenType={setTokenType}
                    setAccessToken={setAccessToken}
                    setIsAuth={setIsAuth}
                    login={login}
                    step={0}
                  />
                )}
              />

              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </div>
      </>
    )
  else if (role === "register")
    return (
      <>
        <div className={styles["main-wrapper"]}>
          <div className={styles["background-cover"]}>
            <Routes>
              <Route
                path="/register"
                Component={() => (
                  <RegisterPage
                    registrationPage={2}
                    currentUser={currentUser}
                    setTokenType={setTokenType}
                    setAccessToken={setAccessToken}
                    setIsAuth={setIsAuth}
                    login={login}
                  />
                )}
              />
              <Route
                path="/non-target"
                Component={() => (
                  <NonTargetPage
                    accessToken={accessToken}
                    token_type={token_type}
                    logOut={logout}
                  />
                )}
              />
              <Route path="/*" element={<Navigate to="/register" replace />} />
            </Routes>
          </div>
        </div>
      </>
    )
  else if (role === "reset")
    return (
      <>
        <div className={styles["main-wrapper"]}>
          <div className={styles["background-cover"]}>
            <Routes>
              <Route
                path="/reset"
                Component={() => (
                  <ResetPasswordPage
                    setTokenType={setTokenType}
                    setAccessToken={setAccessToken}
                    setIsAuth={setIsAuth}
                    login={login}
                    step={1}
                  />
                )}
              />

              <Route path="/" element={<Navigate to="/reset" replace />} />
              <Route path="/*" element={<Navigate to="/reset" replace />} />
            </Routes>
          </div>
        </div>
      </>
    )
  else if (role === "lead")
    return (
      <>
        <div className={styles["main-wrapper"]}>
          <div className={styles["register-header"]}>
            <LogoIcon
              onClick={() => {
                logout(), navigate("/login"), clearAll()
              }}
              type="icon-custom"
              className={styles["logo-item"]}
            />
          </div>
          <div className={styles["background-cover"]}>
            <Routes>
              <Route
                path="/non-target"
                Component={() => (
                  <NonTargetPage
                    accessToken={accessToken}
                    token_type={token_type}
                    logOut={logout}
                  />
                )}
              />
              <Route
                path="/*"
                element={<Navigate to="/non-target" replace />}
              />
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
            path="/"
            Component={() => (
              <AccountPage
                accessToken={accessToken}
                token_type={token_type}
                logOut={logout}
              />
            )}
          >
            <Route path="main" element={<ActionsPage />} />
            <Route path="taxes" element={<TaxesPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="/*" element={<Navigate to="/main" replace />} />
            <Route path="/" element={<Navigate to="/main" replace />} />
          </Route>
          <Route path="/*" element={<Navigate to="/main" replace />} />
          <Route path="/" element={<Navigate to="/main" replace />} />
        </Routes>
      </div>
    )

  {
    /*else
    return (
      <>
        <div className={styles["main-wrapper"]}>
          <div className={styles["register-header"]}>
            <LogoIcon
              onClick={() => {
                logout(), dispatch(clearData()), navigate("/login")
              }}
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
    )*/
  }
}
