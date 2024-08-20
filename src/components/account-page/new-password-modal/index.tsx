import { Form, Input, Modal, Spin, Typography } from "antd"
import { ConfirmModalProps } from "./types"
import styles from "./styles.module.scss"
import { CONTENT } from "./constants"
import cn from "classnames"
import "./styles.scss"
import { LoadingOutlined } from "@ant-design/icons"
import Cookies from "js-cookie"
import { useEffect, useRef, useState } from "react"
import { LeadReason, api } from "../../../api/myApi"
import { MaskedInput } from "antd-mask-input"
import { ButtonOne } from "../../../ui-kit/button"
import { InputOne } from "../../../ui-kit/input"
import { ResetPasswordImage } from "../../reset-password-page/images/reset-password"
import { LogoIcon } from "../../main-page/logo-icon"
import { NewPasswordLogo } from "../../reset-password-page/images/new-password"
import { JwtPayload, jwtDecode } from "jwt-decode"
import { useAuth } from "../../../AuthContext"
import { fetchCurrentUser } from "../../authorization-page/slice"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../../main-page/store"
import { useMediaQuery } from "@react-hook/media-query"

export const NewPasswordModal = () => {
  const { Title, Text } = Typography
  const token = Cookies.get("token")
  const headers = {
    Authorization: `Bearer ${token}`,
  }
  const isMobile = useMediaQuery("(max-width: 1023px)")

  const { login } = useAuth()
  const [isOpen, setIsOpen] = useState(true)

  const [phone, setPhone] = useState("")
  const [phoneError, setPhoneError] = useState(false)
  const [isButtonDisabled, setIsButtonDisabled] = useState(true)

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

  const validatePhone = (phoneNumber: string) => {
    if (phoneNumber) {
      const strippedNumber = phoneNumber.replace(/[^\d]/g, "")
      const lengthRegex = /^\d{11}$/
      const isValidLength = lengthRegex.test(strippedNumber)
      return !isValidLength
    } else return true
  }

  const clear = () => {
    setPhoneError(false)
    validatePhone(phone) && setIsButtonDisabled(true)
  }
  const sendPhone = async () => {
    await api.users.saveUserLeadUsersLeadPut(
      { phone_number: phone.replace(/[^\d+]/g, ""), reason: LeadReason.Ens },
      {
        headers,
      }
    )
    setIsOpen(false)
    clear()
  }

  const closeModal = () => {
    setIsOpen(false)
    clear()
  }

  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")

  const [authError, setAuthError] = useState(false)
  const [errorText, setErrorText] = useState("")
  const [authRepeatError, setAuthRepeatError] = useState(false)
  const [errorRepeatText, setErrorRepeatText] = useState("")
  const dispatch = useDispatch<AppDispatch>()

  const resetPassword = async () => {
    try {
      setIsFirstLoading(true)
      const data = { new_password: password }

      const headers = {
        Authorization: `Bearer ${token}`,
      }
      const response = await api.users.passwordChangeUsersPasswordChangePut(
        data,
        { headers }
      )

      if (response.data) {
        const { token_type, access_token } = response.data
        const { exp } = jwtDecode(access_token)
        if (exp) {
          const expDate = new Date(exp * 1000)
          const expiresIn = Math.floor((expDate.getTime() - Date.now()) / 1000)
          login(access_token, expiresIn)
        } else login(access_token, 86400)
        dispatch(fetchCurrentUser())
        closeModal()
      } else {
        console.error("Отсутствует свойство data в ответе API.")
      }
    } catch (error) {
    } finally {
      setIsFirstLoading(false)
    }
  }
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d_!%@$,^&*()\-+=]{8,}$/

  const validatePassword = (password: string) => {
    return passwordRegex.test(password)
  }
  useEffect(() => {
    if (
      password === repeatPassword &&
      validatePassword(password) &&
      validatePassword(repeatPassword)
    )
      setIsButtonDisabled(false)
    else setIsButtonDisabled(true)
  }, [password, repeatPassword])

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

  useEffect(() => {
    if (!validatePassword(password) && password !== "") {
      setAuthError(true)
      setErrorText(CONTENT.PASSWORD_EASY)
    } else {
      setAuthError(false)
      setErrorText("")
    }
  }, [password])

  return (
    <Modal
      open={isOpen}
      style={{
        borderRadius: "4px",
      }}
      footer={null}
      centered
      closable={false}
      className={cn(styles["ant-modal"], "modal-new-password")}
    >
      <div className={styles["modal-style"]}>
        <div className={styles["modal-inner"]}>
          <div className={styles["payment-wrapper"]}>
            <div className={styles["images-inner"]}>
              <div className={styles["images-wrapper"]}>
                <NewPasswordLogo className={styles["image-logo"]} />
                <ResetPasswordImage className={styles["image-register"]} />
              </div>
            </div>
            <div className={styles["password-inner"]}>
              <div className={styles["heading-row"]}>
                <Text className={styles["modal-title"]}>
                  {CONTENT.HEADING_MODAL}
                </Text>
                <div className={styles["inputs-window"]}>
                  <Text className={cn(styles["text-description"])}>
                    {CONTENT.PAID_RATE_DESCRIPTION_MODAL}
                  </Text>
                  <Text className={cn(styles["text-description"])}>
                    {CONTENT.PASSWORD_DESCRIPTION}
                  </Text>
                </div>
              </div>

              <div className={styles["input-button-inner"]}>
                <div className={styles["inputs-window"]}>
                  <div className={styles["input-item-wrapper"]}>
                    <Text className={styles["input-title"]}>
                      {CONTENT.PASSWORD_TITLE}
                    </Text>
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
                      <Input.Password
                        placeholder={CONTENT.PASSWORD_PLACEHOLDER}
                        className={styles["default-input"]}
                        visibilityToggle
                        type="password"
                        value={password}
                        onChange={(event) => {
                          setPassword(event.target.value.trim())
                          setAuthError(false)
                        }}
                      />
                    </Form.Item>
                  </div>
                  <div className={styles["input-item-wrapper"]}>
                    <Text className={styles["input-title"]}>
                      {CONTENT.PASSWORD_REPEAT_TITLE}
                    </Text>
                    <Form.Item
                      className={styles["form-password"]}
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
                        placeholder={CONTENT.PASSWORD_PLACEHOLDER}
                        className={styles["default-input"]}
                        visibilityToggle
                        type="password"
                        value={repeatPassword}
                        onChange={(event) => {
                          setRepeatPassword(event.target.value.trim())
                          setAuthRepeatError(false)
                        }}
                      />
                    </Form.Item>
                  </div>
                </div>
                <ButtonOne
                  onClick={resetPassword}
                  className={styles["button-inner"]}
                  disabled={isButtonDisabled}
                >
                  {isFirstLoading ? (
                    <Spin indicator={antFirstIcon} />
                  ) : (
                    CONTENT.ENTER_BUTTON
                  )}
                </ButtonOne>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}
