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

const { Title, Text, Link } = Typography

export const RegisterPage = ({
  registrationPage,
  currentUser,
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
    { label: "Год, с которого вести учет в сервисе: 2023", value: currentYear },
    {
      label: "Год, с которого вести учет в сервисе: 2022",
      value: currentYear - 1,
    },
  ]

  const optionsSNO = [
    { label: "Система налогообложения: УСН Доходы", value: TaxSystemType.UsnD },
    {
      label: "Система налогообложения: УСН Доходы - Расходы",
      value: TaxSystemType.UsnDR,
    },
    { label: "Система налогообложения: Патент", value: TaxSystemType.Eshn },
    {
      label: "Система налогообложения: Общая система НО",
      value: TaxSystemType.Osn,
    },
  ]

  const [currentStep, setCurrentStep] = useState(0)
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [inn, setInn] = useState("")
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
  const [errorText, setErrorText] = useState("")

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
        // Другие поля, если есть...
      }
      // Другие поля ошибки, если есть...
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

  const handleCheck = async (inn: string) => {
    setIsLoading(true)
    try {
      const response = await api.users.getInnInfoUsersInnInfoGet(
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

  const startTimer = () => {
    setButtonDisabled(true)
    setSecondsRemaining(10)
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

  const PhoneMask = "+{0} (000) 000-00-00"

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

  useEffect(() => {
    startTimer()
  }, [currentStep])

  const validateEmail = (email: string) => {
    // Регулярное выражение для проверки формата email
    const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    // Проверка формата email
    if (!emailRegex.test(email)) {
      // Возвращаем true, если формат не соответствует
      return true
    }

    // Возвращаем false, если формат соответствует
    return false
  }

  const validatePhone = (phoneNumber: string) => {
    const strippedNumber = phoneNumber.replace(/[^\d+]/g, "")

    // Создание регулярного выражения для проверки соответствия маске
    //const maskRegex = new RegExp(`^\\${PhoneMask.replace(/[\s()+]/g, "")}$`)

    // Создание регулярного выражения для проверки длины строки после удаления
    const lengthRegex = /^\+\d{11}$/

    // Проверка соответствия маске
    //const isValidMask = maskRegex.test(phoneNumber)

    // Проверка длины строки после удаления
    const isValidLength = lengthRegex.test(strippedNumber)
    return !isValidLength
  }

  useEffect(() => {
    if (email == "" || phone == "") setIsDisabledFirstButton(true)
    else if (emailError || phoneError) setIsDisabledFirstButton(true)
    else setIsDisabledFirstButton(false)
  }, [emailError, phoneError, email, phone])

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
      await api.users.saveTaxInfoUsersTaxInfoPut(
        {
          inn,
          tax_rate: parseInt(rate.slice(0, -1), 10),
          start_year: startYear,
        },
        { headers }
      )
      setOpen(true)
    } else navigate("/non-target")
  }

  const [disabledEnter, setDisabledEnter] = useState(true)

  useEffect(() => {
    if (innError === false && inn !== "" && startYear != 0 && sno != undefined)
      setDisabledEnter(false)
    else setDisabledEnter(true)
  }, [inn, innError, sno, startYear])

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
                      <Input
                        className={styles["input-item"]}
                        value={email}
                        onChange={(event) => {
                          setEmail(event.target.value),
                            setEmailError(validateEmail(event.target.value))
                        }}
                        placeholder={CONTENT.EMAIL_PLACEHOLDER}
                        status={emailError ? "error" : undefined}
                      ></Input>
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
                    onClick={async () => {
                      if (phone === "" && email === "") {
                        setPhoneError(true), setEmailError(true)
                      } else if (phone === "") setPhoneError(true)
                      else if (email === "") setEmailError(true)
                      else {
                        onChangeStep(1)
                        await api.users.createUserUsersPost({
                          email: email,
                          phone_number: phone,
                        })
                      }
                    }}
                  >
                    {CONTENT.CONTINUE_BUTTON}
                  </Button>
                  <div className={styles["links-wrapper"]}>
                    <Text>{CONTENT.REGISTRATION_TEXT}</Text>
                  </div>
                </>
              )}
              {currentStep == 1 && (
                <div>
                  <div className={styles["links-wrapper"]}>
                    <Text>{CONTENT.MAIL_SENT_FIRST + email}</Text>
                    <Text>{CONTENT.MAIL_SENT_SECOND}</Text>
                    <Text>{CONTENT.MAIL_SENT_THIRD}</Text>
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
                      onClick={startTimer}
                      disabled={isButtonDisabled}
                    >
                      {CONTENT.BUTTON_ONE_MORE_MAIL}
                      {isButtonDisabled &&
                        ` через (${formatTime(secondsRemaining)})`}
                    </Button>
                  </div>
                </div>
              )}
              {currentStep == 2 && (
                <div>
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
                          setInn(event.target.value)
                          setErrorText("")
                          setInnError(validateInn(event.target.value, error))
                          if (validateInn(event.target.value, error))
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
                        <Text>{CONTENT.NAME}</Text>
                        <Text>
                          {"ИП " +
                            user?.lastname +
                            " " +
                            user?.firstname +
                            " " +
                            user?.patronymic}
                        </Text>
                      </div>
                      <div className={styles["text-row"]}>
                        <Text>{CONTENT.DATE_REGISTRATION}</Text>
                        <Text>{user?.fns_reg_date}</Text>
                      </div>
                      <div className={styles["text-row"]}>
                        <Select
                          className={styles["select-row"]}
                          options={optionsYears}
                          placeholder={"Год, с которого вести учет в сервисе"}
                          onChange={(value) => setStartYear(value)}
                        />
                      </div>
                      <div className={styles["text-row"]}>
                        <Select
                          className={styles["select-row"]}
                          options={optionsSNO}
                          placeholder={"Система налогообложения"}
                          onChange={(value) => setSno(value)}
                        />
                      </div>
                      {(sno == TaxSystemType.UsnD ||
                        sno == TaxSystemType.UsnDR) && (
                        <div className={styles["rate-wrapper"]}>
                          <div className={styles["slider-style"]}>
                            <Text>{"Ставка налогообложения: "}</Text>
                            <Text>{rate}</Text>
                            {sno == TaxSystemType.UsnD ? (
                              <Slider
                                dots
                                marks={marks}
                                onChange={onChangeSlider}
                                defaultValue={6}
                                max={maxSlider}
                              />
                            ) : sno == TaxSystemType.UsnDR ? (
                              <Slider
                                dots
                                marks={marks}
                                onChange={onChangeSlider}
                                defaultValue={15}
                                max={maxSlider}
                              />
                            ) : null}
                          </div>
                        </div>
                      )}
                    </div>
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
                    <Link underline className={styles["oferta-text"]}>
                      {CONTENT.OFERTA_LINK_ONE}
                    </Link>
                    {CONTENT.TEXT_AND}
                    <Link underline className={styles["oferta-text"]} color="">
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
