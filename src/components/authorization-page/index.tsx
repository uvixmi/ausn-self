import { Button, Input, Typography } from "antd"
import styles from "./styles.module.scss"
import { CONTENT } from "./constants"
import { RegisterWelcomeImage } from "./images/register-welcome"
import Link from "antd/es/typography/Link"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { User, api } from "../../api/myApi"
import { AuthorizationPageProps } from "./types"
import { useDispatch, useSelector } from "react-redux"
import { fetchCurrentUser } from "./slice"
import { AppDispatch, RootState } from "../main-page/store"

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
                <Input
                  className={styles["input-item"]}
                  placeholder={CONTENT.EMAIL_PLACEHOLDER}
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value)
                  }}
                ></Input>
              </div>
              <div className={styles["input-item-wrapper"]}>
                <Text>{CONTENT.PASSWORD_TITLE}</Text>
                <Input
                  className={styles["input-item"]}
                  placeholder={CONTENT.PASSWORD_PLACEHOLDER}
                  type="password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value)
                  }}
                ></Input>
              </div>
              <div className={styles["links-wrapper"]}>
                <Link onClick={() => navigate("/register")}>
                  {CONTENT.REGISTRATION_TEXT}
                </Link>
                <Link>{CONTENT.PASSWORD_FORGOT_TEXT}</Link>
              </div>
            </div>
            <Button
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
                    login(access_token, 3600)
                    setAccessToken(access_token)
                    setTokenType(token_type)
                    setIsAuth(true)
                    navigate("/main")
                  } else {
                    console.error("Отсутствует свойство data в ответе API.")
                  }
                } catch (error) {
                  console.error("Ошибка при выполнении запроса:", error)
                  // Другие действия при ошибке, если необходимо
                }
                dispatch(fetchCurrentUser())
              }}
            >
              {CONTENT.ENTER_BUTTON}
            </Button>
          </div>
          <div className={styles["img-wrapper"]}>
            <RegisterWelcomeImage className={styles["img-wrapper"]} />
          </div>
        </div>
      </div>
    </>
  )
}
