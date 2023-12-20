import { Button, Layout, Progress, Typography } from "antd"
import { CONTENT } from "./constants"
import styles from "./styles.module.scss"
import cn from "classnames"
import { useState } from "react"

export const SettingsPage = () => {
  const [isOpen, setOpen] = useState(false)
  const { Sider, Content } = Layout
  const { Title, Text } = Typography
  const data = [
    {
      date: "09 Января 2024",
      late: true,
      needToPay: 45842,
      paid: 10,
      title: "Фиксированные взносы за 2023 год",
      description:
        "Уплата страхового взноса за ИП в совокупном фиксированном размере",
    },
    {
      date: "25 Апреля 2024",
      late: false,
      needToPay: 0,
      paid: 0,
      title: "Декларация УСН за 2023 год",
      description:
        "Сдача налоговой декларации по упрощенной системе налогообложения",
    },
    {
      date: "25 Апреля 2024",
      late: false,
      needToPay: 45842,
      paid: 10,
      title: "Уведомление по УСН за I кв 2024 года",
      description:
        "Сдача уведомления об исчисленных авансовых платежах по налогу",
    },
    {
      date: "25 Апреля 2024",
      late: false,
      needToPay: 35542,
      paid: 17042,
      title: "Налог УСН за 2023 год",
      description: "Уплата налога по упрощенной системе налогообложения",
    },
    {
      date: "01 Июля 2024",
      late: false,
      needToPay: 42500,
      paid: 32500,
      title: "1% с дохода за 2023 год",
      description: "Уплата страхового взноса с дохода свыше 300 000 ₽",
    },
  ]
  return (
    <>
      <Content className={styles["content-wrapper"]}>
        <Title level={2} className={styles["heading-text"]}>
          {CONTENT.SETTINGS_HEADING}
        </Title>
        <div className={styles["remark-wrapper"]}>
          <Button className={styles["remark-button"]}>
            {CONTENT.BUTTON_NOTIFICATIONS}
          </Button>
          <Button className={styles["feedback-button"]}>
            {CONTENT.BUTTON_FEEDBACK}
          </Button>
        </div>
        <div className={styles["info-wrapper"]}>
          <Title level={3} className={styles["heading-text"]}>
            {CONTENT.TAXMODE_HEADING}
          </Title>
          <div className={styles["info-row"]}>
            <div className={styles["info-item"]}>
              <Text className={styles["text-title"]}>
                {CONTENT.TEXT_TAXSYSTEM}
              </Text>
              <Text className={styles["text-inner"]}>{"УСН"}</Text>
            </div>
            <div className={styles["info-item"]}>
              <Text className={styles["text-title"]}>
                {CONTENT.TEXT_DATE_REGISTRATION}
              </Text>
              <Text className={styles["text-inner"]}>{"21.10.2021"}</Text>
            </div>
          </div>

          <div className={styles["info-row"]}>
            <div className={styles["info-item"]}>
              <Text className={styles["text-title"]}>
                {CONTENT.TEXT_TAXOBJECT}
              </Text>
              <Text className={styles["text-inner"]}>{"Доходы"}</Text>
            </div>
            <div className={styles["info-item"]}>
              <Text className={styles["text-title"]}>{CONTENT.TEXT_OKTMO}</Text>
              <Text className={styles["text-inner"]}>{"48901221"}</Text>
            </div>
          </div>
          <div className={styles["info-row"]}>
            <div className={styles["info-item"]}>
              <Text className={styles["text-title"]}>
                {CONTENT.TEXT_TAX_RATE}
              </Text>
              <Text className={styles["text-inner"]}>{"4%"}</Text>
            </div>
            <div className={styles["info-item"]}>
              <Text className={styles["text-title"]}>
                {CONTENT.TEXT_CODE_IFNS}
              </Text>
              <Text className={styles["text-inner"]}>{"0550"}</Text>
            </div>
          </div>
          <div className={styles["info-row"]}>
            <div className={styles["info-item"]}>
              <Text className={styles["text-title"]}>
                {CONTENT.TEXT_DATE_BEGIN}
              </Text>
              <Text className={styles["text-inner"]}>{"01.01.2023"}</Text>
            </div>
            <div className={styles["info-item"]}>
              <Text className={styles["text-title"]}>
                {CONTENT.TEXT_DEFAULT_CODE}
              </Text>
            </div>
          </div>
        </div>
        <div className={styles["info-wrapper"]}>
          <Title
            level={3}
            className={styles["heading-text"]}
            style={{ marginTop: 0 }}
          >
            {CONTENT.CONTACT_HEADING}
          </Title>
          <div className={styles["info-row"]}>
            <div className={styles["info-item"]}>
              <Text className={styles["text-title"]}>{CONTENT.TEXT_EMAIL}</Text>
              <Text className={styles["text-inner"]}>{"teat@bk.ru"}</Text>
            </div>
            <div className={styles["info-item"]}>
              <Text className={styles["text-title"]}>{CONTENT.TEXT_PHONE}</Text>
              <Text className={styles["text-inner"]}>{"+7 987 123-00-00"}</Text>
            </div>
          </div>
        </div>
        <div className={styles["off-button-wrapper"]}>
          <Button className={styles["off-button"]}>
            {CONTENT.BUTTON_OFF_SERVICE}
          </Button>
        </div>
      </Content>
      <Sider
        className={styles["right-sider-wrapper"]}
        width={320}
        breakpoint="lg"
        collapsedWidth="0"
      >
        <div className={styles["update-wrapper"]}></div>
      </Sider>
    </>
  )
}
