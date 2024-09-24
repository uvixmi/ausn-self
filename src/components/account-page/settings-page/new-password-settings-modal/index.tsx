import { Form, Input, Modal, Radio, Space, Spin, Typography } from "antd"
import { NewPasswordSettingsModalProps } from "./types"
import styles from "./styles.module.scss"
import { CONTENT } from "./constants"
import cn from "classnames"
import "./styles.scss"
import { LoadingOutlined } from "@ant-design/icons"
import Cookies from "js-cookie"
import { useEffect, useRef, useState } from "react"
import { JwtPayload, jwtDecode } from "jwt-decode"
import { useDispatch, useSelector } from "react-redux"

import { useMediaQuery } from "@react-hook/media-query"
import { useAuth } from "../../../../AuthContext"
import { api, LeadReason } from "../../../../api/myApi"
import { ButtonOne } from "../../../../ui-kit/button"
import { fetchCurrentUser } from "../../../authorization-page/slice"
import { AppDispatch, RootState } from "../../../main-page/store"

export const NewPasswordSettingsModal = ({
  isOpen,
  setIsOpen,
}: NewPasswordSettingsModalProps) => {
  const { Title, Text } = Typography
  const token = Cookies.get("token")
  const headers = {
    Authorization: `Bearer ${token}`,
  }
  const isMobile = useMediaQuery("(max-width: 1023px)")

  const { login } = useAuth()

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

  const email = useSelector((state: RootState) => state.user.data.email)

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

      const dataToken = {
        username: email ? email : "",
        password: currentPassword,
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      }

      const newToken =
        await api.users.passwordChangeRequestUsersPasswordChangePost(
          dataToken,
          {
            headers,
          }
        )
      const newHeaders = { Authorization: `Bearer ${""}` }
      if (newToken.data) {
        const { access_token } = newToken.data
        const { exp } = jwtDecode(access_token)
        newHeaders.Authorization = `Bearer ${access_token}`
        if (exp) {
          const expDate = new Date(exp * 1000)
          const expiresIn = Math.floor((expDate.getTime() - Date.now()) / 1000)
        }

        const response = await api.users.passwordChangeUsersPasswordChangePut(
          data,
          { headers: newHeaders }
        )
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
          closeModal()
        } else {
          console.error("Отсутствует свойство data в ответе API.")
        }
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

  const [currentPassword, setCurrentPassword] = useState("")
  const [currentError, setCurrentError] = useState(false)
  const [currentErrorText, setCurrentErrorText] = useState("")
  useEffect(() => {
    if (!validatePassword(currentPassword) && currentPassword !== "") {
      setCurrentError(true)
      setCurrentErrorText(CONTENT.PASSWORD_ERROR)
    } else {
      setCurrentError(false)
      setCurrentErrorText("")
    }
  }, [currentPassword])

  useEffect(() => {
    if (
      password === repeatPassword &&
      validatePassword(password) &&
      validatePassword(repeatPassword) &&
      validatePassword(currentPassword) &&
      currentPassword !== ""
    )
      setIsButtonDisabled(false)
    else setIsButtonDisabled(true)
  }, [password, repeatPassword, currentPassword])
  const [hasNumbers, setHasNumbers] = useState(false)
  const [hasLetters, setHasLetters] = useState(false)
  const [hasMinLength, setMinLength] = useState(false)

  useEffect(() => {
    setHasNumbers(/\d/.test(password))
    setHasLetters(/[a-zA-Z]/.test(password))
    setMinLength(password.length >= 8)
  }, [password])

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
      onOk={() => {
        setIsOpen(false)
        setCurrentPassword("")
        setCurrentErrorText("")
        setCurrentError(false)
      }}
      onCancel={() => {
        setIsOpen(false)
        setCurrentPassword("")
        setCurrentErrorText("")
        setCurrentError(false)
      }}
      className={cn(styles["ant-modal"], "modal-new-password")}
    >
      <div className={styles["modal-style"]}>
        <div className={styles["modal-inner"]}>
          <div className={styles["payment-wrapper"]}>
            <div className={styles["images-inner"]}>
              {/*<div className={styles["images-wrapper"]}>
                <NewPasswordLogo className={styles["image-logo"]} />
                <ResetPasswordImage className={styles["image-register"]} />
              </div>*/}
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
                </div>
              </div>

              <div className={styles["input-button-inner"]}>
                <div className={styles["input-item-wrapper"]}>
                  <Text className={styles["input-title"]}>
                    {CONTENT.CURRENT_PASSWORD_TITLE}{" "}
                    <Text className={styles["necessary"]}>
                      {" " + CONTENT.NECESSARY}
                    </Text>
                  </Text>
                  <Form.Item
                    className={styles["form-password"]}
                    validateStatus={currentError ? "error" : ""} // Устанавливаем статус ошибки в 'error' при наличии ошибки
                    help={
                      currentError ? (
                        <div>
                          <Text className={styles["error-text"]}>
                            {currentErrorText}
                          </Text>
                        </div>
                      ) : (
                        ""
                      )
                    }
                  >
                    <Input.Password
                      placeholder={CONTENT.PASSWORD_PLACEHOLDER}
                      className={cn(styles["default-input"], {
                        [styles["error-input"]]: currentError,
                      })}
                      visibilityToggle
                      type="password"
                      value={currentPassword}
                      onChange={(event) => {
                        setCurrentPassword(event.target.value.trim())
                      }}
                    />
                  </Form.Item>
                </div>
                <div className={styles["divider"]}></div>
                <div className={styles["inputs-window"]}>
                  <div className={styles["input-item-wrapper"]}>
                    <Text className={styles["input-title"]}>
                      {CONTENT.PASSWORD_TITLE}
                      <Text className={styles["necessary"]}>
                        {" " + CONTENT.NECESSARY}
                      </Text>
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

                  <div className={styles["radio-wrapper"]}>
                    <Radio checked={hasNumbers}>
                      <Text className={cn(styles["text-description"])}>
                        {CONTENT.RADIO_DIGITS}
                      </Text>
                    </Radio>
                    <Radio checked={hasLetters}>
                      <Text className={cn(styles["text-description"])}>
                        {CONTENT.RADIO_LETTERS}
                      </Text>
                    </Radio>
                    <Radio checked={hasMinLength}>
                      <Text className={cn(styles["text-description"])}>
                        {CONTENT.RADIO_LENGTH}
                      </Text>
                    </Radio>
                  </div>

                  <div className={styles["input-item-wrapper"]}>
                    <Text className={styles["input-title"]}>
                      {CONTENT.PASSWORD_REPEAT_TITLE}
                      <Text className={styles["necessary"]}>
                        {" " + CONTENT.NECESSARY}
                      </Text>
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
                <div className={styles["footer-button"]}>
                  <ButtonOne
                    onClick={() => setIsOpen(false)}
                    className={styles["button-inner"]}
                    type="secondary"
                  >
                    {CONTENT.CANCEL_BUTTON}
                  </ButtonOne>
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
      </div>
    </Modal>
  )
}
