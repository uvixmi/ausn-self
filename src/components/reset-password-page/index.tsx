import { ConfigProvider, Form, Typography } from "antd"
import styles from "./styles.module.scss"
import { CONTENT } from "./constants"

import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { api } from "../../api/myApi"
import { AuthorizationPageProps } from "./types"
import { useDispatch, useSelector } from "react-redux"
import { fetchCurrentUser } from "./slice"
import { AppDispatch, RootState } from "../main-page/store"
import Cookies from "js-cookie"
import { useAuth } from "../../AuthContext"
import { ButtonOne } from "../../ui-kit/button"
import { InputOne } from "../../ui-kit/input"
import cn from "classnames"
import "./styles.scss"
import { LogoMainIcon } from "../main-page/logo-icon-main"
import { useMediaQuery } from "@react-hook/media-query"
import { ResetPasswordImage } from "./images/reset-password"
import { isErrorResponse } from "./utils"

const { Title, Text } = Typography

export const ResetPasswordPage = ({
  setTokenType,
  setAccessToken,
  setIsAuth,
  login,
}: AuthorizationPageProps) => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const dispatch = useDispatch<AppDispatch>()
  const {
    data: currentUser,
    loading,
    error,
  } = useSelector((state: RootState) => state.user)

  const [authError, setAuthError] = useState(false)
  const [errorText, setErrorText] = useState("")

  const isDesktop = useMediaQuery("(min-width: 1280px)")

  const token = Cookies.get("token")
  const { isAuthenticated, setRole, logout } = useAuth()

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    window.carrotquest &&
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      window.carrotquest.onReady(function () {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        window.carrotquest.removeChat()
      })
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    window.carrotquest == null
    function deleteCookie() {
      document.cookie = "carrotquest_uid=; max-age=0; path=/"
      document.cookie = "carrotquest_auth_token=; max-age=0; path=/"
      localStorage.removeItem("carrotquest_data")
    }

    deleteCookie()

    function deleteCookieOne(name: string) {
      document.cookie =
        name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    }

    function deleteCookieTwo(name: string, domain?: string) {
      if (domain) {
        document.cookie =
          name +
          "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" +
          domain
      } else {
        document.cookie =
          name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
      }
    }
    // Удаление всех куки, начинающихся с "carrotquest"
    function deleteCarrotquestCookies() {
      const cookies = document.cookie.split(";")

      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim()
        if (
          cookie.startsWith("carrotquest_uid") ||
          cookie.startsWith("carrotquest_auth_token")
        ) {
          const cookieName = cookie.split("=")[0]
          deleteCookieTwo(cookieName) // Удаляем куки для текущего домена
          deleteCookieTwo(cookieName, ".buh.app") // Удаляем куки для домена .buh.app
        }
      }
    }

    // Удаление данных и куки
    deleteCarrotquestCookies()
  }, [])

  const [emailInvalid, setEmailInvalid] = useState(false)
  const [emailInvalidText, setEmailInvalidText] = useState("")

  const resetPassword = async () => {
    try {
      const data = { email: email }
      await api.users.passwordResetUsersPasswordResetPost(data)
      setEmailInvalid(false)
      setEmailInvalidText("")
    } catch (error) {
      console.error("Ошибка при выполнении запроса:", error)

      setEmailInvalid(true)

      if (isErrorResponse(error)) {
        setEmailInvalidText(error.error.detail.message)
      }
    }
  }

  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            Checkbox: {
              colorPrimary: "#6159FF",
              colorPrimaryHover: "#6159FF",
              colorPrimaryBorder: "#6159FF",
              controlInteractiveSize: 22,
              fontSize: 14,
              lineHeight: 14,
            },
          },
        }}
      >
        <div className={styles["content-wrapper"]}>
          <div className={styles["register-block-wrapper"]}>
            <div className={styles["inputs-wrapper"]}>
              <Text className={styles["heading-text"]}>
                {CONTENT.RESET_HEADING}
              </Text>
              <div className={styles["description-block"]}>
                <Text className={styles["description-text"]}>
                  {CONTENT.TEXT_DESCRIPTION_ONE}
                </Text>
                <Text className={styles["description-text"]}>
                  {CONTENT.TEXT_DESCRIPTION_TWO}
                </Text>
              </div>
              <div className={styles["inputs-window"]}>
                <div className={styles["input-item-wrapper"]}>
                  <Text className={styles["input-title"]}>
                    {CONTENT.EMAIL_TITLE}
                  </Text>
                  <Form.Item
                    className={styles["form-email"]}
                    validateStatus={emailInvalid ? "error" : ""}
                    help={
                      emailInvalid ? (
                        <Text className={styles["error-text"]}>
                          {emailInvalidText}
                        </Text>
                      ) : (
                        ""
                      )
                    }
                  >
                    <InputOne
                      placeholder={CONTENT.EMAIL_PLACEHOLDER}
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value.toLowerCase())
                      }}
                    />
                  </Form.Item>
                  <ButtonOne onClick={resetPassword}>
                    {CONTENT.ENTER_BUTTON}
                  </ButtonOne>
                </div>
              </div>
            </div>
          </div>
          <div className={styles["img-wrapper"]}>
            {isDesktop && (
              <LogoMainIcon
                type="icon-custom"
                className={styles["logo-item"]}
              />
            )}
            <ResetPasswordImage className={styles["image-register"]} />
          </div>
        </div>
      </ConfigProvider>
    </>
  )
}
