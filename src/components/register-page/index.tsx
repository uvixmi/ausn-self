import { CONTENT } from "./constants"
import {
  Button,
  Input,
  Steps,
  Typography,
  ConfigProvider,
  Spin,
  Checkbox,
  Slider,
  Select,
  Modal,
  Form,
  Skeleton,
  Radio,
  Tooltip,
  Progress,
  Carousel,
} from "antd"
import styles from "./styles.module.scss"
import { useEffect, useState } from "react"
import "./styles.scss"
import { LoadingOutlined, InfoCircleOutlined } from "@ant-design/icons"
import { useMediaQuery } from "@react-hook/media-query"
import {
  InnInfo,
  api,
  HTTPValidationError,
  TaxSystemType,
  RateReasonType,
} from "../../api/myApi"
import { MaskedInput } from "antd-mask-input"
import { validateInn } from "./utils"
import { RegisterPageProps } from "./types"
import { ConfirmModal } from "./confirm-modal"
import { useNavigate } from "react-router-dom"
import { setError, setTaxSystem } from "./slice"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../main-page/store"
import Cookies from "js-cookie"
import cn from "classnames"
import { formatDateString } from "../account-page/actions-page/utils"
import { fetchCurrentUser } from "../authorization-page/slice"
import { jwtDecode } from "jwt-decode"
import { ButtonOne } from "../../ui-kit/button"
import { InputOne } from "../../ui-kit/input"
import { ResetPasswordImage } from "../reset-password-page/images/reset-password"
import { LogoIcon } from "../main-page/logo-icon"
import { SelectOne } from "../../ui-kit/select"
import { ArrowPremium } from "../reset-password-page/images/arrow-premium"
import { FirstStepper } from "../reset-password-page/images/first-stepper"
import { SecondStepper } from "../reset-password-page/images/second-stepper"
import { ThirdStepper } from "../reset-password-page/images/third-stepper"
import { LogoRegisterImage } from "../reset-password-page/images/logo-register"
import { useAuth } from "../../AuthContext"
import { validatePassword } from "../authorization-page/utils"

const { Title, Text, Link } = Typography

export const RegisterPage = ({
  registrationPage,
  currentUser,
  setTokenType,
  setAccessToken,
  setIsAuth,
  login,
}: RegisterPageProps) => {
  const isMobile = useMediaQuery("(max-width: 1023px)")
  const isTablet = useMediaQuery("(max-width: 1279px)")

  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      title: (
        <Text
          className={cn(styles["steps-title"], {
            [styles["step-active"]]: currentStep == 0,
          })}
        >
          {"Личные данные"}
        </Text>
      ),
      description: (
        <Text className={styles["steps-description"]}>
          {"Укажите ваши контактные данные"}
        </Text>
      ),
    },
    {
      title: (
        <Text
          className={cn(styles["steps-title"], {
            [styles["step-active"]]: currentStep == 1,
          })}
        >
          {"Подтверждение"}
        </Text>
      ),
      description: (
        <Text className={styles["steps-description"]}>
          {"Подтвердите почту и получите пароль"}
        </Text>
      ),
    },
    {
      title: (
        <Text
          className={cn(styles["steps-title"], {
            [styles["step-active"]]: currentStep == 2,
          })}
        >
          {"Дополнительные сведения"}
        </Text>
      ),
      description: (
        <Text className={styles["steps-description"]}>
          {"Укажите СНО и ИНН"}
        </Text>
      ),
    },
  ]

  const currentYear = new Date().getFullYear()

  const optionsYears = [
    {
      label: `${currentYear}`,
      value: currentYear,
    },
    {
      label: `${currentYear - 1}`,
      value: currentYear - 1,
    },
  ]

  const optionsSNO = [
    { label: "УСН Доходы", value: TaxSystemType.UsnD },
    {
      label: "УСН Доходы - Расходы",
      value: TaxSystemType.UsnDR,
    },
    { label: "ЕСХН", value: TaxSystemType.Eshn },
    {
      label: "Общая система НО",
      value: TaxSystemType.Osn,
    },
    {
      label: "Патент",
      value: TaxSystemType.Patent,
    },
  ]

  const { logout } = useAuth()
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [inn, setInn] = useState("")
  const [innRequest, setInnRequst] = useState("")
  const [startYear, setStartYear] = useState<number | undefined>(undefined)
  const [user, setUser] = useState<InnInfo | undefined>(undefined)
  const error = { code: 0, message: "" }

  const [sno, setSno] = useState<TaxSystemType | undefined>(undefined)

  const onChangeStep = (step: number) => {
    setCurrentStep(step)
  }

  const antFirstIcon = (
    <LoadingOutlined
      style={{
        fontSize: 24,
        color: "#fff",
      }}
      spin
    />
  )

  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 24,
      }}
      spin
    />
  )

  const [isButtonDisabled, setButtonDisabled] = useState(false)
  const [secondsRemaining, setSecondsRemaining] = useState(0)

  const [isLoading, setIsLoading] = useState(false)
  const [isInnLoaded, setIsInnLoaded] = useState(false)
  const [isInnLoadedInput, setIsInnLoadedInput] = useState(false)
  const [checkedError, setCheckedError] = useState(false)
  const [errorTextPassword, setErrorTextPassword] = useState("")

  const [emailDoubleError, setEmailDoubleError] = useState(false)
  const [emailDoubleErrorText, setEmailDoubleErrorText] = useState("")

  const [emailError, setEmailError] = useState(false)
  const [phoneError, setPhoneError] = useState(false)
  const [innError, setInnError] = useState(false)
  const [isDisabledFirstButton, setIsDisabledFirstButton] = useState(true)
  const token = Cookies.get("token")
  const headers = {
    Authorization: `Bearer ${token}`,
  }
  interface ErrorResponse {
    error: {
      detail: {
        message: string
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function isErrorResponse(obj: any): obj is ErrorResponse {
    return (
      obj &&
      obj.error &&
      obj.error.detail &&
      obj.error.detail.message !== undefined
    )
  }

  interface InnErrorResponse {
    error: {
      detail: {
        message: string
        error_key: string
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function isInnErrorResponse(obj: any): obj is InnErrorResponse {
    return (
      obj &&
      obj.error &&
      obj.error.detail &&
      obj.error.detail.message !== undefined &&
      obj.error.detail.error_key !== undefined
    )
  }

  const [isFirstLoading, setIsFirstLoading] = useState(false)
  const [isSecondLoading, setIsSecondLoading] = useState(false)
  const handleRegisterMail = async () => {
    if (email === "") {
      setEmailError(true)
    } else {
      try {
        setEmailDoubleError(false)
        setEmailDoubleErrorText("")
        setIsFirstLoading(true)
        await api.users.createUserUsersRegistrationPost({
          email: email.toLocaleLowerCase(),
          phone_number: phone,
        })

        onChangeStep(1)
        setIsFirstLoading(false)
      } catch (error) {
        setEmailDoubleError(true)
        setIsFirstLoading(false)
        if (isErrorResponse(error)) {
          // Если объект ошибки соответствует интерфейсу ErrorResponse
          setEmailDoubleErrorText(error.error.detail.message)
        }
      }
    }
  }

  const [isCheckInnDisabled, setIsCheckInnDisabled] = useState(false)

  const handleRetryMail = async () => {
    if (email === "") {
      setEmailError(true)
    } else {
      try {
        await api.users.retryEmailSendUsersRegistrationRetryPost({
          email: email.toLocaleLowerCase(),
        })
      } catch (error) {
        setEmailDoubleError(true)
        if (isErrorResponse(error)) {
          // Если объект ошибки соответствует интерфейсу ErrorResponse
          setEmailDoubleErrorText(error.error.detail.message)
        }
      }
    }
  }

  const handleCheck = async (inn: string) => {
    setIsCheckInnDisabled(true)
    setIsInnLoaded(false)
    setIsInnLoadedInput(false)
    setIsLoading(true)
    setInnRequst(inn)
    try {
      const response = await api.users.getInnInfoUsersRegistrationInnInfoGet(
        { inn },
        { headers }
      )
      setUser(response.data)

      if (user?.lastname != "" && !innError) {
        setIsInnLoaded(true)
        setIsInnLoadedInput(true)
        setIsLoading(false)
        setCheckedError(false)
      }
      setIsCheckInnDisabled(false)
    } catch (error) {
      setInnError(true)
      setIsLoading(false)
      setCheckedError(true)
      setIsInnLoaded(false)

      setIsInnLoadedInput(false)
      if (isInnErrorResponse(error)) {
        // Если объект ошибки соответствует интерфейсу ErrorResponse
        setErrorText(error.error.detail.message)
        if (error.error.detail.error_key === "inn_not_found")
          setIsCheckInnDisabled(true)
        else setIsCheckInnDisabled(false)
      } else setIsCheckInnDisabled(false)
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`
  }

  const marks3 = [
    { label: "0", value: "0%" },
    { label: "1", value: "1%" },
    { label: "2", value: "2%" },
    { label: "3", value: "3%" },
    { label: "4", value: "4%" },
    { label: "5", value: "5%" },
    { label: "6", value: "6%" },
  ]

  const marks4 = [
    { label: "0", value: "0%" },
    { label: "1", value: "1%" },
    { label: "2", value: "2%" },
    { label: "3", value: "3%" },
    { label: "4", value: "4%" },
    { label: "5", value: "5%" },
    { label: "6", value: "6%" },
    { label: "7", value: "7%" },
    { label: "8", value: "8%" },
    { label: "9", value: "9%" },
    { label: "10", value: "10%" },
    { label: "11", value: "11%" },
    { label: "12", value: "12%" },
    { label: "13", value: "13%" },
    { label: "14", value: "14%" },
    { label: "15", value: "15%" },
  ]

  const marks1 = {
    0: "0%",
    1: "1%",
    2: "2%",
    3: "3%",
    4: "4%",
    5: "5%",
    6: "6%",
  }

  const [marks, setMarks] = useState(marks1)

  const marks2 = {
    0: "0%",
    1: "1%",
    2: "2%",
    3: "3%",
    4: "4%",
    5: "5%",
    6: "6%",
    7: "7%",
    8: "8%",
    9: "9%",
    10: "10%",
    11: "11%",
    12: "12%",
    13: "13%",
    14: "14%",
    15: "15%",
  }
  const [maxSlider, setMaxSlider] = useState(6)
  useEffect(() => {
    if (sno == TaxSystemType.UsnDR) {
      setRate("15%"), setMarks(marks2), setMaxSlider(15)
    } else if (sno == TaxSystemType.UsnD) {
      setRate("6%"), setMarks(marks1), setMaxSlider(6)
    } else setRate(undefined)
  }, [sno])

  useEffect(() => {
    if (sno == TaxSystemType.UsnDR) {
      setMaxSlider(15)
    }
    if (sno == TaxSystemType.UsnD) {
      setMaxSlider(6)
    }
  }, [marks, sno])

  const [rate, setRate] = useState<string | undefined>(undefined)

  const PhoneMask = "+7 (000) 000-00-00"

  const onChangeSlider = (value: number) => {
    setRate(marks[value as keyof typeof marks])
  }

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isButtonDisabled) {
      timer = setInterval(() => {
        if (secondsRemaining > 0) {
          setSecondsRemaining((prev) => prev - 1)
        } else {
          setButtonDisabled(false)
          clearInterval(timer)
        }
      }, 1000)
    }
    return () => {
      clearInterval(timer)
    }
  }, [isButtonDisabled, secondsRemaining])

  const startTimer = () => {
    setButtonDisabled(true)
    setSecondsRemaining(59)
  }

  const validateEmail = (email: string) => {
    const emailRegex: RegExp =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i

    if (!emailRegex.test(email)) {
      return true
    }

    return false
  }

  const validatePhone = (phoneNumber: string) => {
    const strippedNumber = phoneNumber.replace(/[^\d+]/g, "")
    const lengthRegex = /^\+\d{11}$/
    const isValidLength = lengthRegex.test(strippedNumber)

    return !(isValidLength || strippedNumber.length === 2)
  }

  useEffect(() => {
    if (email === "") setIsDisabledFirstButton(true)
    else if (emailError) setIsDisabledFirstButton(true)
    else if (phone !== "" && phone !== "+7" && phoneError) {
      setIsDisabledFirstButton(true)
    } else setIsDisabledFirstButton(false)
  }, [emailError, email, phone, phoneError])

  useEffect(() => {
    if (registrationPage == 2) onChangeStep(registrationPage)
  }, [registrationPage])

  const [isOpen, setOpen] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const onEnter = async () => {
    if (sno)
      dispatch(
        setTaxSystem({
          start_year: startYear ? startYear : 0,
          tax_rate:
            sno == TaxSystemType.UsnDR && rate
              ? parseInt(rate.slice(0, -1), 10)
              : undefined,
          tax_system: sno,
          inn,
        })
      )

    if ((sno == TaxSystemType.UsnD || sno == TaxSystemType.UsnDR) && rate) {
      try {
        await api.users.saveTaxInfoUsersRegistrationTaxInfoPut(
          {
            inn,
            tax_rate: parseInt(rate.slice(0, -1), 10),
            tax_system: sno,
            start_year: startYear ? startYear : 0,
            rate_reason: selectedReason ? selectedReason : undefined,
            reason_type: selectedReasonType ? selectedReasonType : undefined,
          },
          { headers }
        )
      } catch (error) {
        setInnError(true)
        setIsInnLoaded(false)
        setIsInnLoadedInput(false)
        setCheckedError(true)
        setOpen(false)
        if (isErrorResponse(error)) {
          setErrorText(error.error.detail.message)
        }
      }
    } else navigate("/non-target")
  }

  const [disabledEnter, setDisabledEnter] = useState(true)

  const [passwordMail, setPasswordMail] = useState("")

  const [isButtonDisabledByPassword, setButtonDisabledByPassword] =
    useState(false)

  useEffect(() => {
    if (
      passwordMail !== ""
      //&& validatePassword(passwordMail)
    ) {
      setButtonDisabledByPassword(false)
    } else setButtonDisabledByPassword(true)
  }, [passwordMail])

  const [authError, setAuthError] = useState(false)
  const [errorText, setErrorText] = useState("")

  const enterAccount = async () => {
    try {
      setIsSecondLoading(true)
      const response = await api.auth.loginAuthPost({
        username: email,
        password: passwordMail,
      })

      if (response.data) {
        const { token_type, access_token } = response.data
        const { exp } = jwtDecode(access_token)
        if (exp) {
          const expDate = new Date(exp * 1000)
          const expiresIn = Math.floor((expDate.getTime() - Date.now()) / 1000)
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
        //setErrorTextPassword(error.error.detail.message)
        setErrorTextPassword("Неверный пароль")
      }
    } finally {
      setIsSecondLoading(false)
    }
  }

  const [selectedArticle, setSelectedArticle] = useState<string | undefined>("")
  const [selectedParagraph, setSelectedParagraph] = useState<
    string | undefined
  >("")
  const [selectedSubparagraph, setSelectedSubparagraph] = useState<
    string | undefined
  >("")

  useEffect(() => {
    if (
      (sno === TaxSystemType.UsnD && rate === "6%") ||
      (sno === TaxSystemType.UsnDR && rate === "15%") ||
      (sno !== TaxSystemType.UsnD && sno !== TaxSystemType.UsnDR)
    ) {
      setSelectedArticle("")
      setSelectedParagraph("")
      setSelectedSubparagraph("")
      setSelectedReason(null)
      setSelectedReasonType(null)
    }
  }, [rate, sno])

  const justificationOptions = [
    { label: "Предприниматель Крыма и Севастополя", value: "crimea" },
    { label: "Налоговые каникулы", value: "tax_holidays" },
    { label: "Другое", value: "nothing" },
  ]

  const [counterpartyError, setCounterpartyError] = useState(false)
  const [selectedReasonType, setSelectedReasonType] =
    useState<RateReasonType | null>(null)
  const [selectedReason, setSelectedReason] = useState<string | null>(null)

  useEffect(() => {
    if (selectedArticle && selectedArticle !== "")
      setSelectedReason(
        selectedArticle?.padStart(4, "0") +
          (selectedParagraph?.padStart(4, "0") || "0000") +
          (selectedSubparagraph?.padStart(4, "0") || "0000")
      )
    else setSelectedReason(null)
  }, [selectedArticle, selectedParagraph, selectedSubparagraph])

  useEffect(() => {
    if (
      ((sno === TaxSystemType.UsnD && rate === "6%") ||
        (sno === TaxSystemType.UsnDR && rate === "15%")) &&
      startYear !== 0 &&
      innError === false
    ) {
      setDisabledEnter(false)
    } else if (
      (innError === false &&
        (sno === TaxSystemType.UsnD || sno === TaxSystemType.UsnDR) &&
        rate !== null &&
        selectedReason !== null &&
        selectedReasonType !== null &&
        startYear !== 0) ||
      ((sno === TaxSystemType.Eshn ||
        sno === TaxSystemType.Osn ||
        sno === TaxSystemType.Patent) &&
        startYear !== 0)
    )
      setDisabledEnter(false)
    else setDisabledEnter(true)
  }, [innError, rate, selectedReason, selectedReasonType, sno, startYear])

  const clearFirstPage = () => {
    setPhone("")
    setPhoneError(false)
    setEmail("")
    setEmailError(false)
    setEmailDoubleError(false)
  }

  return (
    <>
      <ConfigProvider
        theme={{
          token: {
            colorLink: "#505050",
            colorPrimary: "#6159ff",
            fontFamily: "Inter",
          },
          components: {
            Steps: {
              colorPrimary: "#6159ff",
              colorPrimaryActive: "#6159ff",
              colorBgLayout: "#F0F0FF",
            },
            Progress: {
              defaultColor: "#6159ff",
            },
            Radio: {
              colorText: "#6159ff",
            },
          },
        }}
      >
        <div className={styles["content-wrapper"]}>
          <div className={styles["register-logo-wrapper"]}>
            {isTablet ? (
              <div className={styles["logo-stepper"]}>
                <LogoRegisterImage className={styles["logo-wrapper"]} />
                {currentStep === 0 ? (
                  <FirstStepper />
                ) : currentStep === 1 ? (
                  <SecondStepper />
                ) : currentStep === 2 ? (
                  <ThirdStepper />
                ) : null}
              </div>
            ) : (
              <LogoRegisterImage
                className={cn(styles["logo-wrapper"], {
                  [styles["logo-wrapper-third"]]: currentStep === 2,
                })}
              />
            )}
            {isTablet && !isMobile ? (
              <ResetPasswordImage className={styles["image-register"]} />
            ) : null}
            <div className={styles["register-block-wrapper"]}>
              <div className={styles["register-logo"]}>
                <div className={styles["inputs-wrapper"]}>
                  <Text className={styles["heading-text"]}>
                    {CONTENT.REGISTRATION_HEADING}
                  </Text>
                  {currentStep == 0 && (
                    <>
                      <div className={styles["inputs-window"]}>
                        <div className={styles["input-item-wrapper"]}>
                          <Text className={styles["input-title-text"]}>
                            {CONTENT.EMAIL_TITLE}

                            <Text className={styles["necessary"]}>
                              {CONTENT.NECESSARY}
                            </Text>
                          </Text>
                          <Form.Item
                            className={styles["form-password"]}
                            validateStatus={
                              emailDoubleError || emailError ? "error" : ""
                            }
                            help={
                              emailDoubleError ? (
                                <div>
                                  <Text className={styles["error-mail-text"]}>
                                    {emailDoubleErrorText}
                                  </Text>
                                </div>
                              ) : emailError ? (
                                <Text className={styles["error-mail-text"]}>
                                  {email === ""
                                    ? CONTENT.INPUT_ERROR_HINT
                                    : CONTENT.INPUT_FAULT_HINT}
                                </Text>
                              ) : (
                                ""
                              )
                            }
                          >
                            <InputOne
                              value={email}
                              onChange={(event) => {
                                setEmail(
                                  event.target.value.trim().replace(/\s+/g, "")
                                )
                                setEmailError(
                                  validateEmail(
                                    event.target.value
                                      .trim()
                                      .replace(/\s+/g, "")
                                  )
                                )
                                setEmailDoubleError(false)
                              }}
                              placeholder={CONTENT.EMAIL_PLACEHOLDER}
                            />
                          </Form.Item>
                        </div>

                        <div className={styles["input-item-wrapper"]}>
                          <Text className={styles["input-title-text"]}>
                            {CONTENT.PHONE_TITLE}
                          </Text>
                          <Form.Item
                            className={styles["form-password"]}
                            validateStatus={phoneError ? "error" : ""}
                            help={
                              phoneError ? (
                                <Text className={styles["error-mail-text"]}>
                                  {CONTENT.INPUT_FAULT_HINT}
                                </Text>
                              ) : null
                            }
                          >
                            <MaskedInput
                              mask={PhoneMask}
                              className={styles["input-item"]}
                              value={phone}
                              onChange={(event) => {
                                setPhone(event.target.value)
                                setPhoneError(validatePhone(event.target.value))
                              }}
                              placeholder={CONTENT.PHONE_PLACEHOLDER}
                              status={phoneError ? "error" : undefined}
                            ></MaskedInput>
                          </Form.Item>
                        </div>
                      </div>
                      <ButtonOne
                        disabled={isDisabledFirstButton}
                        onClick={handleRegisterMail}
                        //onClick={() => onChangeStep(1)}
                      >
                        {isFirstLoading ? (
                          <Spin indicator={antFirstIcon} />
                        ) : (
                          CONTENT.CONTINUE_BUTTON
                        )}
                      </ButtonOne>
                      <div className={styles["links-wrapper"]}>
                        <Text className={styles["oferta-description"]}>
                          {CONTENT.REGISTRATION_TEXT_ONE}
                          <Text className={styles["continue-button"]}>
                            {CONTENT.CONTINUE_BUTTON}
                          </Text>
                          {CONTENT.REGISTRATION_TEXT_TWO}
                        </Text>
                      </div>
                      {currentStep == 0 && !isTablet ? (
                        <div className={styles["links-wrapper"]}>
                          <Text className={styles["oferta-description"]}>
                            {CONTENT.OFERTA_REGISTER_ONE}
                            <Text className={styles["continue-button"]}>
                              {CONTENT.CONTINUE_BUTTON}
                            </Text>
                            {CONTENT.OFERTA_REGISTER_ONE_TWO}
                            <Link
                              className={styles["link-oferta"]}
                              target="_blink"
                              href="https://docs.google.com/document/d/1wyphbddHpr1hvZpQzwkQ29sUUiRZnRh7/"
                            >
                              {CONTENT.OFERTA_LINK}
                            </Link>
                            {CONTENT.OFERTA_REGISTER_TWO}
                            <Link
                              className={styles["link-oferta"]}
                              target="_blink"
                              href="https://docs.google.com/document/d/1LgOipJN6Zg8FRWuCUbis7LwfF4y8znCP/"
                            >
                              {CONTENT.PERSONAL_DATA_LINK}
                            </Link>
                          </Text>
                        </div>
                      ) : null}
                    </>
                  )}
                  {currentStep == 1 && (
                    <>
                      <div className={styles["text-mail-wrapper"]}>
                        <Text className={styles["oferta-description"]}>
                          {CONTENT.MAIL_SENT_FIRST}{" "}
                          <Text className={styles["text-bold-in"]}>
                            {email}
                          </Text>
                        </Text>
                        <div className={styles["text-mail-second"]}>
                          <Text className={styles["oferta-description"]}>
                            {CONTENT.MAIL_SENT_SECOND}
                          </Text>
                          <Text className={styles["oferta-description"]}>
                            {CONTENT.MAIL_SENT_THIRD}
                          </Text>
                        </div>
                      </div>
                      <div className={styles["password-mail-wrapper"]}>
                        <div>
                          <Text className={styles["text-password-mail-title"]}>
                            {CONTENT.PASSWORD_MAIL_TEXT}
                            <Text className={styles["necessary"]}>
                              {CONTENT.NECESSARY}
                            </Text>
                          </Text>
                          <Form.Item
                            className={styles["form-password"]}
                            validateStatus={authError ? "error" : ""} // Устанавливаем статус ошибки в 'error' при наличии ошибки
                            help={
                              authError ? (
                                <div>
                                  <Text className={styles["error-text"]}>
                                    {errorTextPassword}
                                  </Text>
                                </div>
                              ) : (
                                ""
                              )
                            }
                          >
                            <Input.Password
                              placeholder={CONTENT.PASSWORD_MAIL_PLACEHOLDER}
                              visibilityToggle
                              value={passwordMail}
                              className={styles["default-input"]}
                              type="password"
                              onChange={(event) => {
                                setPasswordMail(event.target.value)
                                setAuthError(false)
                                setErrorTextPassword("")
                              }}
                            />
                          </Form.Item>
                        </div>
                        <div className={styles["link_timer"]}>
                          <Link
                            className={cn(styles["link-oferta"], {
                              [styles["link-disabled"]]: isButtonDisabled,
                            })}
                            onClick={() => {
                              startTimer()
                              handleRetryMail()
                            }}
                            disabled={isButtonDisabled}
                          >
                            {CONTENT.BUTTON_ONE_MORE_MAIL}
                          </Link>
                          {isButtonDisabled && (
                            <Text className={styles["repeat-time"]}>
                              {CONTENT.TIMER_REPEAT}{" "}
                              <Text style={{ width: "39px" }}>
                                <Text className={styles["repeat-time-seconds"]}>
                                  {" "}
                                  {secondsRemaining}
                                </Text>
                                {" c."}
                              </Text>
                            </Text>
                          )}
                        </div>
                      </div>
                      <div className={styles["buttons-wrapper"]}>
                        <ButtonOne
                          onClick={() => {
                            clearFirstPage()
                            onChangeStep(0) //, navigate("/login")
                          }}
                          className={styles["button-back"]}
                          type="secondary"
                        >
                          {CONTENT.BUTTON_BACK}
                        </ButtonOne>
                        <ButtonOne
                          className={styles["button-item-wide"]}
                          disabled={isButtonDisabledByPassword}
                          onClick={enterAccount}
                          //onClick={() => {
                          // onChangeStep(2) //, navigate("/login")
                          // }}
                        >
                          {isSecondLoading ? (
                            <Spin indicator={antFirstIcon} />
                          ) : (
                            CONTENT.CONTINUE_BUTTON
                          )}

                          {/*
                      onClick={startTimer}
                      isButtonDisabled &&
                        ` через (${formatTime(secondsRemaining)})`*/}
                        </ButtonOne>
                      </div>
                    </>
                  )}
                  {currentStep == 2 && (
                    <div className={styles["inn-inner-registration"]}>
                      <Text className={styles["text-input-title"]}>
                        {CONTENT.INN}
                        <Text className={styles["necessary"]}>
                          {CONTENT.NECESSARY}
                        </Text>
                      </Text>
                      <div className={styles["inn-wrapper"]}>
                        <Form.Item
                          className={styles["input-inn-check"]}
                          validateStatus={checkedError ? "error" : ""} // Устанавливаем статус ошибки в 'error' при наличии ошибки
                          help={
                            checkedError || innError ? (
                              <div>
                                <Text className={styles["error-text"]}>
                                  {inn.length > 0
                                    ? errorText
                                    : CONTENT.INPUT_ERROR_HINT}
                                </Text>
                              </div>
                            ) : (
                              ""
                            )
                          }
                        >
                          <InputOne
                            placeholder={CONTENT.INPUT_PLACEHOLDER}
                            disabled={isLoading}
                            maxLength={12}
                            className={cn(styles["input-inn-check"], {
                              [styles["input-inn-completed"]]: isInnLoadedInput,
                            })}
                            value={inn}
                            onChange={(event) => {
                              const input = event.target.value
                              const numericInput = input.replace(/[^0-9]/g, "")
                              setIsInnLoadedInput(false)
                              setSno(undefined)
                              setStartYear(undefined)
                              setRate(undefined)
                              setInn(numericInput)
                              setErrorText("")
                              setIsCheckInnDisabled(validateInn(input, error))
                              setInnError(validateInn(input, error))
                              if (validateInn(input, error))
                                setErrorText(CONTENT.INPUT_FAULT_HINT)
                              //setErrorText(error.message)
                              setCheckedError(false)
                            }}
                            status={innError ? "error" : undefined}
                          />
                        </Form.Item>

                        <ButtonOne
                          className={styles["button-item-check"]}
                          onClick={() => handleCheck(inn)}
                          type="secondary"
                          disabled={isCheckInnDisabled || inn.length === 0}
                        >
                          {isLoading ? (
                            <Spin indicator={antIcon} />
                          ) : (
                            CONTENT.BUTTON_CHECK
                          )}
                        </ButtonOne>
                      </div>

                      <div className={styles["loader-wrapper"]}>
                        <div className={styles["loader-text-block"]}>
                          <div className={styles["text-row"]}>
                            <Text
                              className={cn(styles["text-input-title"], {
                                [styles["already-text"]]: !isInnLoaded,
                              })}
                            >
                              {CONTENT.NAME}
                            </Text>
                            {isInnLoaded ? (
                              <Text
                                className={cn(styles["row-right"], {
                                  [styles["text-title-person"]]:
                                    innRequest.length === 12,
                                  [styles["text-title-person-ooo"]]:
                                    innRequest.length === 10,
                                })}
                              >
                                {innRequest.length === 12
                                  ? "ИП " +
                                    user?.lastname +
                                    " " +
                                    user?.firstname +
                                    " " +
                                    user?.patronymic
                                  : user?.full_name}
                              </Text>
                            ) : isLoading ? (
                              <Skeleton.Input
                                active
                                className="skeleton-custom"
                                style={{
                                  width: "100%",
                                  height: "12px",
                                  display: "flex",
                                }}
                              />
                            ) : null}
                          </div>
                          <div className={styles["text-row"]}>
                            <Text
                              className={cn(styles["text-input-title"], {
                                [styles["already-text"]]: !isInnLoaded,
                              })}
                            >
                              {CONTENT.DATE_REGISTRATION}
                            </Text>
                            {isInnLoaded ? (
                              <Text
                                className={cn(
                                  styles["row-right"],
                                  styles["text-title-person"]
                                )}
                              >
                                {formatDateString(user?.fns_reg_date)}
                              </Text>
                            ) : isLoading ? (
                              <Skeleton.Input
                                className="skeleton-custom"
                                active
                                style={{
                                  width: "100%",
                                  height: "12px",
                                  display: "flex",
                                }}
                              />
                            ) : null}
                          </div>
                        </div>
                        <div className={styles["select-row-item"]}>
                          <Text
                            className={cn(styles["text-input-title"], {
                              [styles["already-text"]]: !isInnLoaded,
                            })}
                          >
                            {"Год, с которого вести учет в сервисе"}
                            {isInnLoaded && (
                              <Text className={styles["necessary"]}>
                                {" " + CONTENT.NECESSARY}
                              </Text>
                            )}
                          </Text>
                          <div className="custom-select-register">
                            <SelectOne
                              disabled={!isInnLoaded}
                              className={cn(styles["select-row"])}
                              options={optionsYears}
                              value={startYear}
                              placeholder={CONTENT.SELECT_PLACEHOLDER}
                              onChange={(value) => setStartYear(value)}
                              dropdownRender={(menu) => (
                                <div className="custom-select-register">
                                  {menu}
                                </div>
                              )}
                            />
                          </div>
                        </div>

                        <div className={styles["select-row-item"]}>
                          <Text
                            className={cn(styles["text-input-title"], {
                              [styles["already-text"]]: !isInnLoaded,
                            })}
                          >
                            {"Система налогообложения"}
                            {isInnLoaded && (
                              <Text className={styles["necessary"]}>
                                {" " + CONTENT.NECESSARY}
                              </Text>
                            )}
                          </Text>
                          <SelectOne
                            disabled={!isInnLoaded}
                            className={cn(styles["select-row"])}
                            options={optionsSNO}
                            placeholder={CONTENT.SELECT_PLACEHOLDER}
                            value={sno}
                            onChange={(value) => setSno(value)}
                            dropdownRender={(menu) => (
                              <div className="custom-select-register">
                                {menu}
                              </div>
                            )}
                          />
                        </div>
                      </div>

                      {(sno == TaxSystemType.UsnD ||
                        sno == TaxSystemType.UsnDR) &&
                        rate && (
                          <div
                            className={cn(
                              styles["rate-wrapper-outer-standart"]
                              /*, {
                            [styles["rate-wrapper-outer"]]:
                              (sno === TaxSystemType.UsnD &&
                                rate !== null &&
                                rate &&
                                parseInt(rate.slice(0, -1), 10) < 6) ||
                              (sno === TaxSystemType.UsnDR &&
                                rate !== null &&
                                rate &&
                                parseInt(rate.slice(0, -1), 10) < 15),
                          }
                                */
                            )}
                          >
                            <div
                              className={cn(
                                styles["rate-wrapper"],
                                styles["rate-wrapper-inner-standart"]
                                /* {
                                [styles["rate-wrapper-inner-standart"]]:
                                  (sno === TaxSystemType.UsnD &&
                                    rate !== null &&
                                    rate &&
                                    parseInt(rate.slice(0, -1), 10) == 6) ||
                                  (sno === TaxSystemType.UsnDR &&
                                    rate !== null &&
                                    rate &&
                                    parseInt(rate.slice(0, -1), 10) == 15),
                              }*/
                              )}
                            >
                              <div className={styles["slider-style"]}>
                                {/*(sno === TaxSystemType.UsnD &&
                                rate !== null &&
                                rate &&
                                parseInt(rate.slice(0, -1), 10) < 6) ||
                              (sno === TaxSystemType.UsnDR &&
                                rate !== null &&
                                rate &&
                                parseInt(rate.slice(0, -1), 10) < 15) ? (
                                <>
                                  {" "}
                                  <div className={styles["premium-badge"]}>
                                    <Text className={styles["premium-title"]}>
                                      {"Доступно на платном тарифе"}
                                    </Text>
                                    <Text className={styles["premium-title"]}>
                                      {"После регистрации бесплатно 30 дней"}
                                    </Text>
                                  </div>
                                  <ArrowPremium
                                    className={styles["premium-arrow"]}
                                  />
                                </>
                              ) : null */}
                                <Text className={styles["rate-title"]}>
                                  {"Ставка налогообложения, % "}
                                </Text>

                                {/*Slider
                                  dots
                                  onChange={onChangeSlider}
                                  defaultValue={6}
                                  max={maxSlider}
                                  // value={parseInt(rate.slice(0, -1))}
                                />*/}

                                {sno == TaxSystemType.UsnD ? (
                                  <Radio.Group
                                    options={marks3}
                                    onChange={(value) => {
                                      setRate(value.target.value)
                                    }}
                                    value={rate}
                                    optionType="button"
                                    buttonStyle="solid"
                                    className={cn(
                                      "custom-radio",
                                      styles["radio-group"]
                                    )}
                                    style={{ width: "100%" }}
                                  />
                                ) : sno == TaxSystemType.UsnDR ? (
                                  <Radio.Group
                                    options={marks4}
                                    onChange={(value) =>
                                      setRate(value.target.value)
                                    }
                                    value={rate}
                                    optionType="button"
                                    buttonStyle="solid"
                                    className={cn(
                                      "custom-radio",
                                      styles["radio-group"]
                                    )}
                                    style={{ width: "100%" }}
                                  />
                                ) : null}
                              </div>

                              {((sno === TaxSystemType.UsnD &&
                                rate !== null &&
                                rate &&
                                parseInt(rate.slice(0, -1), 10) < 6) ||
                                (sno === TaxSystemType.UsnDR &&
                                  rate !== null &&
                                  rate &&
                                  parseInt(rate.slice(0, -1), 10) < 15)) && (
                                <>
                                  <div style={{ display: "flex", gap: "8px" }}>
                                    <Text className={styles["rate-title"]}>
                                      {CONTENT.JUSTIFICATION_TITLE}
                                    </Text>
                                    <Tooltip
                                      title={
                                        <div
                                          className={
                                            styles["just-description-inner"]
                                          }
                                        >
                                          <Text
                                            className={cn(
                                              styles["just-description"]
                                            )}
                                          >
                                            {
                                              CONTENT.FIRST_JUSTIFICATION_DESCRIPTION
                                            }
                                          </Text>
                                          <Text
                                            className={cn(
                                              styles["just-description"]
                                            )}
                                          >
                                            {
                                              CONTENT.SECOND_JUSTIFICATION_DESCRIPTION
                                            }
                                          </Text>
                                        </div>
                                      }
                                    >
                                      <InfoCircleOutlined
                                        className={styles["info-icon-amount"]}
                                      />
                                    </Tooltip>
                                  </div>
                                  <div>
                                    <div
                                      className={styles["input-item-justify"]}
                                    >
                                      <Text
                                        className={styles["text-input-title"]}
                                      >
                                        {CONTENT.SELECT_JUSTIFICATION_TITLE}
                                        <Text className={styles["necessary"]}>
                                          {" " + CONTENT.NECESSARY}
                                        </Text>
                                      </Text>
                                      <Form.Item
                                        className={styles["form-inn"]}
                                        validateStatus={
                                          counterpartyError ? "error" : ""
                                        } // Устанавливаем статус ошибки в 'error' при наличии ошибки
                                        help={
                                          counterpartyError ? (
                                            <div>
                                              <Text
                                                className={styles["error-text"]}
                                              >
                                                {
                                                  CONTENT.SELECT_JUSTIFICATION_TITLE
                                                }
                                              </Text>
                                            </div>
                                          ) : (
                                            ""
                                          )
                                        }
                                      >
                                        <SelectOne
                                          value={selectedReasonType}
                                          className="custom-select-register"
                                          options={justificationOptions}
                                          placeholder={
                                            CONTENT.SELECT_PLACEHOLDER
                                          }
                                          onChange={(value) => {
                                            setSelectedReasonType(value)
                                          }}
                                          dropdownRender={(menu) => (
                                            <div className="custom-select-register">
                                              {menu}
                                            </div>
                                          )}
                                        />
                                      </Form.Item>
                                    </div>

                                    <div className={styles["inputs-row"]}>
                                      <div
                                        className={styles["input-item-justify"]}
                                      >
                                        <Text
                                          className={cn(
                                            styles["text-description"],
                                            styles["default-text"]
                                          )}
                                        >
                                          {CONTENT.INPUT_ARTICLE_TITLE}
                                          <Text className={styles["necessary"]}>
                                            {" " + CONTENT.NECESSARY}
                                          </Text>
                                        </Text>
                                        <Form.Item
                                          className={styles["form-inn"]}
                                          validateStatus={
                                            counterpartyError ? "error" : ""
                                          } // Устанавливаем статус ошибки в 'error' при наличии ошибки
                                          help={
                                            counterpartyError ? (
                                              <div>
                                                <Text
                                                  className={
                                                    styles["error-text"]
                                                  }
                                                >
                                                  {CONTENT.INPUT_ARTICLE_TITLE}
                                                </Text>
                                              </div>
                                            ) : (
                                              ""
                                            )
                                          }
                                        >
                                          <InputOne
                                            placeholder={
                                              CONTENT.INPUT_PLACEHOLDER
                                            }
                                            value={selectedArticle}
                                            onChange={(event) => {
                                              const inputValue =
                                                event.target.value.replace(
                                                  /[^\d./-]/g,
                                                  ""
                                                )
                                              setSelectedArticle(inputValue)
                                            }}
                                            maxLength={4}
                                          />
                                        </Form.Item>
                                      </div>
                                      <div
                                        className={styles["input-item-justify"]}
                                      >
                                        <Text
                                          className={cn(
                                            styles["text-description"],
                                            styles["default-text"]
                                          )}
                                        >
                                          {CONTENT.INPUT_PARAGRAPH_TITLE}
                                        </Text>
                                        <Form.Item
                                          className={styles["form-inn"]}
                                          validateStatus={
                                            counterpartyError ? "error" : ""
                                          } // Устанавливаем статус ошибки в 'error' при наличии ошибки
                                          help={
                                            counterpartyError ? (
                                              <div>
                                                <Text
                                                  className={
                                                    styles["error-text"]
                                                  }
                                                >
                                                  {
                                                    CONTENT.INPUT_PARAGRAPH_TITLE
                                                  }
                                                </Text>
                                              </div>
                                            ) : (
                                              ""
                                            )
                                          }
                                        >
                                          <InputOne
                                            placeholder={
                                              CONTENT.INPUT_PLACEHOLDER
                                            }
                                            value={selectedParagraph}
                                            onChange={(event) => {
                                              const inputValue =
                                                event.target.value.replace(
                                                  /[^\d./-]/g,
                                                  ""
                                                )
                                              setSelectedParagraph(inputValue)
                                            }}
                                            maxLength={4}
                                          />
                                        </Form.Item>
                                      </div>
                                      <div
                                        className={styles["input-item-justify"]}
                                      >
                                        <Text
                                          className={cn(
                                            styles["text-description"],
                                            styles["default-text"]
                                          )}
                                        >
                                          {CONTENT.INPUT_SUBPARAGRAPH_TITLE}
                                        </Text>
                                        <Form.Item
                                          className={styles["form-inn"]}
                                          validateStatus={
                                            counterpartyError ? "error" : ""
                                          } // Устанавливаем статус ошибки в 'error' при наличии ошибки
                                          help={
                                            counterpartyError ? (
                                              <div>
                                                <Text
                                                  className={
                                                    styles["error-text"]
                                                  }
                                                >
                                                  {
                                                    CONTENT.INPUT_SUBPARAGRAPH_TITLE
                                                  }
                                                </Text>
                                              </div>
                                            ) : (
                                              ""
                                            )
                                          }
                                        >
                                          <InputOne
                                            placeholder={
                                              CONTENT.INPUT_PLACEHOLDER
                                            }
                                            value={selectedSubparagraph}
                                            onChange={(event) => {
                                              const inputValue =
                                                event.target.value.replace(
                                                  /[^\d./-]/g,
                                                  ""
                                                )
                                              setSelectedSubparagraph(
                                                inputValue
                                              )
                                            }}
                                            maxLength={4}
                                          />
                                        </Form.Item>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      <div className={styles["button-one"]}>
                        <ButtonOne
                          className={styles["button-item-enter"]}
                          disabled={disabledEnter}
                          //onClick={onEnter}

                          onClick={() => setOpen(true)}
                        >
                          {CONTENT.BUTTON_ENTER}
                        </ButtonOne>
                      </div>
                      <div className={styles["rate-description-wrapper"]}>
                        <Text className={styles["rate-description"]}>
                          {CONTENT.OFERTA_TEXT_ONE}
                          <Text className={styles["continue-rate"]}>
                            {CONTENT.BUTTON_ENTER}
                          </Text>
                          {CONTENT.OFERTA_TEXT_TWO}
                          <Link
                            className={styles["rate-link"]}
                            target="_blink"
                            href="https://docs.google.com/document/d/1wyphbddHpr1hvZpQzwkQ29sUUiRZnRh7/"
                          >
                            {CONTENT.OFERTA_LINK_ONE}
                          </Link>
                          {CONTENT.TEXT_AND}
                          <Link
                            className={styles["rate-link"]}
                            target="_blink"
                            href="https://docs.google.com/document/d/1LgOipJN6Zg8FRWuCUbis7LwfF4y8znCP/"
                          >
                            {CONTENT.OFERTA_LINK_TWO}
                          </Link>
                        </Text>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {currentStep < 3 && (
                <div className={styles["already-wrapper"]}>
                  <Text className={styles["already-text"]}>
                    {CONTENT.ALREADY_HAVE}
                  </Text>
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
              )}
            </div>
          </div>
          {!isTablet && (
            <div className={styles["stepper-wrapper"]}>
              <ResetPasswordImage className={styles["image-register"]} />
              <Steps
                direction="vertical"
                current={currentStep}
                //onChange={onChangeStep}
                className={cn(styles["stepper-inner"], "custom-steps")}
                percent={60}
                items={steps}
              />
            </div>
          )}
        </div>
        <ConfirmModal isOpen={isOpen} setOpen={setOpen} onEnter={onEnter} />
      </ConfigProvider>
    </>
  )
}
