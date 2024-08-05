import { Button, Input, Steps, Typography } from "antd"
import styles from "./styles.module.scss"
import { CONTENT } from "./constants"
import cn from "classnames"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { User, api } from "../../api/myApi"
import { useAuth } from "../../AuthContext"
import { NonTargetPageProps } from "./types"
import { RootState } from "../main-page/store"
import { useSelector } from "react-redux"
import { ResetPasswordImage } from "../reset-password-page/images/reset-password"
import { LogoIcon } from "../main-page/logo-icon"
import { useMediaQuery } from "@react-hook/media-query"
import { FirstStepper } from "../reset-password-page/images/first-stepper"
import { SecondStepper } from "../reset-password-page/images/second-stepper"
import { ThirdStepper } from "../reset-password-page/images/third-stepper"
import { ButtonOne } from "../../ui-kit/button"
import { InputOne } from "../../ui-kit/input"

export const NonTargetPage = ({ accessToken }: NonTargetPageProps) => {
  const [phone, setPhone] = useState("")
  const { Title, Text } = Typography
  const { logout } = useAuth()
  const navigate = useNavigate()

  const { inn, start_year, tax_rate, tax_system } = useSelector(
    (state: RootState) => state.registration
  )

  const headers = {
    Authorization: `Bearer ${accessToken}`,
  }

  const [users, setUsers] = useState<User | undefined>(undefined)

  const isMobile = useMediaQuery("(max-width: 1023px)")
  const isTablet = useMediaQuery("(max-width: 1279px)")

  const [currentStep, setCurrentStep] = useState(3)

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

  useEffect(() => {
    const fetchData = async () => {
      const response = await api.users.currentUserUsersGet({ headers })
      setUsers(response.data)
    }
    fetchData()
  }, [])

  return (
    <>
      <div className={styles["content-wrapper"]}>
        <div className={styles["register-logo-wrapper"]}>
          {isTablet ? (
            <div className={styles["logo-stepper"]}>
              <LogoIcon className={styles["logo-wrapper"]} />
              {currentStep === 0 ? (
                <FirstStepper />
              ) : currentStep === 1 ? (
                <SecondStepper />
              ) : currentStep === 2 ? (
                <ThirdStepper />
              ) : null}
            </div>
          ) : (
            <LogoIcon className={styles["logo-wrapper"]} />
          )}
          {isTablet && !isMobile ? (
            <ResetPasswordImage className={styles["image-register"]} />
          ) : null}

          <div className={styles["register-block-wrapper"]}>
            <div className={styles["inputs-wrapper"]}>
              <Text className={styles["heading-text"]}>
                {CONTENT.NON_TARGET_HEADING}
              </Text>
              <Text className={styles["paragraph-text"]}>
                {CONTENT.NON_TARGET_TEXT}
              </Text>
              <div
                className={styles["inputs-window"]}
                style={{ marginTop: "12px" }}
              >
                <div className={styles["input-item-wrapper"]}>
                  <Text className={styles["text-input-title"]}>
                    {CONTENT.PHONE_TITLE}
                  </Text>
                  <InputOne
                    placeholder={users?.phone_number || ""}
                    value={phone}
                    onChange={(event) => {
                      setPhone(event.target.value)
                    }}
                  />
                </div>
              </div>
              <ButtonOne
                className={styles["button-item"]}
                onClick={async () => {
                  if (tax_system)
                    api.users.saveLeadInfoUsersRegistrationLeadInfoPut(
                      {
                        inn,
                        start_year,
                        tax_rate,
                        tax_system,
                      },
                      { headers }
                    )
                  navigate("/login")
                  logout()
                }}
              >
                {CONTENT.SEND_BUTTON}
              </ButtonOne>
            </div>
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
    </>
  )
}
