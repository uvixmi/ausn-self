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
} from "antd"
import styles from "./styles.module.scss"
import { useEffect, useState } from "react"
import { LoadingOutlined } from "@ant-design/icons"
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

const { Title, Text, Link } = Typography

export const RegisterPage = ({
  registrationPage,
  currentUser,
  setTokenType,
  setAccessToken,
  setIsAuth,
  login,
}: RegisterPageProps) => {
  const isMobile = useMediaQuery("(max-width: 767px)")

  const navigate = useNavigate()

  const steps = [
    {
      title: "Регистрация",
      description: "Укажите ваши контактные данные",
    },
    {
      title: "Подтверждение",
      description: "Подтвердите почту и получите пароль",
    },
    {
      title: "Дополнительные сведения",
      description: "Укажите СНО и ИНН",
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
    { label: "Патент", value: TaxSystemType.Eshn },
    {
      label: "Общая система НО",
      value: TaxSystemType.Osn,
    },
  ]

  const [currentStep, setCurrentStep] = useState(0)
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [inn, setInn] = useState("")
  const [innRequest, setInnRequst] = useState("")
  const [startYear, setStartYear] = useState(0)
  const [user, setUser] = useState<InnInfo | undefined>(undefined)
  const error = { code: 0, message: "" }

  const [sno, setSno] = useState<TaxSystemType | undefined>(undefined)

  const onChangeStep = (step: number) => {
    setCurrentStep(step)
  }

  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 24,
      }}
      spin
    />
  )

  const [isButtonDisabled, setButtonDisabled] = useState(true)
  const [secondsRemaining, setSecondsRemaining] = useState(0)

  const [isLoading, setIsLoading] = useState(false)
  const [isInnLoaded, setIsInnLoaded] = useState(false)
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

  const handleRegisterMail = async () => {
    if (email === "") {
      setEmailError(true)
    } else {
      try {
        await api.users.createUserUsersRegistrationPost({
          email: email.toLocaleLowerCase(),
          phone_number: phone,
        })
        onChangeStep(1)
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
        setIsLoading(false)
        setCheckedError(false)
      }
    } catch (error) {
      setInnError(true)
      setIsLoading(false)
      setCheckedError(true)
      if (isErrorResponse(error)) {
        // Если объект ошибки соответствует интерфейсу ErrorResponse
        setErrorText(error.error.detail.message)
      }
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`
  }

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
  }, [marks])

  const [rate, setRate] = useState<string | undefined>(undefined)

  const PhoneMask = "+7 (000) 000-00-00"

  const onChangeSlider = (value: number) => {
    setRate(marks[value as keyof typeof marks])
  }
  /*
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

  useEffect(() => {
    startTimer()
  }, [currentStep])
  

  const startTimer = () => {
    setButtonDisabled(true)
    setSecondsRemaining(10)
  }
  */

  const validateEmail = (email: string) => {
    // Регулярное выражение для проверки формата email
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
    return !(isValidLength || strippedNumber.length === 1)
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
          start_year: startYear,
          tax_rate:
            sno == TaxSystemType.UsnDR && rate
              ? parseInt(rate.slice(0, -1), 10)
              : undefined,
          tax_system: sno,
          inn,
        })
      )

    if (sno == TaxSystemType.UsnD && rate) {
      await api.users.saveTaxInfoUsersRegistrationTaxInfoPut(
        {
          inn,
          tax_rate: parseInt(rate.slice(0, -1), 10),
          tax_system: sno,
          start_year: startYear,
          rate_reason: selectedReason ? selectedReason : undefined,
          reason_type: selectedReasonType ? selectedReasonType : undefined,
        },
        { headers }
      )
      setOpen(true)
    } else navigate("/non-target")
  }

  const [disabledEnter, setDisabledEnter] = useState(true)

  const [passwordMail, setPasswordMail] = useState("")

  useEffect(() => {
    if (passwordMail !== "") setButtonDisabled(false)
    else setButtonDisabled(true)
  }, [passwordMail])

  const [authError, setAuthError] = useState(false)
  const [errorText, setErrorText] = useState("")

  const enterAccount = async () => {
    try {
      const response = await api.auth.loginAuthPost({
        username: email,
        password: passwordMail,
      })

      if (response.data) {
        const { token_type, access_token } = response.data

        login(access_token, 3600)
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
        setErrorTextPassword(error.error.detail.message)
      }
    }
  }

  const [selectedArticle, setSelectedArticle] = useState<string | undefined>("")
  const [selectedParagraph, setSelectedParagraph] = useState<
    string | undefined
  >("")
  const [selectedSubparagraph, setSelectedSubparagraph] = useState<
    string | undefined
  >("")

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

  return (
    <>
      <ConfigProvider
        theme={{
          token: {
            colorLink: "#505050",
            colorPrimary: "#6159ff",
          },
        }}
      >
        <div className={styles["content-wrapper"]}>
          <div className={styles["register-block-wrapper"]}>
            {isMobile && (
              <div className={styles["stepper-wrapper"]}>
                <Steps
                  direction="horizontal"
                  current={currentStep}
                  responsive={false}
                  size="small"
                  labelPlacement="vertical"
                  //onChange={onChangeStep}
                  className={styles["stepper-inner"]}
                  percent={currentStep == 1 ? 60 : undefined}
                  items={steps}
                />
              </div>
            )}
            <div className={styles["inputs-wrapper"]}>
              <Title level={1}>{CONTENT.REGISTRATION_HEADING}</Title>
              {currentStep == 0 && (
                <>
                  <div className={styles["inputs-window"]}>
                    <div className={styles["input-item-wrapper"]}>
                      <Text>{CONTENT.EMAIL_TITLE}</Text>
                      <Form.Item
                        className={styles["form-password"]}
                        validateStatus={emailDoubleError ? "error" : ""} // Устанавливаем статус ошибки в 'error' при наличии ошибки
                        help={
                          emailDoubleError ? (
                            <div>
                              <Text className={styles["error-mail-text"]}>
                                {emailDoubleErrorText}
                              </Text>
                            </div>
                          ) : (
                            ""
                          )
                        }
                      >
                        <Input
                          className={styles["input-item"]}
                          value={email}
                          onChange={(event) => {
                            setEmail(event.target.value),
                              setEmailError(validateEmail(event.target.value)),
                              setEmailDoubleError(false)
                          }}
                          placeholder={CONTENT.EMAIL_PLACEHOLDER}
                          status={emailError ? "error" : undefined}
                        />
                      </Form.Item>
                    </div>
                    <div className={styles["input-item-wrapper"]}>
                      <Text>{CONTENT.PHONE_TITLE}</Text>
                      <MaskedInput
                        mask={PhoneMask}
                        className={styles["input-item"]}
                        value={phone}
                        onChange={(event) => {
                          setPhone(event.target.value),
                            setPhoneError(validatePhone(event.target.value))
                        }}
                        placeholder={CONTENT.PHONE_PLACEHOLDER}
                        status={phoneError ? "error" : undefined}
                      ></MaskedInput>
                    </div>
                  </div>
                  <Button
                    className={styles["button-item"]}
                    disabled={isDisabledFirstButton}
                    onClick={handleRegisterMail}
                  >
                    {CONTENT.CONTINUE_BUTTON}
                  </Button>
                  <div className={styles["links-wrapper"]}>
                    <Text>{CONTENT.REGISTRATION_TEXT}</Text>
                  </div>
                  <div className={styles["links-wrapper"]}>
                    <Text className={styles["oferta-description"]}>
                      {CONTENT.OFERTA_REGISTER_ONE}
                      <Link
                        className={styles["link-oferta"]}
                        target="_blink"
                        underline
                        href="https://docs.google.com/document/d/1wyphbddHpr1hvZpQzwkQ29sUUiRZnRh7/"
                      >
                        {CONTENT.OFERTA_LINK}
                      </Link>
                      {CONTENT.OFERTA_REGISTER_TWO}
                      <Link
                        className={styles["link-oferta"]}
                        target="_blink"
                        underline
                        href="https://docs.google.com/document/d/1LgOipJN6Zg8FRWuCUbis7LwfF4y8znCP/"
                      >
                        {CONTENT.PERSONAL_DATA_LINK}
                      </Link>
                      {CONTENT.OFERTA_REGISTER_THREE}
                    </Text>
                  </div>
                </>
              )}
              {currentStep == 1 && (
                <div>
                  <div className={styles["links-wrapper"]}>
                    <Text>
                      {CONTENT.MAIL_SENT_FIRST}{" "}
                      <Text className={styles["text-bold-in"]}>{email}</Text>
                    </Text>
                    <Text>{CONTENT.MAIL_SENT_SECOND}</Text>
                  </div>
                  <div style={{ marginTop: "20px" }}>
                    <Text>
                      {CONTENT.PASSWORD_MAIL_TEXT}
                      <Text className={styles["necessary"]}>
                        {CONTENT.NECESSARY}
                      </Text>
                    </Text>
                    <Input
                      placeholder={CONTENT.PASSWORD_MAIL_PLACEHOLDER}
                      value={passwordMail}
                      type="password"
                      onChange={(event) => setPasswordMail(event.target.value)}
                    />
                  </div>
                  <div className={styles["buttons-wrapper"]}>
                    <Button
                      onClick={() => {
                        onChangeStep(0) //, navigate("/login")
                      }}
                      className={styles["button-back"]}
                    >
                      {CONTENT.BUTTON_BACK}
                    </Button>
                    <Button
                      className={styles["button-item-wide"]}
                      disabled={isButtonDisabled}
                      onClick={enterAccount}
                    >
                      {CONTENT.CONTINUE_BUTTON}
                      {/*
                      onClick={startTimer}
                      isButtonDisabled &&
                        ` через (${formatTime(secondsRemaining)})`*/}
                    </Button>
                  </div>
                </div>
              )}
              {currentStep == 2 && (
                <div className={styles["inn-inner-registration"]}>
                  <Text>{CONTENT.INN}</Text>
                  <div className={styles["inn-wrapper"]}>
                    <Form.Item
                      className={styles["form-inn"]}
                      validateStatus={checkedError ? "error" : ""} // Устанавливаем статус ошибки в 'error' при наличии ошибки
                      help={
                        checkedError ? (
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
                        placeholder="132808730606"
                        className={styles["input-item-inn"]}
                        disabled={isLoading}
                        value={inn}
                        onChange={(event) => {
                          const input = event.target.value
                          const numericInput = input.replace(/[^0-9]/g, "")
                          setInn(numericInput)
                          setErrorText("")
                          setInnError(validateInn(input, error))
                          if (validateInn(input, error))
                            setErrorText(error.message)
                          setCheckedError(false)
                        }}
                        status={innError ? "error" : undefined}
                      />
                    </Form.Item>

                    <Button
                      className={styles["button-item-check"]}
                      onClick={() => handleCheck(inn)}
                    >
                      {isLoading ? (
                        <Spin indicator={antIcon} />
                      ) : (
                        CONTENT.BUTTON_CHECK
                      )}
                    </Button>
                  </div>
                  {isInnLoaded && (
                    <div className={styles["loader-wrapper"]}>
                      <div className={styles["text-row"]}>
                        <Text
                          className={cn(
                            styles["row-left"],
                            styles["text-title-person"]
                          )}
                        >
                          {CONTENT.NAME}
                        </Text>

                        <Text
                          className={cn(
                            styles["row-right"],
                            styles["text-title-person"]
                          )}
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
                      </div>
                      <div className={styles["text-row"]}>
                        <Text
                          className={cn(
                            styles["row-left"],
                            styles["text-title-person"]
                          )}
                        >
                          {CONTENT.DATE_REGISTRATION}
                        </Text>

                        <Text
                          className={cn(
                            styles["row-right"],
                            styles["text-title-person"]
                          )}
                        >
                          {formatDateString(user?.fns_reg_date)}
                        </Text>
                      </div>

                      <div className={styles["select-row-item"]}>
                        <Text className={styles["select-title"]}>
                          {"Год, с которого вести учет в сервисе"}
                        </Text>
                        <Select
                          className={styles["select-row"]}
                          options={optionsYears}
                          placeholder={"Выберите значение"}
                          onChange={(value) => setStartYear(value)}
                        />
                      </div>

                      <div className={styles["select-row-item"]}>
                        <Text className={styles["select-title"]}>
                          {"Система налогообложения"}
                        </Text>
                        <Select
                          className={styles["select-row"]}
                          options={optionsSNO}
                          placeholder={"Выберите значение"}
                          onChange={(value) => setSno(value)}
                        />
                      </div>
                      {(sno == TaxSystemType.UsnD ||
                        sno == TaxSystemType.UsnDR) &&
                        rate && (
                          <div className={styles["rate-wrapper"]}>
                            <div className={styles["slider-style"]}>
                              <Text>{"Ставка налогообложения: "}</Text>
                              <Text>{rate}</Text>
                              {sno == TaxSystemType.UsnD ? (
                                <Slider
                                  dots
                                  onChange={onChangeSlider}
                                  defaultValue={6}
                                  max={maxSlider}
                                  value={parseInt(rate.slice(0, -1))}
                                />
                              ) : sno == TaxSystemType.UsnDR ? (
                                <Slider
                                  dots
                                  onChange={onChangeSlider}
                                  defaultValue={15}
                                  max={maxSlider}
                                  value={parseInt(rate.slice(0, -1))}
                                />
                              ) : null}
                            </div>
                          </div>
                        )}
                    </div>
                  )}

                  {((sno === TaxSystemType.UsnD &&
                    rate !== null &&
                    rate &&
                    parseInt(rate.slice(0, -1), 10) < 6) ||
                    (sno === TaxSystemType.UsnDR &&
                      rate !== null &&
                      rate &&
                      parseInt(rate.slice(0, -1), 10) < 15)) && (
                    <>
                      <Title level={4} className={styles["justify-heading"]}>
                        {CONTENT.JUSTIFICATION_TITLE}
                      </Title>

                      <div className={styles["input-item-justify"]}>
                        <Text
                          className={cn(
                            styles["text-description"],
                            styles["default-text"]
                          )}
                        >
                          {CONTENT.SELECT_JUSTIFICATION_TITLE}
                          <Text className={styles["necessary"]}>
                            {" " + CONTENT.NECESSARY}
                          </Text>
                        </Text>
                        <Form.Item
                          className={styles["form-inn"]}
                          validateStatus={counterpartyError ? "error" : ""} // Устанавливаем статус ошибки в 'error' при наличии ошибки
                          help={
                            counterpartyError ? (
                              <div>
                                <Text className={styles["error-text"]}>
                                  {CONTENT.SELECT_JUSTIFICATION_TITLE}
                                </Text>
                              </div>
                            ) : (
                              ""
                            )
                          }
                        >
                          <Select
                            style={{ borderRadius: "4px" }}
                            value={selectedReasonType}
                            options={justificationOptions}
                            placeholder={CONTENT.SELECT_PLACEHOLDER}
                            onChange={(value) => {
                              setSelectedReasonType(value)
                            }}
                          />
                        </Form.Item>
                      </div>

                      <div className={styles["inputs-row"]}>
                        <div className={styles["input-item-justify"]}>
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
                            validateStatus={counterpartyError ? "error" : ""} // Устанавливаем статус ошибки в 'error' при наличии ошибки
                            help={
                              counterpartyError ? (
                                <div>
                                  <Text className={styles["error-text"]}>
                                    {CONTENT.INPUT_ARTICLE_TITLE}
                                  </Text>
                                </div>
                              ) : (
                                ""
                              )
                            }
                          >
                            <Input
                              placeholder={CONTENT.INPUT_PLACEHOLDER}
                              style={{ borderRadius: "4px" }}
                              value={selectedArticle}
                              onChange={(event) => {
                                const inputValue = event.target.value.replace(
                                  /[^\d./-]/g,
                                  ""
                                )
                                setSelectedArticle(inputValue)
                              }}
                              maxLength={4}
                            />
                          </Form.Item>
                        </div>
                        <div className={styles["input-item-justify"]}>
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
                            validateStatus={counterpartyError ? "error" : ""} // Устанавливаем статус ошибки в 'error' при наличии ошибки
                            help={
                              counterpartyError ? (
                                <div>
                                  <Text className={styles["error-text"]}>
                                    {CONTENT.INPUT_PARAGRAPH_TITLE}
                                  </Text>
                                </div>
                              ) : (
                                ""
                              )
                            }
                          >
                            <Input
                              placeholder={CONTENT.INPUT_PLACEHOLDER}
                              style={{ borderRadius: "4px" }}
                              value={selectedParagraph}
                              onChange={(event) => {
                                const inputValue = event.target.value.replace(
                                  /[^\d./-]/g,
                                  ""
                                )
                                setSelectedParagraph(inputValue)
                              }}
                              maxLength={4}
                            />
                          </Form.Item>
                        </div>
                        <div className={styles["input-item-justify"]}>
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
                            validateStatus={counterpartyError ? "error" : ""} // Устанавливаем статус ошибки в 'error' при наличии ошибки
                            help={
                              counterpartyError ? (
                                <div>
                                  <Text className={styles["error-text"]}>
                                    {CONTENT.INPUT_SUBPARAGRAPH_TITLE}
                                  </Text>
                                </div>
                              ) : (
                                ""
                              )
                            }
                          >
                            <Input
                              placeholder={CONTENT.INPUT_PLACEHOLDER}
                              style={{ borderRadius: "4px" }}
                              value={selectedSubparagraph}
                              onChange={(event) => {
                                const inputValue = event.target.value.replace(
                                  /[^\d./-]/g,
                                  ""
                                )
                                setSelectedSubparagraph(inputValue)
                              }}
                              maxLength={4}
                            />
                          </Form.Item>
                        </div>
                      </div>
                    </>
                  )}
                  <div className={styles["button-one"]}>
                    <Button
                      className={styles["button-item-enter"]}
                      disabled={disabledEnter}
                      onClick={onEnter}
                    >
                      {CONTENT.BUTTON_ENTER}
                    </Button>
                  </div>
                  <Text className={styles["oferta-text"]}>
                    {CONTENT.OFERTA_TEXT}
                    <Link
                      underline
                      className={styles["oferta-text"]}
                      target="_blink"
                      href="https://docs.google.com/document/d/1wyphbddHpr1hvZpQzwkQ29sUUiRZnRh7/"
                    >
                      {CONTENT.OFERTA_LINK_ONE}
                    </Link>
                    {CONTENT.TEXT_AND}
                    <Link
                      underline
                      className={styles["oferta-text"]}
                      color=""
                      target="_blink"
                      href="https://docs.google.com/document/d/1LgOipJN6Zg8FRWuCUbis7LwfF4y8znCP/"
                    >
                      {CONTENT.OFERTA_LINK_TWO}
                    </Link>
                  </Text>
                </div>
              )}
            </div>
            {!isMobile && (
              <div className={styles["stepper-wrapper"]}>
                <Steps
                  direction="vertical"
                  current={currentStep}
                  size="small"
                  //onChange={onChangeStep}
                  className={styles["stepper-inner"]}
                  percent={currentStep == 1 ? 60 : undefined}
                  items={steps}
                />
              </div>
            )}
          </div>
        </div>
        <ConfirmModal isOpen={isOpen} setOpen={setOpen} />
      </ConfigProvider>
    </>
  )
}
