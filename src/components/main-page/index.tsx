import styles from "./styles.module.scss"
import { LogoIcon } from "./logo-icon"
import { AuthorizationPage } from "../authorization-page"
import { Routes, Route, useNavigate, Navigate } from "react-router-dom"
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

export const MainPage = () => {
  const navigate = useNavigate()
  const { isAuthenticated, login, logout } = useAuth()

  const [accessToken, setAccessToken] = useState("")
  const [isAuth, setIsAuth] = useState(false)
  const [token_type, setTokenType] = useState("")
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(fetchCurrentUser())
  }, [dispatch])

  const {
    data: currentUser,
    loading,
    error,
  } = useSelector((state: RootState) => state.user)

  const token = Cookies.get("token")

  if (!isAuthenticated)
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
    )
  else if (token && currentUser.inn == null && currentUser.is_lead == false)
    return (
      <>
        <div className={styles["main-wrapper"]}>
          <div className={styles["register-header"]}>
            <LogoIcon
              onClick={() => {
                logout(), navigate("/login"), dispatch(clearData())
              }}
              type="icon-custom"
              className={styles["logo-item"]}
            />
          </div>
          <div className={styles["background-cover"]}>
            <Routes>
              <Route
                path="/register"
                Component={() => (
                  <RegisterPage
                    registrationPage={2}
                    currentUser={currentUser}
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
          <div>
            <div className={styles["register-footer"]}></div>
          </div>
        </div>
      </>
    )
  else if (token && currentUser.is_lead == true)
    return (
      <>
        <div className={styles["main-wrapper"]}>
          <div className={styles["register-header"]}>
            <LogoIcon
              onClick={() => {
                logout(), navigate("/login"), dispatch(clearData())
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
  else if (token && currentUser.inn)
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
          </Route>
          <Route path="/*" element={<Navigate to="/main" replace />} />
        </Routes>
      </div>
    )
  else
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
    )
}
