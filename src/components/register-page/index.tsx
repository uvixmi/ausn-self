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
} from "antd"
import styles from "./styles.module.scss"
import { useEffect, useState } from "react"
import { LoadingOutlined } from "@ant-design/icons"
import { useMediaQuery } from "@react-hook/media-query"
//import { api } from "../../api/myApi"

const { Title, Text, Link } = Typography

export const RegisterPage = () => {
  const description = "This is a description."
  const isMobile = useMediaQuery("(max-width: 767px)")

  const steps = [
    {
      title: "Регистрация",
      description,
    },
    {
      title: "Подтверждение",
      description,
    },
    {
      title: "Дополнительные сведения",
      description,
    },
  ]

  const [currentStep, setCurrentStep] = useState(0)
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")

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

  const [isButtonDisabled, setButtonDisabled] = useState(false)
  const [secondsRemaining, setSecondsRemaining] = useState(0)

  const [isLoading, setIsLoading] = useState(false)
  const [isInnLoaded, setIsInnLoaded] = useState(false)

  const handleCheck = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setIsInnLoaded(true)
    }, 10000)
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

  const marks = {
    0: "0%",
    1: "1%",
    2: "2%",
    3: "3%",
    4: "4%",
    5: "5%",
    6: "6%",
  }

  const [rate, setRate] = useState("4%")

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
          setCurrentStep(2)
        }
      }, 1000)
    }
    return () => {
      clearInterval(timer)
    }
  }, [isButtonDisabled, secondsRemaining])

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
                  onChange={onChangeStep}
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
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder={CONTENT.EMAIL_PLACEHOLDER}
                      ></Input>
                    </div>
                    <div className={styles["input-item-wrapper"]}>
                      <Text>{CONTENT.PHONE_TITLE}</Text>
                      <Input
                        className={styles["input-item"]}
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)}
                        placeholder={CONTENT.PHONE_PLACEHOLDER}
                        type="password"
                      ></Input>
                    </div>
                  </div>
                  <Button
                    className={styles["button-item"]}
                    onClick={() => {
                      onChangeStep(1)
                      // api.users.createUserUsersPost({
                      // email: "uvixmi@mail.ru",
                      //phone_number: "+79123456789",
                      //})
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
                    <Text>{CONTENT.MAIL_SENT_FIRST}</Text>
                    <Text>{CONTENT.MAIL_SENT_SECOND}</Text>
                    <Text>{CONTENT.MAIL_SENT_THIRD}</Text>
                  </div>
                  <div className={styles["buttons-wrapper"]}>
                    <Button
                      onClick={() => onChangeStep(0)}
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
                    <Input
                      placeholder="132808730606"
                      className={styles["input-item"]}
                      disabled={isLoading}
                    ></Input>
                    <Button
                      className={styles["button-item-check"]}
                      onClick={handleCheck}
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
                        <Text>{CONTENT.NAME_MOCKED}</Text>
                      </div>
                      <div className={styles["text-row"]}>
                        <Text>{CONTENT.DATE_REGISTRATION}</Text>
                        <Text>{CONTENT.DATE_REGISTRATION_MOCKED}</Text>
                      </div>
                      <div className={styles["rate-wrapper"]}>
                        <Checkbox className={styles["checkbox-style"]}>
                          {CONTENT.USN_INCOME}
                        </Checkbox>
                        <div className={styles["slider-style"]}>
                          <Text>{rate}</Text>
                          <Slider
                            dots
                            marks={marks}
                            onChange={onChangeSlider}
                            defaultValue={4}
                            max={6}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  <div className={styles["button-one"]}>
                    <Button
                      className={styles["button-item-enter"]}
                      disabled={true}
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
                  onChange={onChangeStep}
                  className={styles["stepper-inner"]}
                  percent={currentStep == 1 ? 60 : undefined}
                  items={steps}
                />
              </div>
            )}
          </div>
        </div>
      </ConfigProvider>
    </>
  )
}
