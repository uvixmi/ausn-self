import {
  Button,
  DatePicker,
  Layout,
  List,
  Select,
  Table,
  Typography,
  message,
} from "antd"
import Link from "antd/es/typography/Link"
import { CONTENT } from "./constants"
import styles from "./styles.module.scss"
import cn from "classnames"
import {
  CheckCircleOutlined,
  InfoCircleOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons"
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
import { TrashIcon } from "./type-operation/icons/trash-icon"
import { InProgressIcon } from "./type-operation/icons/in-progress"
import { FailedIcon } from "./type-operation/icons/failed"
import { CompletedHandIcon } from "./type-operation/icons/completed-hand"
import { CompletedAutoIcon } from "./type-operation/icons/completed-auto"
import {
  convertDateFormat,
  convertReverseFormat,
} from "../actions-page/payment-modal/utils"
import { DeleteOperationModal } from "./delete-modal"
import { NonTaxesImage } from "./images/non-operations"
import { PencilIcon } from "./type-operation/icons/pencil"

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

  const optionsTypesSelect = [
    {
      label: (
        <div
          className={cn(styles["type-inner-select"], [styles["type-income"]])}
        >
          <IncomeIcon />
          <Text
            className={cn(styles["type-text-select"], [styles["type-income"]])}
          >
            {"Доход"}
          </Text>
        </div>
      ),
      value: 1,
    },
    {
      label: (
        <div className={cn(styles["type-inner-select"], [styles["type-non"]])}>
          <NonIcon />
          <Text
            className={cn(styles["type-text-select"], [styles["type-non"]])}
          >
            {"Не учитывается"}
          </Text>
        </div>
      ),
      value: 2,
    },
    {
      label: (
        <div className={cn(styles["type-inner-select"], [styles["type-back"]])}>
          <BackIcon />
          <Text
            className={cn(styles["type-text-select"], [styles["type-back"]])}
          >
            {"Возврат"}
          </Text>
        </div>
      ),
      value: 3,
    },
    {
      label: (
        <div
          className={cn(styles["type-inner-select"], [styles["type-taxes"]])}
        >
          <TaxesIcon />
          <Text
            className={cn(styles["type-text-select"], [styles["type-taxes"]])}
          >
            {"Налоги и взносы"}
          </Text>
        </div>
      ),
      value: 4,
    },
  ]

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

  const optionsSources =
    sources?.sources &&
    sources.sources
      .filter((item) => item.id)
      .map((item) => {
        const subName = item.sub_name ? " *" + item.sub_name?.slice(-4) : ""
        return {
          label: item.name + subName,
          value: item.id,
        }
      })

  const sourcesAutoSider =
    sources && sources.sources?.filter((item) => item.is_integrated)
  const sourcesHandSider =
    sources && sources.sources?.filter((item) => !item.is_integrated)
  const [deleteModalOpen, setIsDeleteModalOpen] = useState(false)
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
    setPagination({
      page_number: 1,
      row_count: 30,
      request_id: v4(),
    })
    setSelectedSources(selectedSources)
    setIsFetching(true)
    if (selectedSources.length === 0) setEndOfPage(false)
  }

  const handleChangeMarkup = async (newMarkup: number) => {
    try {
      if (hoveredIndex && hoveredAmount) {
        await api.operations.updateOperationOperationsMarkupPut(
          { operation_id: hoveredIndex },
          { operation_type: newMarkup, amount: hoveredAmount },
          { headers }
        )
        successMarkup()
      }
    } catch (error) {
      errorMarkup()
    }
  }

  const handleOperationTypesChange = (
    selectedOperationTypes: OperationType[]
  ) => {
    setPagination({
      page_number: 1,
      row_count: 30,
      request_id: v4(),
    })
    setSelectedOperationTypes(selectedOperationTypes)
    setIsFetching(true)
    if (selectedOperationTypes.length === 0) setEndOfPage(false)
  }

  const handleDateRangeChange = (dateStrings: string[]) => {
    if (dateStrings[0] != "" && dateStrings[1] != "") {
      setPagination({
        page_number: 1,
        row_count: 30,
        request_id: v4(),
      })

      setSelectedStartDate(convertDateFormat(dateStrings[0]))
      setSelectedEndDate(convertDateFormat(dateStrings[1]))
      setIsFetching(true)
    } else {
      setEndOfPage(false)
      setSelectedStartDate("")
      setSelectedEndDate("")
      setIsFetching(true)
    }
  }
  const [isFetching, setIsFetching] = useState(true)
  const [endOfPage, setEndOfPage] = useState(false)
  /*const handleScroll = () => {
    if (bottomBlockRef.current && !endOfPage) {
      const isBottom =
        window.innerHeight + window.scrollY >=
        bottomBlockRef.current.getBoundingClientRect().bottom

      if (isBottom && !isFetching) {
        setIsFetching(true)

        if (!endOfPage) {
          debugger
          setPagination((prevPagination) => ({
            ...prevPagination,
            page_number: prevPagination.page_number + 1,
          }))
        }
      }
    }
  }
*/
  const handleUpdateScroll = (e: Event) => {
    if (
      e instanceof Event &&
      e.target instanceof Document &&
      e.target.documentElement.scrollHeight -
        (e.target.documentElement.scrollTop + window.innerHeight) <
        100 &&
      operationsData?.pages_count !== pagination.page_number
    ) {
      setIsFetching(true)
    }
  }
  useEffect(() => {
    const fetchOperations = async () => {
      if (isFetching) {
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

        if (pagination.page_number === 1) {
          setOperationsData((prevData) => ({
            operations: [...operations.data.operations],
            pages_count: operations.data.pages_count,
          }))
        } else {
          setOperationsData((prevData) => ({
            ...prevData,
            operations: [
              ...(prevData?.operations || []),
              ...operations.data.operations,
            ],
            pages_count: operations.data.pages_count,
          }))
        }
        setPagination((prevPagination) => ({
          ...prevPagination,
          page_number: prevPagination.page_number + 1,
        }))
        setIsFetching(false)
      }
    }
    fetchOperations()
  }, [
    isFetching,
    selectedEndDate,
    selectedOperationTypes,
    selectedSources,
    selectedStartDate,
  ])

  useEffect(() => {
    document.addEventListener("scroll", handleUpdateScroll)

    return () => {
      document.removeEventListener("scroll", handleUpdateScroll)
    }
  }, [])

  const [messageApi, contextHolder] = message.useMessage()
  const successMarkup = () => {
    messageApi.open({
      type: "success",
      content: CONTENT.NOTIFICATION_MARKUP_SUCCESS,
      style: { textAlign: "right" },
    })
  }

  const errorMarkup = () => {
    messageApi.open({
      type: "error",
      content: CONTENT.NOTIFICATION_MARKUP_FAILED,
      style: { textAlign: "right" },
    })
  }

  const [groupedOperations, setGroupedOperations] = useState<
    Record<string, Operation[]>
  >({})

  /*useEffect(() => {
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
        if (
          pagination.page_number === 1 &&
          operations.data.operations.length === 0
        ) {
          setOperationsData((prevData) => ({
            operations: [...operations.data.operations],
            pages_count: operations.data.pages_count,
          }))
          setIsFetching(false)
        } else if (pagination.page_number === 1) {
          setOperationsData((prevData) => ({
            operations: [...operations.data.operations],
            pages_count: operations.data.pages_count,
          }))
          setIsFetching(false)
        } else {
          setOperationsData((prevData) => ({
            ...prevData,
            operations: [
              ...(prevData?.operations || []),
              ...operations.data.operations,
            ],
            pages_count: operations.data.pages_count,
          }))
          setIsFetching(false)
        }
      } catch (error) {
        console.error("Error fetching operations:", error)
        setIsFetching(false)
      }
    }
    fetchOperations()
  }, [
    pagination,
    selectedSources,
    selectedOperationTypes,
    selectedStartDate,
    selectedEndDate,
  ])
*/
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

  /*useEffect(() => {
    if (!isFetching) {
      const updateScroll = () => {
        handleScroll()
      }

      window.addEventListener("scroll", updateScroll)

      return () => {
        window.removeEventListener("scroll", updateScroll)
      }
    }
  }, [isFetching])*/

  const [hoveredIndex, setHoveredIndex] = useState<string | null>(null)
  const [hoveredAmount, setHoveredAmount] = useState<number | null>(null)
  const [selectedOperation, setSelectedOperation] = useState(null)

  return (
    <>
      {contextHolder}
      <Content className={styles["content-wrapper"]}>
        <div className={styles["title-button-header"]}>
          <Title level={2} className={styles["heading-text"]}>
            {CONTENT.HEADING_INCOME}
          </Title>
          <Button
            className={cn(styles["buttons-row-item"], styles["button-make"])}
          >
            <PlusOutlined
              className={styles["plus-icon"]}
              style={{ marginInlineStart: "4px" }}
            />
            {CONTENT.BUTTON_ADD_OPERATION}
          </Button>
        </div>
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
              maxTagCount={1}
            />
            <Select
              placeholder={CONTENT.SELECT_OPERATION_TYPE}
              className={styles["operation-select"]}
              style={{ borderRadius: "4px" }}
              options={optionsTypesSelect}
              onChange={handleOperationTypesChange}
              mode="multiple"
              maxTagCount={1}
            />
            <DatePicker.RangePicker
              locale={locale}
              format={dateFormat}
              placeholder={["от", "до"]}
              className={styles["datepicker-item"]}
              style={{ borderRadius: "4px" }}
              onChange={(dates, dateStrings) =>
                handleDateRangeChange(dateStrings)
              }
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
              {Object.entries(groupedOperations).length > 0 ? (
                Object.entries(groupedOperations).map(([date, operations]) => (
                  <div key={date}>
                    <div className={styles["table-date-row"]}>
                      {formatToPayDate(date)}
                    </div>
                    <div>
                      {operations.map((operation, index) => (
                        <div
                          className={cn(styles["table-info-row"], {
                            [styles["hovered-row"]]:
                              hoveredIndex === operation.id,
                          })}
                          key={operation.id}
                          onMouseEnter={() => {
                            setHoveredIndex(operation.id),
                              setHoveredAmount(operation.amount_doc)
                          }}
                          onMouseLeave={() => {
                            setHoveredIndex(null), setHoveredAmount(null)
                          }}
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
                              defaultValue={operation.markup.operation_type}
                              className={cn(
                                "type-item-select",
                                styles["type-select-inner"]
                              )}
                              onChange={(value) => {
                                handleChangeMarkup(value)
                              }}
                            />
                            {/* <TypeOperation
                              type={
                                operation.markup.operation_type > 0
                                  ? operation.markup.operation_type
                                  : 5
                              }
                            />
                            */}
                            {(operation.markup_mode_code === 2 ||
                              operation.markup_mode_code === 3) && (
                              <PencilIcon />
                            )}
                          </div>
                          <div className={styles["amount-inner"]}>
                            <div
                              className={cn(styles["amount-part"], {
                                [styles["amount-part-hovered"]]:
                                  hoveredIndex === operation.id,
                              })}
                            >
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
                              <Text className={styles["source-account-text"]}>
                                {getSourceText(
                                  operation.source_name,
                                  operation.account_number
                                )}
                              </Text>
                            </div>
                            {hoveredIndex === operation.id && (
                              <Button
                                className={styles["delete-icon"]}
                                onClick={() => setIsDeleteModalOpen(true)}
                              >
                                <DeleteOutlined />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles["non-taxes"]}>
                  <NonTaxesImage />
                  <div className={styles["non-wrapper"]}>
                    <Text className={styles["non-text"]}>
                      {CONTENT.TEXT_NON_TAXES}
                    </Text>
                  </div>
                  <Button className={styles["non-source-button"]}>
                    <PlusOutlined
                      className={styles["plus-non-icon"]}
                      style={{ marginInlineStart: "4px" }}
                    />
                    {CONTENT.BUTTON_ADD_SOURCE_NON}
                  </Button>
                </div>
              )}
              <div ref={bottomBlockRef} style={{ height: "1px" }} />
            </div>
          </div>
        </div>
      </Content>
      <Sider
        className={styles["right-sider-wrapper"]}
        width={340}
        breakpoint="lg"
        collapsedWidth="0"
      >
        {
          //<Text>{CONTENT.CLIENT_NAME}</Text>
        }
        <Title level={3}>{CONTENT.HEADING_DATA_SOURCES}</Title>
        <div className={styles["sider-buttons"]}>
          <Button className={styles["default-button"]}>
            <PlusOutlined
              className={styles["plus-icon"]}
              style={{ marginInlineStart: "4px" }}
            />
            {CONTENT.BUTTON_SIDER_ADD_TEXT}
          </Button>
        </div>
        <Title level={4}>{CONTENT.HEADING_HAND_SOURCERS}</Title>
        <List
          dataSource={sourcesHandSider}
          renderItem={(item) => (
            <List.Item
              className={styles["list-item-right"]}
              style={{ borderBlockEnd: "none" }}
            >
              <div className={styles["source-name"]}>
                {item.state === "in_progress" ? (
                  <InProgressIcon />
                ) : item.state === "failed" ? (
                  <FailedIcon />
                ) : item.state === "completed" &&
                  item.is_integrated === false ? (
                  <CompletedHandIcon />
                ) : item.state === "completed" &&
                  item.is_integrated === true ? (
                  <CompletedAutoIcon />
                ) : null}
                <Text className={styles["source-text-left"]}>{item.name} </Text>
                <Text className={styles["source-text-right"]}>
                  {item.sub_name ? " *" + item.sub_name?.slice(-4) : ""}
                </Text>
              </div>

              {item.state === "completed" && !item.disable_date ? (
                <Text>
                  {item.last_info && convertReverseFormat(item.last_info)}
                </Text>
              ) : item.state === "completed" && item.disable_date ? (
                <Text>{convertReverseFormat(item.disable_date)}</Text>
              ) : item.state === "failed" ? (
                <Link>{"Повторить"}</Link>
              ) : item.state === "in_progress" && item.link ? (
                <Link>{"Подключить"}</Link>
              ) : null}
            </List.Item>
          )}
        />
        <Title level={4}>{CONTENT.HEADING_AUTO_SOURCERS}</Title>
        <List
          dataSource={sourcesAutoSider}
          renderItem={(item) => (
            <List.Item
              className={styles["list-item-right"]}
              style={{ borderBlockEnd: "none" }}
            >
              <div className={styles["source-name"]}>
                {item.state === "in_progress" ? (
                  <InProgressIcon />
                ) : item.state === "failed" ? (
                  <FailedIcon />
                ) : item.state === "completed" &&
                  item.is_integrated === false ? (
                  <CompletedHandIcon />
                ) : item.state === "completed" &&
                  item.is_integrated === true ? (
                  <CompletedAutoIcon />
                ) : null}
                <Text className={styles["source-text-left"]}>{item.name} </Text>
                <Text className={styles["source-text-right"]}>
                  {item.sub_name ? " *" + item.sub_name?.slice(-4) : ""}
                </Text>
              </div>
              {item.state === "completed" && !item.disable_date ? (
                <Text>
                  {item.last_info && convertReverseFormat(item.last_info)}
                </Text>
              ) : item.state === "completed" && item.disable_date ? (
                <Text>{convertReverseFormat(item.disable_date)}</Text>
              ) : item.state === "failed" ? (
                <Link>{"Повторить"}</Link>
              ) : item.state === "in_progress" && item.link ? (
                <Link>{"Подключить"}</Link>
              ) : null}
            </List.Item>
          )}
        />
      </Sider>
      <DeleteOperationModal
        isOpen={deleteModalOpen}
        setOpen={setIsDeleteModalOpen}
        id={hoveredIndex}
      />
    </>
  )
}
