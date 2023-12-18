import { Button, Layout, Typography } from "antd"
import Link from "antd/es/typography/Link"
import { CONTENT } from "./constants"
import styles from "./styles.module.scss"

export const ActionsPage = () => {
  const { Sider, Content } = Layout
  const { Title, Text } = Typography
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
      </Content>
      <Sider
        className={styles["right-sider-wrapper"]}
        width={320}
        breakpoint="lg"
        collapsedWidth="0"
      >
        <div className={styles["sider-buttons"]}>
          <Title>{CONTENT.UPDATE_DATA_HEADING}</Title>
          <Text>{CONTENT.UPDATE_DATA_TEXT}</Text>
        </div>
      </Sider>
    </>
  )
}
