import {
  Button,
  ConfigProvider,
  DatePicker,
  Layout,
  List,
  Select,
  Table,
  Typography,
} from "antd"
import Link from "antd/es/typography/Link"
import { CONTENT } from "./constants"
import styles from "./styles.module.scss"
import cn from "classnames"
import { CheckCircleOutlined, InfoCircleOutlined } from "@ant-design/icons"

export const TaxesPage = () => {
  const { Sider, Content } = Layout
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

  const data_banks = [CONTENT.BANK_SBER, CONTENT.BANK_VTB, CONTENT.BANK_ALPHA]

  const data_cashiers = [CONTENT.CASHIERS_FIRST]

  const data_marketplaces = [
    CONTENT.MARKETPLACE_WILDBERRIES,
    CONTENT.MARKETPLACE_OZON,
  ]

  return (
    <>
      <Content className={styles["content-wrapper"]}>
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
      </Sider>
    </>
  )
}
