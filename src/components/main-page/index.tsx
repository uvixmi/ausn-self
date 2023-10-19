import styles from "./styles.module.scss"
import { LogoIcon } from "./logo-icon"
import { AuthorizationPage } from "../authorization-page"
import { Routes, Route, useNavigate, Navigate } from "react-router-dom"
import { RegisterPage } from "../register-page"
import { AccountPage } from "../account-page"

export const MainPage = () => {
  const navigate = useNavigate()
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
            <Route path="/login" Component={AuthorizationPage} />
            <Route path="/register" Component={RegisterPage} />
            <Route path="/main" Component={AccountPage} />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
        <div>
          <div className={styles["register-footer"]}></div>
        </div>
      </div>
    </>
  )
}
