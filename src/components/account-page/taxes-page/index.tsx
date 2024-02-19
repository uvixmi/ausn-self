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
import { useEffect, useRef, useState } from "react"
import { v4 as uuid, v4 } from "uuid"
import { useDispatch } from "react-redux"
import "./styles.scss"
import {
  GetOperationsRequest,
  Operation,
  OperationType,
  OperationsResponse,
  SourcesInfo,
  api,
} from "../../../api/myApi"
import { AppDispatch } from "../../main-page/store"
import Cookies from "js-cookie"
import { formatToPayDate } from "../../main-page/utils"
import { TypeOperation } from "./type-operation"
import { getCurrency } from "../actions-page/utils"
import { getSourceText } from "./utils"
import { IncomeIcon } from "./type-operation/icons/income"
import { TaxesIcon } from "./type-operation/icons/taxes"
import { BackIcon } from "./type-operation/icons/back"
import { NonIcon } from "./type-operation/icons/non"
import dayjs from "dayjs"
import "dayjs/locale/ru"
import locale from "antd/lib/date-picker/locale/ru_RU"

export const TaxesPage = () => {
  const { Sider, Content } = Layout
  const { Title, Text } = Typography
  const dateFormat = "DD.MM.YYYY"
  dayjs.locale("ru")
  const columns = [
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

  const data_banks = [CONTENT.BANK_SBER, CONTENT.BANK_VTB, CONTENT.BANK_ALPHA]

  const data_cashiers = [CONTENT.CASHIERS_FIRST]

  const data_marketplaces = [
    CONTENT.MARKETPLACE_WILDBERRIES,
    CONTENT.MARKETPLACE_OZON,
  ]

  const dispatch = useDispatch<AppDispatch>()
  const token = Cookies.get("token")
  const headers = {
    Authorization: `Bearer ${token}`,
  }

  const [operationsData, setOperationsData] =
    useState<OperationsResponse | null>(null)

  const [sources, setSources] = useState<SourcesInfo | undefined>(undefined)

  const optionsTypes = [
    {
      label: (
        <div className={cn(styles["type-inner"], [styles["type-income"]])}>
          <IncomeIcon />
          <Text className={cn(styles["type-text"], [styles["type-income"]])}>
            {"Доход"}
          </Text>
        </div>
      ),
      value: 1,
    },
    {
      label: (
        <div className={cn(styles["type-inner"], [styles["type-non"]])}>
          <NonIcon />
          <Text className={cn(styles["type-text"], [styles["type-non"]])}>
            {"Не учитывается"}
          </Text>
        </div>
      ),
      value: 2,
    },
    {
      label: (
        <div className={cn(styles["type-inner"], [styles["type-back"]])}>
          <BackIcon />
          <Text className={cn(styles["type-text"], [styles["type-back"]])}>
            {"Возврат"}
          </Text>
        </div>
      ),
      value: 3,
    },
    {
      label: (
        <div className={cn(styles["type-inner"], [styles["type-taxes"]])}>
          <TaxesIcon />
          <Text className={cn(styles["type-text"], [styles["type-taxes"]])}>
            {"Налоги и взносы"}
          </Text>
        </div>
      ),
      value: 4,
    },
  ]

  const optionsSourcesOne =
    (sources?.accounts &&
      sources.accounts.map((item) => {
        return {
          label: item.bank_name + " *" + item.account_number.slice(-4),
          value: item.account_number,
        }
      })) ||
    []

  const optionsMarketplaces =
    (sources?.marketplaces &&
      sources?.marketplaces.map((item) => {
        return {
          label: item.marketplace_name,
          value: item.marketplace_id,
        }
      })) ||
    []

  const optionsOFDs =
    (sources?.ofd &&
      sources?.ofd.map((item) => {
        return {
          label: item.ofd_name,
          value: item.ofd_name,
        }
      })) ||
    []

  const optionsSources = [
    ...optionsSourcesOne,
    ...optionsMarketplaces,
    ...optionsOFDs,
  ].filter(Boolean)

  useEffect(() => {
    const fetchOperations = async () => {
      const sourcesResponse = await api.sources.getSourcesInfoSourcesGet({
        headers,
      })
      setSources(sourcesResponse.data)
    }
    fetchOperations()
  }, [])

  const [pagination, setPagination] = useState({
    page_number: 1,
    row_count: 30,
    request_id: v4(),
  })

  const [selectedSources, setSelectedSources] = useState<string[]>([])
  const [selectedOperationTypes, setSelectedOperationTypes] = useState<
    OperationType[]
  >([])
  const [selectedStartDate, setSelectedStartDate] = useState<string | null>(
    null
  )
  const [selectedEndDate, setSelectedEndDate] = useState<string | null>(null)

  const bottomBlockRef = useRef<HTMLDivElement>(null)

  // Обработчики изменений фильтров, если необходимо
  const handleSourcesChange = (selectedSources: string[]) => {
    setSelectedSources(selectedSources)
    // Дополнительные действия при изменении выбора источников
  }

  const handleOperationTypesChange = (
    selectedOperationTypes: OperationType[]
  ) => {
    setSelectedOperationTypes(selectedOperationTypes)
    // Дополнительные действия при изменении выбора типов операций
  }

  const handleDateRangeChange = (
    startDate: string | null,
    endDate: string | null
  ) => {
    setSelectedStartDate(startDate)
    setSelectedEndDate(endDate)
    // Дополнительные действия при изменении дат
  }
  const isFetching = useRef(false)
  const [endOfPage, setEndOfPage] = useState(false)
  const handleScroll = () => {
    if (bottomBlockRef.current && !endOfPage) {
      const isBottom =
        window.innerHeight + window.scrollY >=
        bottomBlockRef.current.getBoundingClientRect().bottom

      if (isBottom && !isFetching.current) {
        isFetching.current = true

        if (!endOfPage) {
          setPagination((prevPagination) => ({
            ...prevPagination,
            page_number: prevPagination.page_number + 1,
          }))
        }
      }
    }
  }

  const [groupedOperations, setGroupedOperations] = useState<
    Record<string, Operation[]>
  >({})

  useEffect(() => {
    const fetchOperations = async () => {
      try {
        if (endOfPage) {
          console.log("Достигнут конец страницы")
          return
        }
        const filters: GetOperationsRequest = {
          start_date: selectedStartDate || undefined,
          end_date: selectedEndDate || undefined,
          operations_types:
            selectedOperationTypes.length > 0
              ? selectedOperationTypes
              : undefined,
          sources_ids: selectedSources.length > 0 ? selectedSources : undefined,
          pagination: { ...pagination },
        }

        const operations = await api.operations.getOperationsOperationsPost(
          filters,
          { headers }
        )
        if (operations.data.pages_count === 0) {
          console.log("Достигнут конец страницы")

          setEndOfPage(true)
        }
        setOperationsData((prevData) => ({
          ...prevData,
          operations: [
            ...(prevData?.operations || []),
            ...operations.data.operations,
          ],
          pages_count: operations.data.pages_count,
        }))
      } catch (error) {
        console.error("Error fetching operations:", error)
      }
    }
    fetchOperations()
    isFetching.current = false
  }, [pagination])

  useEffect(() => {
    const updatedGroupedOperations: Record<string, Operation[]> = {}

    operationsData?.operations.forEach((operation) => {
      const date = operation.date

      if (!updatedGroupedOperations[date]) {
        updatedGroupedOperations[date] = []
      }

      updatedGroupedOperations[date].push(operation)
    })

    setGroupedOperations(updatedGroupedOperations)
  }, [operationsData])

  useEffect(() => {
    const updateScroll = () => {
      handleScroll()
    }

    window.addEventListener("scroll", updateScroll)

    return () => {
      window.removeEventListener("scroll", updateScroll)
    }
  }, [isFetching])

  return (
    <>
      <Content className={styles["content-wrapper"]}>
        <Title level={2} className={styles["heading-text"]}>
          {CONTENT.HEADING_INCOME}
        </Title>
        {/* <div className={styles["cards-wrapper"]}>
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
        </div>*/}
        <div className={styles["income-table"]}>
          <div className={styles["income-header-wrapper"]}>
            <Select
              placeholder={CONTENT.SELECT_ACCOUNT_NUMBER}
              className={styles["account-select"]}
              options={optionsSources}
              style={{ borderRadius: "4px" }}
              onChange={handleSourcesChange}
              mode="multiple"
            />
            <Select
              placeholder={CONTENT.SELECT_OPERATION_TYPE}
              className={styles["operation-select"]}
              style={{ borderRadius: "4px" }}
              options={optionsTypes}
            />
            <DatePicker.RangePicker
              locale={locale}
              format={dateFormat}
              placeholder={["от", "до"]}
              className={styles["datepicker-item"]}
              style={{ borderRadius: "4px" }}
            />
          </div>
          {
            //<Table columns={columns} dataSource={dataSource} pagination={false} />
          }
          <div className={styles["operations-table-wrapper"]}>
            <div className={styles["operations-table-inner"]}>
              <div className={styles["table-header"]}>
                {columns.map((item) => (
                  <div className={styles["table-header-title"]}>
                    {item.title}
                  </div>
                ))}
              </div>
              {Object.entries(groupedOperations).map(([date, operations]) => (
                <div key={date}>
                  <div className={styles["table-date-row"]}>
                    {formatToPayDate(date)}
                  </div>
                  <div>
                    {operations.map((operation) => (
                      <div
                        className={styles["table-info-row"]}
                        key={operation.id}
                      >
                        <div className={styles["source-inner"]}>
                          <Text className={styles["source-title"]}>
                            {operation.counterparty_name}
                          </Text>
                          <Text className={styles["source-text"]}>
                            {operation.purpose}
                          </Text>
                        </div>
                        <div className={styles["operation-type-inner"]}>
                          <Select
                            options={optionsTypes}
                            defaultValue={optionsTypes.filter(
                              (item) =>
                                item.value === operation.markup.operation_type
                            )}
                            className={"type-item-select"}
                            style={{ minWidth: "100px" }}
                          />
                          {/* <TypeOperation
                              type={
                                operation.markup.operation_type > 0
                                  ? operation.markup.operation_type
                                  : 5
                              }
                            />
                            */}
                        </div>
                        <div className={styles["amount-inner"]}>
                          <Text className={styles["currency-income"]}>
                            {operation.markup.amount > 0
                              ? getCurrency(
                                  operation.markup.amount,
                                  operation.category
                                )
                              : getCurrency(
                                  operation.amount_doc,
                                  operation.category
                                )}
                          </Text>
                          <Text>
                            {getSourceText(
                              operation.source_name,
                              operation.account_number
                            )}
                          </Text>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div ref={bottomBlockRef} style={{ height: "1px" }} />
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
