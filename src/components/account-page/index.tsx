import {
  Button,
  ConfigProvider,
  Layout,
  List,
  Select,
  Table,
  Typography,
} from "antd"
import { Link, useLocation } from "react-router-dom"
import { CONTENT } from "./constants"
import styles from "./styles.module.scss"
import { Outlet, useNavigate } from "react-router-dom"
import { LogoIcon } from "../main-page/logo-icon"
import { AccountPageProps } from "./types"
import { useEffect, useState } from "react"
import { SourcesInfo, TaskResponse, User, api } from "../../api/myApi"
import { clearData, fetchCurrentUser } from "../authorization-page/slice"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../main-page/store"
import { useAuth } from "../../AuthContext"
import Cookies from "js-cookie"
import { v4 as uuid } from "uuid"
import cn from "classnames"

export const AccountPage = ({
  token_type,
  accessToken,
  logOut,
}: AccountPageProps) => {
  const { Sider } = Layout

  const { data: loaded } = useSelector((state: RootState) => state.user)

  const location = useLocation()

  const data = [
    { title: CONTENT.SIDER_HEADING_EVENTS, to: "/main" },
    { title: CONTENT.SIDER_HEADING_TAXES, to: "/taxes" },
    { title: CONTENT.SIDER_HEADING_REPORTS, to: "/reports" },
    { title: CONTENT.SIDER_HEADING_DOCUMENTS, to: "/documents" },
    { title: CONTENT.SIDER_HEADING_PERSONAL, to: "/personal" },
  ]

  const settings = [
    { title: CONTENT.SIDER_SETTINGS, to: "/settings" },
    { title: CONTENT.SIDER_SUPPORT, to: "/support" },
  ]

  const data_banks = [CONTENT.BANK_SBER, CONTENT.BANK_VTB, CONTENT.BANK_ALPHA]

  const data_cashiers = [CONTENT.CASHIERS_FIRST]

  const data_marketplaces = [
    CONTENT.MARKETPLACE_WILDBERRIES,
    CONTENT.MARKETPLACE_OZON,
  ]

  const { Title, Text } = Typography

  const columns = [
    {
      title: "Банк",
      dataIndex: `bankName`,
      key: "bankName",
    },
    {
      title: "Дата",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Источник",
      dataIndex: "source",
      key: "source",
    },
    {
      title: "Тип операции",
      key: "operationType",
      dataIndex: "operationType",
    },
    {
      title: "Сумма",
      key: "sum",
      dataIndex: "sum",
    },
  ]

  const dataSource = [
    {
      key: "1",
      bankName: "Сбербанк",
      date: "14.05.2023",
      source:
        "ООО Контрагент Оплата по договору ИН-42009-1 2 от 21.01.23 за мармеладных мишек",
      age: 32,
      operationType: "Доход",
      sum:
        "+" +
        new Intl.NumberFormat("ru", {
          style: "currency",
          currency: "RUB", // Change this
        }).format(100500.23),
      address: "New York No. 1 Lake Park",
      tags: ["nice", "developer"],
    },
    {
      key: "2",
      bankName: "Альфа",
      date: "14.05.2023",
      source:
        "ООО Контрагент Оплата по договору ИН-42009-1 2 от 21.01.23 за мармеладных мишек",
      age: 42,
      operationType: "Уплата налогов и взносов",
      sum:
        "+" +
        new Intl.NumberFormat("ru", {
          style: "currency",
          currency: "RUB", // Change this
        }).format(100500.23),
      address: "London No. 1 Lake Park",
      tags: ["loser"],
    },
    {
      key: "3",
      bankName: "ВТБ",
      date: "14.05.2023",
      source:
        "ООО Контрагент Оплата по договору ИН-42009-1 2 от 21.01.23 за мармеладных мишек",
      age: 32,
      operationType: "Не влияет на налоговую базу",
      sum:
        "-" +
        new Intl.NumberFormat("ru", {
          style: "currency",
          currency: "RUB", // Change this
        }).format(100500.23),
      address: "Sydney No. 1 Lake Park",
      tags: ["cool", "teacher"],
    },
    {
      key: "4",
      bankName: "МКБ",
      date: "14.05.2023",
      source:
        "ООО Контрагент Оплата по договору ИН-42009-1 2 от 21.01.23 за мармеладных мишек",
      age: 32,
      operationType: "Возврат покупателю",
      sum:
        "+" +
        new Intl.NumberFormat("ru", {
          style: "currency",
          currency: "RUB", // Change this
        }).format(100500.23),
      address: "Sydney No. 1 Lake Park",
      tags: ["cool", "teacher"],
    },
    {
      key: "5",
      bankName: "Райффайзен",
      source:
        "ООО Контрагент Оплата по договору ИН-42009-1 2 от 21.01.23 за мармеладных мишек",
      date: "14.05.2023",
      operationType: "Доход",
      sum:
        "-" +
        new Intl.NumberFormat("ru", {
          style: "currency",
          currency: "RUB", // Change this
        }).format(10050000.23),
    },
  ]

  const [tasks, setTasks] = useState<TaskResponse | undefined>(undefined)

  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    if (!loaded) dispatch(fetchCurrentUser())
  }, [dispatch, loaded])

  const navigate = useNavigate()

  return (
    <>
      <ConfigProvider
        theme={{
          token: {
            colorLink: "#505050",
            colorPrimary: "#6159ff",
            colorBgLayout: "#fff",
            colorBgContainerDisabled: "#fff",
            colorTextDisabled: "#141414",
            lineHeight: 1.14285714285,
            fontSize: 12,
          },
          components: {
            Layout: {
              siderBg: "#fff",
            },
            Button: {
              borderColorDisabled: "#8C8C8C",
            },
          },
        }}
      >
        <Layout>
          <Sider
            className={styles["left-sider-wrapper"]}
            style={{
              overflow: "auto",
              height: "100vh",
              position: "fixed",
              left: 0,
              top: 0,
              bottom: 0,
            }}
          >
            <div className={styles["left-sider-inner"]}>
              <div className={styles["logo-inner"]}>
                <LogoIcon
                  onClick={() => {
                    navigate("/main"), logOut(), dispatch(clearData())
                  }}
                  type="icon-custom"
                  className={styles["logo-item"]}
                />
              </div>
              <div className={styles["left-sider-menu-inner"]}>
                <List
                  className={styles["left-sider-menu"]}
                  dataSource={data}
                  renderItem={(item) => (
                    <List.Item style={{ border: "none" }}>
                      <Link
                        //underline={item.title == CONTENT.HEADING_TAXES}
                        //strong={item.title == CONTENT.HEADING_TAXES}
                        to={item.to}
                        className={cn(styles["item-link-item"], {
                          [styles["item-active"]]:
                            location.pathname === item.to,
                        })}
                      >
                        {item.title}
                      </Link>
                    </List.Item>
                  )}
                />
                <List
                  className={styles["left-sider-menu"]}
                  dataSource={settings}
                  renderItem={(item) => (
                    <List.Item style={{ border: "none" }}>
                      <Link //underline={item == CONTENT.HEADING_TAXES}
                        to={item.to}
                        className={cn(styles["item-link-item"], {
                          [styles["item-active"]]:
                            location.pathname === item.to,
                        })}
                      >
                        {item.title}
                      </Link>
                    </List.Item>
                  )}
                />
              </div>
            </div>
          </Sider>
          {/* <Content className={styles["content-wrapper"]}>
            <Title level={2} className={styles["heading-text"]}>
              {CONTENT.HEADING_TAXES}
            </Title>
            <div className={styles["cards-wrapper"]}>
              <div className={styles["card-item"]}>
                <div className={styles["card-inner"]}>
                  <div className={styles["taxes-heading"]}>
                    <Text>{CONTENT.CARD_TAXES_HEADING}</Text>
                    <Text>
                      {CONTENT.CARD_TAXES_DATE} <InfoCircleOutlined />
                    </Text>
                  </div>
                  <div className={styles["amount-inner"]}>
                    <Text className={styles["currency-amount"]}>
                      {new Intl.NumberFormat("ru", {
                        style: "currency",
                        currency: "RUB", // Change this
                      }).format(1000)}
                    </Text>
                    <Text style={{ whiteSpace: "nowrap" }}>
                      {CONTENT.CARD_TAXES_PAID +
                        new Intl.NumberFormat("ru", {
                          style: "currency",
                          currency: "RUB", // Change this
                        }).format(100500.23)}
                    </Text>
                  </div>
                  <Button
                    className={cn(styles["taxes-button"], {
                      [styles["button-paid"]]: true,
                    })}
                    disabled
                  >
                    <CheckCircleOutlined />
                    {CONTENT.CARD_TAXES_BUTTON_PAID}
                  </Button>
                </div>
              </div>
              <div className={cn(styles["card-item"], styles["card-fix"])}>
                <div className={styles["card-inner"]}>
                  <div className={styles["taxes-heading"]}>
                    <Text>{CONTENT.CARD_FIX_PAYMENT}</Text>
                    <Text>
                      {CONTENT.CARD_FIX_PAYMENT_DATE} <InfoCircleOutlined />
                    </Text>
                  </div>
                  <div className={styles["amount-inner"]}>
                    <Text className={styles["currency-amount"]}>
                      {new Intl.NumberFormat("ru", {
                        style: "currency",
                        currency: "RUB", // Change this
                      }).format(1000)}
                    </Text>
                    <Text style={{ whiteSpace: "nowrap" }}>
                      {CONTENT.CARD_TAXES_PAID +
                        new Intl.NumberFormat("ru", {
                          style: "currency",
                          currency: "RUB", // Change this
                        }).format(18564.12)}
                    </Text>
                  </div>
                  <Button className={styles["taxes-button"]}>
                    {CONTENT.BUTTON_ADD_PAYMENT_TEXT}
                  </Button>
                </div>
              </div>
              <div className={cn(styles["card-item"], styles["card-super"])}>
                <div className={styles["card-inner"]}>
                  <div className={styles["taxes-heading"]}>
                    <Text>{CONTENT.CARD_SUPER_PROFITS}</Text>
                    <Text>
                      {CONTENT.CARD_SUPER_PROFITS_DATE} <InfoCircleOutlined />
                    </Text>
                  </div>
                  <div className={styles["amount-inner"]}>
                    <Text className={styles["currency-amount"]}>
                      {new Intl.NumberFormat("ru", {
                        style: "currency",
                        currency: "RUB", // Change this
                      }).format(1000)}
                    </Text>
                    <Text style={{ whiteSpace: "nowrap" }}>
                      {CONTENT.CARD_TAXES_PAID +
                        new Intl.NumberFormat("ru", {
                          style: "currency",
                          currency: "RUB", // Change this
                        }).format(6500)}
                    </Text>
                  </div>
                  <Button className={styles["taxes-button"]}>
                    {CONTENT.BUTTON_ADD_PAYMENT_TEXT}
                  </Button>
                </div>
              </div>
            </div>
            <div className={styles["remark-wrapper"]}>
              <Button className={styles["remark-button"]}>
                {CONTENT.BUTTON_ENS_TEXT}
              </Button>
              <div className={styles["remark-text"]}>
                <Text>{CONTENT.ENS_ANALYSIS_TEXT}</Text>
                <Link
                  className={styles["link-details"]}
                  style={{ color: "#6159ff", whiteSpace: "nowrap" }}
                >
                  {CONTENT.TEXT_DETAILS}
                </Link>
              </div>
            </div>
            <div className={styles["income-table "]}>
              <Title level={3}>{CONTENT.HEADING_INCOME}</Title>
              <div className={styles["income-header-wrapper"]}>
                <DatePicker.RangePicker
                  placeholder={["от", "до"]}
                  className={styles["datepicker-item"]}
                />
                <Select
                  placeholder={CONTENT.SELECT_ACCOUNT_NUMBER}
                  className={styles["account-select"]}
                />
                <Select
                  placeholder={CONTENT.SELECT_OPERATION_TYPE}
                  className={styles["operation-select"]}
                />
              </div>
              <Table
                columns={columns}
                dataSource={dataSource}
                pagination={false}
              ></Table>
            </div>
          </Content>
          <Sider
            className={styles["right-sider-wrapper"]}
            width={320}
            breakpoint="lg"
            collapsedWidth="0"
          >
            <Text>{CONTENT.CLIENT_NAME}</Text>
            <Title level={3}>{CONTENT.HEADING_DATA_SOURCES}</Title>
            <div className={styles["sider-buttons"]}>
              <Button className={styles["default-button"]}>
                {CONTENT.BUTTON_SIDER_ADD_TEXT}
              </Button>
              <Button className={styles["default-button"]}>
                {CONTENT.BUTTON_SIDER_EDIT_TEXT}
              </Button>
            </div>
            <Title level={4}>{CONTENT.HEADING_BANKS}</Title>
            <List
              dataSource={data_banks}
              renderItem={(item) => (
                <List.Item
                  className={styles["list-item-right"]}
                  style={{ borderBlockEnd: "none" }}
                >
                  <Text>{item}</Text>
                  <Text>{CONTENT.DEFAULT_DATE}</Text>
                </List.Item>
              )}
            />
            <Title level={4}>{CONTENT.HEADING_CASHIERS}</Title>
            <List
              dataSource={data_cashiers}
              renderItem={(item) => (
                <List.Item
                  className={styles["list-item-right"]}
                  style={{ borderBlockEnd: "none" }}
                >
                  <Text>{item}</Text>
                  <Text>{CONTENT.DEFAULT_DATE}</Text>
                </List.Item>
              )}
            />
            <Title level={4}>{CONTENT.HEADING_MARKETPLACES}</Title>
            <List
              dataSource={data_marketplaces}
              renderItem={(item) => (
                <List.Item
                  className={styles["list-item-right"]}
                  style={{ borderBlockEnd: "none" }}
                >
                  <Text>{item}</Text>
                  <Text>{CONTENT.DEFAULT_DATE_STRING}</Text>
                </List.Item>
              )}
            />
          </Sider> */}
          <Outlet />
        </Layout>
      </ConfigProvider>
    </>
  )
}
