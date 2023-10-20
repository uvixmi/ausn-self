import {
  Button,
  ConfigProvider,
  DatePicker,
  Layout,
  List,
  Select,
  Typography,
} from "antd"
import { CONTENT } from "./constants"
import styles from "./styles.module.scss"

export const AccountPage = () => {
  const { Sider, Content } = Layout

  const data = [
    CONTENT.SIDER_HEADING_TAXES,
    CONTENT.SIDER_HEADING_REPORTS,
    CONTENT.SIDER_HEADING_DOCUMENT,
    CONTENT.SIDER_HEADING_PERSONNEL,
  ]

  const data_banks = [CONTENT.BANK_SBER, CONTENT.BANK_VTB, CONTENT.BANK_ALPHA]

  const data_cashiers = [CONTENT.CASHIERS_FIRST]

  const data_marketplaces = [
    CONTENT.MARKETPLACE_WILDBERRIES,
    CONTENT.MARKETPLACE_OZON,
  ]

  const { Title } = Typography

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
        <Layout>
          <Sider className={styles["left-sider-wrapper"]}>
            <List
              dataSource={data}
              renderItem={(item) => <List.Item>{item}</List.Item>}
            />
          </Sider>
          <Content className={styles["content-wrapper"]}>
            <Title level={2} className={styles["heading-text"]}>
              {CONTENT.HEADING_TAXES}
            </Title>
            <div className={styles["cards-wrapper"]}>
              <div className={styles["card-item"]}>{1}</div>
              <div className={styles["card-item"]}>
                {2}
                <Button>{CONTENT.BUTTON_ADD_PAYMENT_TEXT}</Button>
              </div>
              <div className={styles["card-item"]}>
                {3}
                <Button>{CONTENT.BUTTON_ADD_PAYMENT_TEXT}</Button>
              </div>
            </div>
            <div>
              <Button>{CONTENT.BUTTON_ENS_TEXT}</Button>
              <div></div>
            </div>
            <div>
              <Title level={3}>{CONTENT.HEADING_INCOME}</Title>
              <div className={styles["income-header-wrapper"]}>
                <DatePicker.RangePicker placeholder={["от", "до"]} />
                <Select placeholder={CONTENT.SELECT_ACCOUNT_NUMBER} />
                <Select placeholder={CONTENT.SELECT_OPERATION_TYPE} />
              </div>
            </div>
          </Content>
          <Sider className={styles["right-sider-wrapper"]}>
            <Title level={3}>{CONTENT.HEADING_DATA_SOURCES}</Title>
            <Title level={4}>{CONTENT.HEADING_BANKS}</Title>
            <List
              dataSource={data_banks}
              renderItem={(item) => <List.Item>{item}</List.Item>}
            />
            <Title level={4}>{CONTENT.HEADING_CASHIERS}</Title>
            <List
              dataSource={data_cashiers}
              renderItem={(item) => <List.Item>{item}</List.Item>}
            />
            <Title level={4}>{CONTENT.HEADING_MARKETPLACES}</Title>
            <List
              dataSource={data_marketplaces}
              renderItem={(item) => <List.Item>{item}</List.Item>}
            />
          </Sider>
        </Layout>
      </ConfigProvider>
    </>
  )
}
