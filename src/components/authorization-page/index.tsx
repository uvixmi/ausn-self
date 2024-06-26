import { Button, Form, Input, Typography } from "antd"
import styles from "./styles.module.scss"
import { CONTENT } from "./constants"
import { RegisterWelcomeImage } from "./images/register-welcome"
import Link from "antd/es/typography/Link"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { api } from "../../api/myApi"
import { AuthorizationPageProps } from "./types"
import { useDispatch, useSelector } from "react-redux"
import { fetchCurrentUser } from "./slice"
import { AppDispatch, RootState } from "../main-page/store"
import Cookies from "js-cookie"
import { useAuth } from "../../AuthContext"
import { isErrorResponse } from "./utils"
import { jwtDecode } from "jwt-decode"
import { ButtonOne } from "../../ui-kit/button"
import { InputOne } from "../../ui-kit/input"

const { Title, Text } = Typography

export const AuthorizationPage = ({
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
      console.log("deleted")
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

  return (
    <>
      <div className={styles["content-wrapper"]}>
        <div className={styles["register-block-wrapper"]}>
          <div className={styles["inputs-wrapper"]}>
            <Title level={1} className={styles["heading-text"]}>
              {CONTENT.AUTHORIZATION_HEADING}
            </Title>
            <div className={styles["inputs-window"]}>
              <div className={styles["input-item-wrapper"]}>
                <Text>{CONTENT.EMAIL_TITLE}</Text>
                <Form.Item
                  className={styles["form-email"]}
                  validateStatus={authError ? "error" : ""} // Устанавливаем статус ошибки в 'error' при наличии ошибки
                >
                  <Input
                    className={styles["input-item"]}
                    placeholder={CONTENT.EMAIL_PLACEHOLDER}
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value.toLowerCase())
                    }}
                  />
                </Form.Item>
              </div>
              <div className={styles["input-item-wrapper"]}>
                <Text>{CONTENT.PASSWORD_TITLE}</Text>
                <Form.Item
                  className={styles["form-password"]}
                  validateStatus={authError ? "error" : ""} // Устанавливаем статус ошибки в 'error' при наличии ошибки
                  help={
                    authError ? (
                      <div>
                        <Text className={styles["error-text"]}>
                          {errorText}
                        </Text>
                      </div>
                    ) : (
                      ""
                    )
                  }
                >
                  <Input
                    className={styles["input-item"]}
                    placeholder={CONTENT.PASSWORD_PLACEHOLDER}
                    type="password"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value.trim())
                      setAuthError(false)
                    }}
                  />
                </Form.Item>
              </div>
              <div className={styles["links-wrapper"]}>
                <Link onClick={() => navigate("/register")}>
                  {CONTENT.REGISTRATION_TEXT}
                </Link>
                {/*<Link>{CONTENT.PASSWORD_FORGOT_TEXT}</Link>*/}
              </div>
            </div>
            <ButtonOne
              className={styles["button-item"]}
              onClick={async () => {
                try {
                  const response = await api.auth.loginAuthPost({
                    username: email,
                    password: password,
                  })
                  // Проверка наличия свойства data в ответе
                  if (response.data) {
                    const { token_type, access_token } = response.data
                    const { exp } = jwtDecode(access_token)
                    if (exp) {
                      const expDate = new Date(exp * 1000)
                      const expiresIn = Math.floor(
                        (expDate.getTime() - Date.now()) / 1000
                      )
                      login(access_token, expiresIn)
                    } else login(access_token, 86400)
                    dispatch(fetchCurrentUser())
                    setAccessToken(access_token)
                    setTokenType(token_type)
                    setIsAuth(true)
                  } else {
                    console.error("Отсутствует свойство data в ответе API.")
                  }
                } catch (error) {
                  console.error("Ошибка при выполнении запроса:", error)

                  setAuthError(true)
                  if (isErrorResponse(error)) {
                    setErrorText(error.error.detail.message)
                  }
                }
              }}
            >
              {CONTENT.ENTER_BUTTON}
            </ButtonOne>
          </div>
          <div className={styles["img-wrapper"]}>
            <RegisterWelcomeImage className={styles["img-wrapper"]} />
          </div>
        </div>
      </div>
    </>
  )
}
