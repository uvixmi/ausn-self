import { Button, Input, Typography } from "antd"
import styles from "./styles.module.scss"
import { CONTENT } from "./constants"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { User, api } from "../../api/myApi"
import { useAuth } from "../../AuthContext"
import { NonTargetPageProps } from "./types"
import { RootState } from "../main-page/store"
import { useSelector } from "react-redux"

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
        <div className={styles["register-block-wrapper"]}>
          <div className={styles["inputs-wrapper"]}>
            <Title level={1} className={styles["heading-text"]}>
              {CONTENT.NON_TARGET_HEADING}
            </Title>
            <Text className={styles["paragraph-text"]}>
              {CONTENT.NON_TARGET_TEXT}
            </Text>
            <div
              className={styles["inputs-window"]}
              style={{ marginTop: "12px" }}
            >
              <div className={styles["input-item-wrapper"]}>
                <Text className={styles["paragraph-text"]}>
                  {CONTENT.PHONE_TITLE}
                </Text>
                <Input
                  className={styles["input-item"]}
                  placeholder={users?.phone_number || ""}
                  value={phone}
                  onChange={(event) => {
                    setPhone(event.target.value)
                  }}
                />
                <Button
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
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
