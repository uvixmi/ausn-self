import { ConfigProvider, Form, Input, Spin, Typography } from "antd"
import styles from "./styles.module.scss"
import { CONTENT } from "./constants"
import { LoadingOutlined } from "@ant-design/icons"
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
import { isErrorResponse, validateEmail } from "./utils"
import { jwtDecode } from "jwt-decode"

const { Title, Text, Link } = Typography

export const ResetPasswordPage = ({
  setTokenType,
  setAccessToken,
  setIsAuth,
  login,
  step,
}: AuthorizationPageProps) => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const dispatch = useDispatch<AppDispatch>()
  const {
    data: currentUser,
    loading,
    error,
  } = useSelector((state: RootState) => state.user)

  const [isFirstLoading, setIsFirstLoading] = useState(false)
  const antFirstIcon = (
    <LoadingOutlined
      style={{
        fontSize: 24,
        color: "#fff",
      }}
      spin
    />
  )

  const [authError, setAuthError] = useState(false)
  const [errorText, setErrorText] = useState("")
  const [authRepeatError, setAuthRepeatError] = useState(false)
  const [errorRepeatText, setErrorRepeatText] = useState("")

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

  const [emaiRegexValid, setEmailRegexValid] = useState(false)

  const [emailInvalid, setEmailInvalid] = useState(false)
  const [emailInvalidText, setEmailInvalidText] = useState("")

  const resetPassword = async () => {
    if (step === 0) {
      try {
        setIsFirstLoading(true)
        const data = { email: email }
        await api.users.passwordResetUsersPasswordResetPost(data)
        setEmailInvalid(false)
        startTimer()
        setEmailInvalidText("")
      } catch (error) {
        console.error("Ошибка при выполнении запроса:", error)

        setEmailInvalid(true)

        if (isErrorResponse(error)) {
          setEmailInvalidText(error.error.detail.message)
        }
      } finally {
        setIsFirstLoading(false)
      }
    } else
      try {
        setIsFirstLoading(true)
        const data = { new_password: password }

        const resetToken = localStorage.getItem("resetToken")
        const headers = {
          Authorization: `Bearer ${resetToken}`,
        }
        const response = await api.users.passwordChangeUsersPasswordChangePut(
          data,
          { headers }
        )
        setEmailInvalid(false)
        setEmailInvalidText("")

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

        setEmailInvalid(true)

        if (isErrorResponse(error)) {
          setEmailInvalidText(error.error.detail.message)
        }
      } finally {
        setIsFirstLoading(false)
      }
  }
  const [isButtonDisabled, setIsButtonDisabled] = useState(false)

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d_!,%@$^&*()\-+=]{8,}$/

  const validatePassword = (password: string) => {
    return passwordRegex.test(password)
  }

  const [form] = Form.useForm()
  useEffect(() => {
    if (
      password === repeatPassword &&
      validatePassword(password) &&
      validatePassword(repeatPassword)
    )
      setIsButtonDisabled(false)
    else setIsButtonDisabled(true)
  }, [password, repeatPassword])

  const [secondsRemaining, setSecondsRemaining] = useState(0)
  const [isFirstButtonDisabled, setIsDisabledFirstButton] = useState(false)
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isButtonDisabled) {
      timer = setInterval(() => {
        if (secondsRemaining > 0) {
          setSecondsRemaining((prev) => prev - 1)
        } else {
          setIsDisabledFirstButton(false)
          clearInterval(timer)
        }
      }, 1000)
    }
    return () => {
      clearInterval(timer)
    }
  }, [isButtonDisabled, secondsRemaining])

  const startTimer = () => {
    setIsDisabledFirstButton(true)
    setSecondsRemaining(59)
  }

  useEffect(() => {
    if (
      password !== repeatPassword &&
      password.length > 0 &&
      validatePassword(password) &&
      repeatPassword.length > 0
    ) {
      setAuthRepeatError(true)
      setErrorRepeatText(CONTENT.PASSWORDS_DIFFERENT)
    } else {
      setAuthRepeatError(false)
      setErrorRepeatText("")
    }
  }, [password, repeatPassword])

  const isMobile = useMediaQuery("(max-width: 1023px)")
  const isTablet = useMediaQuery("(max-width: 1279px)")

  useEffect(() => {
    if (!validatePassword(password) && password.length > 0) {
      setAuthError(true)
      setErrorText(CONTENT.PASSWORD_EASY)
    } else {
      setAuthError(false)
      setErrorText("")
    }
  }, [password])

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
          {step === 0 ? (
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
                      validateStatus={
                        emailInvalid || emaiRegexValid ? "error" : ""
                      }
                      help={
                        emailInvalid ? (
                          <Text className={styles["error-text"]}>
                            {emailInvalidText}
                          </Text>
                        ) : emaiRegexValid ? (
                          <Text className={styles["error-mail-text"]}>
                            {email === ""
                              ? CONTENT.INPUT_ERROR_HINT
                              : CONTENT.INPUT_ERROR}
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
                          setEmail(
                            event.target.value
                              .trim()
                              .toLowerCase()
                              .replace(/\s+/g, "")
                          )
                          setEmailRegexValid(
                            validateEmail(
                              event.target.value
                                .trim()
                                .toLowerCase()
                                .replace(/\s+/g, "")
                            )
                          )
                          setEmailInvalidText("")
                          setEmailInvalid(false)
                        }}
                      />
                    </Form.Item>
                    <ButtonOne
                      onClick={resetPassword}
                      disabled={
                        emaiRegexValid ||
                        email.length === 0 ||
                        isFirstButtonDisabled
                      }
                    >
                      {isFirstLoading ? (
                        <Spin indicator={antFirstIcon} />
                      ) : (
                        CONTENT.ENTER_BUTTON
                      )}
                    </ButtonOne>
                    {isFirstButtonDisabled && (
                      <div className={styles["repeat-timer-password"]}>
                        <div className={styles["repeat-timer-password-inner"]}>
                          <Text className={styles["repeat-timer-title"]}>
                            {CONTENT.REPEAT_TIMER_TITLE}
                          </Text>
                          <Text className={styles["repeat-timer-text"]}>
                            {CONTENT.REPEAT_TIMER_DESCRIPTION}
                            <Text style={{ width: "39px" }}>
                              <Text className={styles["repeat-time-seconds"]}>
                                {" "}
                                {secondsRemaining}
                              </Text>
                              {" c."}
                            </Text>
                          </Text>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className={styles["already-wrapper"]}>
                <Link
                  className={styles["link-auth"]}
                  onClick={() => {
                    logout()
                    navigate("/login")
                  }}
                >
                  {CONTENT.AUTHORIZATION_LINK}
                </Link>
              </div>
            </div>
          ) : (
            <div className={styles["register-block-wrapper"]}>
              <div className={styles["inputs-wrapper"]}>
                <Text className={styles["heading-text"]}>
                  {CONTENT.RESET_HEADING}
                </Text>
                <div className={styles["description-block"]}>
                  <Text className={styles["description-text"]}>
                    {CONTENT.PASSWORD_DESCRIPTION}
                  </Text>
                </div>
                <div className={styles["inputs-window"]}>
                  <Form
                    form={form}
                    layout="vertical"
                    className={styles["inputs-window-form"]}
                  >
                    <div className={styles["input-item-wrapper"]}>
                      <Text className={styles["input-title"]}>
                        {CONTENT.PASSWORD_TITLE}
                      </Text>
                      <Form.Item
                        name="password"
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
                        <Input.Password
                          placeholder={CONTENT.PASSWORD_PLACEHOLDER}
                          type="password"
                          id="password"
                          visibilityToggle
                          className={styles["default-input"]}
                          autoComplete="off"
                          value={password}
                          onChange={(event) => {
                            setPassword(event.target.value.trim())
                          }}
                        />
                      </Form.Item>
                    </div>
                    <div className={styles["input-item-wrapper"]}>
                      <Text className={styles["input-title"]}>
                        {CONTENT.PASSWORD_REPEAT_TITLE}
                      </Text>
                      <Form.Item
                        name="confirm"
                        dependencies={["password"]}
                        validateStatus={authRepeatError ? "error" : ""} // Устанавливаем статус ошибки в 'error' при наличии ошибки
                        help={
                          authRepeatError ? (
                            <div>
                              <Text className={styles["error-text"]}>
                                {errorRepeatText}
                              </Text>
                            </div>
                          ) : (
                            ""
                          )
                        }
                      >
                        <Input.Password
                          id="reset-password"
                          placeholder={CONTENT.PASSWORD_PLACEHOLDER}
                          type="password"
                          visibilityToggle
                          className={styles["default-input"]}
                          autoComplete="off"
                          value={repeatPassword}
                          onChange={(event) => {
                            setRepeatPassword(event.target.value.trim())
                          }}
                        />
                      </Form.Item>
                    </div>
                  </Form>
                  <ButtonOne
                    onClick={resetPassword}
                    disabled={isButtonDisabled}
                  >
                    {isFirstLoading ? (
                      <Spin indicator={antFirstIcon} />
                    ) : (
                      CONTENT.RESET_AND_ENTER_BUTTON
                    )}
                  </ButtonOne>
                </div>
              </div>
            </div>
          )}
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
