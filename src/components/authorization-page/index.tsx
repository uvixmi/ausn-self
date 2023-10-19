import { Button, Input, Typography } from "antd"
import styles from "./styles.module.scss"
import { CONTENT } from "./constants"
import { RegisterWelcomeImage } from "./images/register-welcome"
import Link from "antd/es/typography/Link"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { api } from "../../api/myApi"

const { Title, Text } = Typography

export const AuthorizationPage = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

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
              onClick={() => {
                api.auth.loginAuthPost({ username: email, password: password })
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
