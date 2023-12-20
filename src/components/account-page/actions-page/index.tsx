import { Button, Layout, Progress, Typography } from "antd"
import Link from "antd/es/typography/Link"
import { CONTENT } from "./constants"
import styles from "./styles.module.scss"
import LampImage from "./images/lamp"
import cn from "classnames"
import { useState } from "react"
import { PaymentModal } from "./payment-modal"

export const ActionsPage = () => {
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
          {CONTENT.ACTIONS_HEADING}
        </Title>
        <div className={styles["remark-wrapper"]}>
          <Button className={styles["remark-button"]}>
            {CONTENT.BUTTON_ENS_TEXT}
          </Button>
          <div className={styles["remark-text"]}>
            <Text>{CONTENT.ENS_TEXT_DETAILS}</Text>
            <Link
              className={styles["link-details"]}
              style={{ color: "#6159ff", whiteSpace: "nowrap" }}
            >
              {CONTENT.TEXT_DETAILS}
            </Link>
          </div>
        </div>
        <div>
          {data.map((item) => (
            <div className={styles["row-item"]}>
              <div className={styles["row-inner"]}>
                <div className={styles["info-part"]}>
                  <div className={styles["info-title"]}>
                    <Text
                      className={cn(styles["text-date"], {
                        [styles["alert-date"]]: item.late,
                      })}
                    >
                      {item.date}
                    </Text>
                    <Title level={4} style={{ margin: 0 }}>
                      {item.title}
                    </Title>
                  </div>
                  <Text className={styles["text-description"]}>
                    {item.description}
                  </Text>
                </div>
                <div className={styles["amount-part"]}>
                  <div className={styles["amount-info"]}>
                    {item.needToPay > 0 ? (
                      <>
                        <div className={styles["amount-pay"]}>
                          <Text className={styles["amount-heading"]}>
                            {CONTENT.TEXT_AMOUNT_ALREADY_PAID}
                          </Text>
                          <Text className={styles["amount-paid-text"]}>
                            {new Intl.NumberFormat("ru", {
                              style: "currency",
                              currency: "RUB",
                            }).format(item.paid)}
                            {" из "}
                            {new Intl.NumberFormat("ru", {
                              style: "currency",
                              currency: "RUB",
                            }).format(item.needToPay)}
                          </Text>
                        </div>

                        {item.paid > 0 && (
                          <Progress
                            percent={
                              (item.paid / item.needToPay) * 100 > 3
                                ? (item.paid / item.needToPay) * 100
                                : 3
                            }
                            showInfo={false}
                            status={item.late ? "exception" : undefined}
                          />
                        )}
                        <div className={styles["amount-pay"]}>
                          <Text className={styles["amount-heading"]}>
                            {CONTENT.TEXT_AMOUNT_TO_PAY}
                          </Text>
                          <Text className={styles["amount-to-pay-text"]}>
                            {new Intl.NumberFormat("ru", {
                              style: "currency",
                              currency: "RUB",
                            }).format(item.needToPay)}
                          </Text>
                        </div>
                      </>
                    ) : (
                      <div className={styles["declaration-wrapper"]}>
                        <Text className={styles["declaration-text"]}>
                          {CONTENT.TEXT_DECLARATION}
                        </Text>
                      </div>
                    )}
                  </div>
                  <div className={styles["row-item-buttons"]}>
                    <Button
                      className={styles["amount-button"]}
                      onClick={() => setOpen(true)}
                    >
                      {CONTENT.BUTTON_TO_PAY}
                    </Button>
                    <Button className={styles["paid-button"]}>
                      {CONTENT.BUTTON_PAID}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Content>
      <Sider
        className={styles["right-sider-wrapper"]}
        width={320}
        breakpoint="lg"
        collapsedWidth="0"
      >
        <div className={styles["update-wrapper"]}>
          <div className={styles["update-inner"]}>
            <div className={styles["update-text-inner"]}>
              <LampImage />
              <Title style={{ marginBottom: 0, marginTop: "8px" }} level={5}>
                {CONTENT.UPDATE_DATA_HEADING}
              </Title>
            </div>
            <div className={styles["update-text-inner"]}>
              <Text className={styles["update-text"]}>
                {CONTENT.UPDATE_DATA_TEXT}
              </Text>
              <Text className={styles["update-taxes-link"]}>
                {CONTENT.UPDATE_TAXES_LINK}
              </Text>
            </div>
          </div>
        </div>
      </Sider>
      <PaymentModal isOpen={isOpen} setOpen={setOpen} />
    </>
  )
}
