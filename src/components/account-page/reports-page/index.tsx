import { Button, Layout, Progress, Select, Typography } from "antd"
import { Link } from "react-router-dom"
import { CONTENT } from "./constants"
import styles from "./styles.module.scss"
import "./styles.scss"
import cn from "classnames"
import { DownloadOutlined, InfoCircleOutlined } from "@ant-design/icons"
import { useEffect } from "react"

export const ReportsPage = () => {
  const { Sider, Content } = Layout
  const { Title, Text } = Typography

  const optionsNotifications = [{ value: "I", label: "I квартал 2023" }]

  const optionsDeclaration = [{ value: "2023", label: "2023" }]

  return (
    <>
      <Content className={styles["content-wrapper"]}>
        <Title level={2} className={styles["heading-text"]}>
          {CONTENT.REPORTS_HEADING}
        </Title>

        <div className={styles["info-wrapper"]}>
          <div className={styles["info-row"]}>
            <div className={styles["info-item"]}>
              <Title level={3} className={styles["heading-text"]}>
                {CONTENT.READABLE_TRUST_HEADING}
              </Title>
              <div className={styles["mcd-text-inner"]}>
                <Text className={styles["text-title"]}>
                  {CONTENT.TEXT_MCD_DESCRIPTION}
                </Text>
                <Text className={styles["text-title"]}>
                  {CONTENT.TEXT_MCD_DESCRIPTION_ONE}
                </Text>
                <Text className={styles["text-title"]}>
                  {CONTENT.TEXT_MCD_DESCRIPTION_TWO}
                </Text>
                <Text className={styles["text-title"]}>
                  {CONTENT.TEXT_MCD_DESCRIPTION_THREE}
                </Text>
                <Text className={styles["text-title"]}>
                  {CONTENT.TEXT_MCD_DESCRIPTION_FOUR}
                </Text>
              </div>
            </div>
            <div className={styles["mcd-wrapper"]}>
              <Text className={styles["mcd-text"]}>{CONTENT.TEXT_MCD}</Text>
              <Button className={styles["mcd-button"]}>
                {CONTENT.BUTTON_MCD}
              </Button>
            </div>
          </div>
        </div>
        <div className={styles["info-wrapper"]}>
          <div className={styles["info-row"]}>
            <div className={styles["info-item"]}>
              <Title level={3} className={styles["heading-text"]}>
                {CONTENT.NOTIFICATION_HEADING}
              </Title>
              <Text className={styles["text-title"]}>
                {CONTENT.TEXT_DECLARATION}
              </Text>
              <Link to="#">
                <Text className={styles["text-link"]}>
                  {CONTENT.TEXT_DECLARATION_LINK}
                </Text>
              </Link>

              <div className={styles["buttons-row"]}>
                <Select
                  className={cn("report-select", styles["buttons-row-item"])}
                  defaultValue="I"
                  options={optionsNotifications}
                />
                <Button
                  className={cn(
                    styles["buttons-row-item"],
                    styles["button-make"]
                  )}
                >
                  {CONTENT.BUTTON_MAKE_NOTIFICATION}
                </Button>
              </div>
            </div>
            <div className={styles["download-wrapper"]}>
              <Button className={styles["download-button"]}>
                <div className={styles["download-text-inner"]}>
                  <Text className={styles["download-text-title"]}>
                    {CONTENT.TEXT_NOTIFICATION}
                  </Text>
                  <Text>{"за III кв 2023 от 12.12.23.pdf"}</Text>
                </div>
                <DownloadOutlined className={styles["download-icon"]} />
              </Button>
              <Button className={styles["download-button"]}>
                <div className={styles["download-text-inner"]}>
                  <Text className={styles["download-text-title"]}>
                    {CONTENT.TEXT_NOTIFICATION}
                  </Text>
                  <Text>{"за III кв 2023 от 12.12.23.xml"}</Text>
                </div>
                <DownloadOutlined className={styles["download-icon"]} />
              </Button>
            </div>
          </div>
        </div>
        <div className={styles["info-wrapper"]}>
          <div className={styles["info-row"]}>
            <div className={styles["info-item"]}>
              <Title level={3} className={styles["heading-text"]}>
                {CONTENT.DECLARATION_HEADING}
              </Title>
              <Text className={styles["text-title"]}>
                {CONTENT.TEXT_DECLARATION}
              </Text>
              <Link to="#">
                <Text className={styles["text-link"]}>
                  {CONTENT.TEXT_DECLARATION_LINK}
                </Text>
              </Link>

              <div className={styles["buttons-row"]}>
                <Select
                  className={cn("report-select", styles["buttons-row-item"])}
                  defaultValue="2023"
                  options={optionsDeclaration}
                />
                <Button
                  className={cn(
                    styles["buttons-row-item"],
                    styles["button-make"]
                  )}
                >
                  {CONTENT.BUTTON_MAKE_DECLARATION}
                </Button>
              </div>
            </div>
            <div className={styles["download-wrapper"]}>
              <Button className={styles["download-button"]}>
                <div className={styles["download-text-inner"]}>
                  <Text className={styles["download-text-title"]}>
                    {CONTENT.DECLARATION_HEADING}
                  </Text>
                  <Text>{"за III кв 2023 от 12.12.23.pdf"}</Text>
                </div>
                <DownloadOutlined className={styles["download-icon"]} />
              </Button>
              <Button className={styles["download-button"]}>
                <div className={styles["download-text-inner"]}>
                  <Text className={styles["download-text-title"]}>
                    {CONTENT.DECLARATION_HEADING}
                  </Text>
                  <Text>{"за III кв 2023 от 12.12.23.xml"}</Text>
                </div>
                <DownloadOutlined className={styles["download-icon"]} />
              </Button>
            </div>
          </div>
        </div>
        <div className={styles["info-wrapper"]}>
          <div className={styles["info-row"]}>
            <div className={styles["info-item"]}>
              <Title level={3} className={styles["heading-text"]}>
                {CONTENT.BOOK_KUDIR_HEADING}
              </Title>
              <Text className={styles["text-title"]}>
                {CONTENT.TEXT_KUDIR_ONE}
              </Text>
              <Text className={styles["text-title"]}>
                {CONTENT.TEXT_KUDIR_TWO}
              </Text>
              <div className={styles["buttons-row"]}>
                <Select
                  className={cn("report-select", styles["buttons-row-item"])}
                  placeholder={CONTENT.SELECT_KUDIR}
                />
                <Button className={styles["buttons-row-item"]}>
                  {CONTENT.BUTTON_MAKE_KUDIR}
                </Button>
              </div>
            </div>
            <div className={styles["download-wrapper"]}>
              <Button className={styles["download-button"]}>
                <div className={styles["download-text-inner"]}>
                  <Text className={styles["download-text-title"]}>
                    {CONTENT.BOOK_KUDIR_HEADING}
                  </Text>
                  <Text>{"за III кв 2023 от 12.12.23.pdf"}</Text>
                </div>
                <DownloadOutlined className={styles["download-icon"]} />
              </Button>
            </div>
          </div>
        </div>
      </Content>
      <Sider
        className={styles["right-sider-wrapper"]}
        width={320}
        breakpoint="lg"
        collapsedWidth="0"
      >
        <div className={styles["update-wrapper"]}>
          <Title level={3}>{CONTENT.DOCUMENTS_HEADING}</Title>
          <div className={styles["sider-notification"]}>
            <div className={styles["update-text-inner"]}>
              <InfoCircleOutlined className={styles["sider-icon"]} size={24} />
            </div>
            <div className={styles["update-text-inner"]}>
              <Text className={styles["sider-notification-text"]}>
                {
                  "Все документы от ФНС (требования и сообщения), а так же сверка с ФНС будут доступны после оформления МЧД."
                }
              </Text>
            </div>
          </div>
        </div>
      </Sider>
    </>
  )
}
