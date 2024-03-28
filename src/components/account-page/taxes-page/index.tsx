import {
  Button,
  Collapse,
  DatePicker,
  Drawer,
  Layout,
  List,
  Select,
  Table,
  Tooltip,
  Typography,
  message,
} from "antd"
import Link from "antd/es/typography/Link"
import { CONTENT } from "./constants"
import styles from "./styles.module.scss"
import cn from "classnames"
import {
  InfoCircleOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons"
import { useCallback, useEffect, useRef, useState } from "react"
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
import { AddSourceModal } from "./add-source-modal"
import { ArrowCounterIcon } from "./type-operation/icons/arrow-counter"
import { fetchSourcesInfo } from "../client/sources/thunks"
import { AddOperationModal } from "./add-operation-modal"
import { DeleteSourceIcon } from "./type-operation/icons/delete-source"
import { OffSourceModal } from "./off-source-modal"
import { useMediaQuery } from "@react-hook/media-query"
import { InProgressOrangeIcon } from "./type-operation/icons/in-progress-orange"
import { OpenSourceIcon } from "./type-operation/icons/open-source"
import { DownloadKudirModal } from "./download-kudir-modal"

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

  const dispatch = useDispatch<AppDispatch>()
  const token = Cookies.get("token")
  const headers = {
    Authorization: `Bearer ${token}`,
  }

  const [operationsData, setOperationsData] =
    useState<OperationsResponse | null>(null)

  const [sources, setSources] = useState<SourcesInfo | undefined>(undefined)
  const [operationsLoaded, setOperationsLoaded] = useState(false)
  const [groupedOperationsLoaded, setGroupedOperationsLoaded] = useState(false)
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
          label: item.short_name
            ? item.short_name + subName
            : item.name + subName,
          value: item.id,
        }
      })

  const sourcesAutoSider =
    sources &&
    sources.sources?.filter(
      (item) => item.is_integrated && item.name !== "Ручной ввод"
    )
  const sourcesHandSider =
    sources &&
    sources.sources?.filter(
      (item) => !item.is_integrated && item.name !== "Ручной ввод"
    )
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
      setPagination({
        page_number: 1,
        row_count: 30,
        request_id: v4(),
      })
      setEndOfPage(false)
      setSelectedStartDate(null)
      setSelectedEndDate(null)
      setIsFetching(true)
    }
  }
  const [isFetching, setIsFetching] = useState(true)
  const [endOfPage, setEndOfPage] = useState(false)
  const [isAddSourceOpen, setIsAddSourceOpen] = useState(false)

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

  const fetchOperations = useCallback(async () => {
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
      setOperationsLoaded(true)
    }
  }, [
    isFetching,
    selectedEndDate,
    selectedOperationTypes,
    selectedSources,
    selectedStartDate,
    pagination,
  ])

  useEffect(() => {
    fetchOperations()
  }, [fetchOperations])

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
    operationsData && setGroupedOperationsLoaded(true)
  }, [operationsData])

  const [hoveredIndex, setHoveredIndex] = useState<string | null>(null)
  const [hoveredAmount, setHoveredAmount] = useState<number | null>(null)
  const [addOperation, setAddOperation] = useState(false)

  const [wasDeleted, setWasDeleted] = useState(false)

  useEffect(() => {
    if (wasDeleted === true) {
      setPagination({
        page_number: 1,
        row_count: 30,
        request_id: v4(),
      })
      setWasDeleted(false)
      setIsFetching(true)
    }
  }, [wasDeleted])

  const [isDeletedSource, setIsDeletedSource] = useState(false)
  const [offSourceTitle, setOffSourceTitle] = useState("")
  const [typeSource, setTypeSource] = useState(0)
  const [typeSourceName, setTypeSourceName] = useState("")
  const [accountSource, setAccountSource] = useState("")
  const [offSourceId, setOffSourceId] = useState<string | undefined | null>("")
  const [sourceCompleted, setSourceCompleted] = useState<number | null>(null)

  const handleCompletedSource = (completedSource: number | null) => {
    setSourceCompleted(completedSource)
    if (completedSource === 1) {
      setIsAddSourceOpen(true)
    }
    if (completedSource === 2) {
      setIsAddSourceOpen(true)
    }
  }

  const isMobile = useMediaQuery("(max-width: 767px)")

  const [downloadKudir, setDownloadKudir] = useState(false)

  const collapseItems = [
    {
      key: 1,
      label: CONTENT.FILTER_HEADING,
      children: (
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
      ),
    },
  ]

  const [isOpenDrawer, setIsOpenDrawer] = useState(false)

  const showDrawer = () => {
    setIsOpenDrawer(true)
  }

  const closeDrawer = () => {
    setIsOpenDrawer(false)
  }
  return (
    <>
      {contextHolder}
      <Content className={styles["content-wrapper"]}>
        <div className={styles["title-button-header"]}>
          {isMobile && (
            <div className={styles["open-source-wrapper"]}>
              <Button
                className={styles["no-border-button"]}
                onClick={showDrawer}
              >
                <OpenSourceIcon />
              </Button>
            </div>
          )}
          <Title level={2} className={styles["heading-text"]}>
            {CONTENT.HEADING_INCOME}
          </Title>
          <div className={styles["buttons-header"]}>
            <Button
              className={styles["kudir-button"]}
              onClick={() => setDownloadKudir(true)}
            >
              {CONTENT.BUTTON_DOWNLOAD_KUDIR}
            </Button>
            <Button
              className={cn(styles["buttons-row-item"], styles["button-make"])}
              onClick={() => setAddOperation(true)}
            >
              <PlusOutlined
                className={styles["plus-icon"]}
                style={{ marginInlineStart: "4px" }}
              />
              {CONTENT.BUTTON_ADD_OPERATION}
            </Button>
          </div>
        </div>

        <div className={styles["income-table"]}>
          {isMobile ? (
            <Collapse
              items={collapseItems}
              bordered={false}
              className="filter-collapse"
              ghost
              expandIconPosition="end"
            />
          ) : (
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
          )}

          <div className={styles["operations-table-wrapper"]}>
            <div className={styles["operations-table-inner"]}>
              {!isMobile && (
                <div className={styles["table-header"]}>
                  {columns.map((item, index) => (
                    <div className={styles["table-header-title"]} key={index}>
                      {item.title}
                    </div>
                  ))}
                </div>
              )}
              {Object.entries(groupedOperations).length > 0
                ? Object.entries(groupedOperations).map(
                    ([date, operations]) => (
                      <div key={date}>
                        <div className={styles["table-date-row"]}>
                          {formatToPayDate(date)}
                        </div>
                        <div>
                          {operations.map((operation, index) => (
                            <>
                              <div
                                className={cn(styles["table-info-row"], {
                                  [styles["hovered-row"]]:
                                    hoveredIndex === operation.id,
                                })}
                                key={operation.id}
                                onMouseEnter={() => {
                                  setHoveredIndex(operation.id),
                                    setHoveredAmount(operation.markup.amount)
                                }}
                              >
                                <div className={styles["source-inner"]}>
                                  <Text className={styles["source-title"]}>
                                    {operation.counterparty_name ||
                                      "Нет контрагента"}
                                  </Text>
                                  <Text className={styles["source-text"]}>
                                    {operation.purpose || "Нет данных"}
                                  </Text>
                                </div>
                                <div
                                  className={styles["operation-type-wrapper"]}
                                >
                                  <div
                                    className={styles["operation-type-inner"]}
                                  >
                                    <Select
                                      options={
                                        operation.category === "debet"
                                          ? optionsTypes.filter(
                                              (item) => item.value !== 3
                                            )
                                          : operation.category === "credit"
                                          ? optionsTypes.filter(
                                              (item) => item.value !== 1
                                            )
                                          : optionsTypes
                                      }
                                      defaultValue={
                                        operation.markup.operation_type
                                      }
                                      dropdownStyle={{
                                        width: "max-content",
                                      }}
                                      className={cn(
                                        "type-item-select",
                                        styles["type-select-inner"]
                                      )}
                                      onChange={(value) => {
                                        handleChangeMarkup(value)
                                      }}
                                    />

                                    {(operation.markup_mode_code === 2 ||
                                      operation.markup_mode_code === 3) && (
                                      <PencilIcon />
                                    )}
                                  </div>
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
                                    <Text
                                      className={styles["source-account-text"]}
                                    >
                                      {getSourceText(
                                        operation.source_name,
                                        operation.account_number,
                                        sources?.sources?.find(
                                          (source) =>
                                            source.id === operation.source_id
                                        )
                                          ? sources?.sources?.find(
                                              (source) =>
                                                source.id ===
                                                operation.source_id
                                            )?.short_name
                                          : undefined
                                      )}
                                    </Text>
                                  </div>
                                  {
                                    <Button
                                      className={styles["delete-icon"]}
                                      onClick={() => setIsDeleteModalOpen(true)}
                                    >
                                      <DeleteOutlined />
                                    </Button>
                                  }
                                </div>
                              </div>
                              {isMobile && (
                                <div className={styles["divider"]}></div>
                              )}
                            </>
                          ))}
                        </div>
                      </div>
                    )
                  )
                : groupedOperationsLoaded && (
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
      {!isMobile && (
        <Sider
          className={styles["right-sider-wrapper"]}
          width={340}
          breakpoint="lg"
          collapsedWidth="0"
        >
          <Title level={3}>
            {CONTENT.HEADING_DATA_SOURCES}{" "}
            <Button
              onClick={() => dispatch(fetchSourcesInfo())}
              className={styles["refresh-sources"]}
            >
              <ArrowCounterIcon />
            </Button>
          </Title>

          <div className={styles["sider-buttons"]}>
            <Button
              className={styles["default-button"]}
              onClick={() => setIsAddSourceOpen(true)}
            >
              <PlusOutlined
                className={styles["plus-icon"]}
                style={{ marginInlineStart: "4px" }}
              />
              {CONTENT.BUTTON_SIDER_ADD_TEXT}
            </Button>
          </div>
          {sourcesHandSider && sourcesHandSider.length > 0 && (
            <>
              <Title level={4}>
                {CONTENT.HEADING_HAND_SOURCERS + " "}
                <Tooltip title={CONTENT.HAND_LOAD_INFO_TOOLTIP}>
                  <InfoCircleOutlined
                    className={styles["sider-icon"]}
                    size={24}
                  />
                </Tooltip>
              </Title>
              <List
                dataSource={sourcesHandSider}
                renderItem={(item) => (
                  <List.Item
                    className={styles["list-item-right"]}
                    style={{ borderBlockEnd: "none" }}
                  >
                    <div className={styles["left-source-name"]}>
                      {item.state === "in_progress" ? (
                        item.link || item.link == "" ? (
                          <Tooltip title={CONTENT.TOOLTIP_ORANGE}>
                            <InProgressOrangeIcon />
                          </Tooltip>
                        ) : (
                          <Tooltip title={CONTENT.TOOLTIP_GREY}>
                            <InProgressIcon />
                          </Tooltip>
                        )
                      ) : item.state === "failed" ? (
                        <FailedIcon />
                      ) : item.state === "completed" &&
                        item.is_integrated === false ? (
                        <Tooltip title={CONTENT.ADD_SOURCE_COMPLETED}>
                          <Button
                            className={styles["source-completed-icon"]}
                            onClick={() =>
                              handleCompletedSource(
                                item.type === "account"
                                  ? 1
                                  : item.type === "ofd"
                                  ? 2
                                  : null
                              )
                            }
                          >
                            <CompletedHandIcon />
                          </Button>
                        </Tooltip>
                      ) : item.state === "completed" &&
                        item.is_integrated === true ? (
                        <CompletedAutoIcon />
                      ) : null}
                      {item.short_name && item.short_name !== null ? (
                        <Tooltip title={item.name}>
                          <Text className={styles["source-text-left"]}>
                            {item.short_name}{" "}
                          </Text>
                        </Tooltip>
                      ) : (
                        <Text className={styles["source-text-left"]}>
                          {item.name}{" "}
                        </Text>
                      )}

                      <Text className={styles["source-text-right"]}>
                        {item.sub_name ? " *" + item.sub_name?.slice(-4) : ""}
                      </Text>
                    </div>
                    <div className={styles["source-date-inner"]}>
                      <div className={styles["source-date-part"]}>
                        {item.state === "completed" && !item.disable_date ? (
                          <Tooltip title={CONTENT.TOOLTIP_DATE}>
                            <Text>
                              {item.last_info &&
                                convertReverseFormat(item.last_info)}
                            </Text>
                          </Tooltip>
                        ) : item.state === "completed" && item.disable_date ? (
                          <Text>{convertReverseFormat(item.disable_date)}</Text>
                        ) : item.state === "failed" ? (
                          <Link>{"Повторить"}</Link>
                        ) : item.state === "in_progress" ? (
                          item.link ? (
                            <Link>{"Подключить"}</Link>
                          ) : (
                            "—"
                          )
                        ) : null}
                        {!(item.state == "in_progress" && !item.link) && (
                          <Tooltip
                            title={
                              item.is_integrated === false &&
                              item.state === "completed" &&
                              (item.type === "account" || item.type === "ofd")
                                ? CONTENT.OFF_SOURCE
                                : item.state === "failed"
                                ? CONTENT.DELETE_SOURCE
                                : item.is_integrated === true &&
                                  item.state === "in_progress" &&
                                  !!item.link
                                ? CONTENT.CANCEL_INTEGRATION_SOURCE
                                : item.is_integrated === true &&
                                  item.state === "completed"
                                ? CONTENT.OFF_INTEGRATION_SOURCE
                                : ""
                            }
                          >
                            <Button
                              className={styles["source-delete-icon"]}
                              onClick={() => {
                                setIsDeletedSource(true)
                                setOffSourceTitle(
                                  item.is_integrated === false &&
                                    item.state === "completed" &&
                                    (item.type === "account" ||
                                      item.type === "ofd")
                                    ? CONTENT.OFF_SOURCE
                                    : item.state === "failed"
                                    ? CONTENT.DELETE_SOURCE
                                    : item.is_integrated === true &&
                                      item.state === "in_progress" &&
                                      !!item.link
                                    ? CONTENT.CANCEL_INTEGRATION_SOURCE
                                    : item.is_integrated === true &&
                                      item.state === "completed"
                                    ? CONTENT.OFF_INTEGRATION_SOURCE
                                    : ""
                                )
                                setTypeSource(
                                  item.is_integrated === false &&
                                    item.state === "completed" &&
                                    item.type === "account"
                                    ? 1
                                    : item.is_integrated === false &&
                                      item.state === "completed" &&
                                      item.type === "ofd"
                                    ? 2
                                    : item.state === "failed"
                                    ? 3
                                    : item.is_integrated === true &&
                                      item.state === "in_progress" &&
                                      !!item.link
                                    ? 4
                                    : item.is_integrated === true &&
                                      item.state === "completed"
                                    ? 5
                                    : 0
                                )
                                setTypeSourceName(item.name)
                                setAccountSource(item.sub_name || "")
                                setOffSourceId(item.id)
                              }}
                            >
                              <DeleteSourceIcon />
                            </Button>
                          </Tooltip>
                        )}
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            </>
          )}
          {sourcesAutoSider && sourcesAutoSider?.length > 0 && (
            <>
              <Title level={4}>{CONTENT.HEADING_AUTO_SOURCERS}</Title>
              <List
                dataSource={sourcesAutoSider}
                renderItem={(item) => (
                  <List.Item
                    className={styles["list-item-right"]}
                    style={{ borderBlockEnd: "none" }}
                  >
                    <div className={styles["left-source-name"]}>
                      {item.state === "in_progress" ? (
                        item.link || item.link == "" ? (
                          <Tooltip title={CONTENT.TOOLTIP_ORANGE}>
                            <InProgressOrangeIcon />
                          </Tooltip>
                        ) : (
                          <Tooltip title={CONTENT.TOOLTIP_GREY}>
                            <InProgressIcon />
                          </Tooltip>
                        )
                      ) : item.state === "failed" ? (
                        <Tooltip title={item.reason}>
                          <FailedIcon />
                        </Tooltip>
                      ) : item.state === "completed" &&
                        item.is_integrated === false ? (
                        <CompletedHandIcon />
                      ) : item.state === "completed" &&
                        item.is_integrated === true ? (
                        <CompletedAutoIcon />
                      ) : null}

                      {item.short_name && item.short_name !== null ? (
                        <Tooltip title={item.name}>
                          <Text className={styles["source-text-left"]}>
                            {item.short_name}
                            {"..."}
                          </Text>
                        </Tooltip>
                      ) : (
                        <Text className={styles["source-text-left"]}>
                          {item.name}{" "}
                        </Text>
                      )}
                      <Text className={styles["source-text-right"]}>
                        {item.sub_name ? " *" + item.sub_name?.slice(-4) : ""}
                      </Text>
                    </div>
                    <div className={styles["source-date-inner"]}>
                      <div className={styles["source-date-part"]}>
                        {item.state === "completed" && !item.disable_date ? (
                          <Tooltip title={CONTENT.TOOLTIP_DATE}>
                            <Text>
                              {item.last_info &&
                                convertReverseFormat(item.last_info)}
                            </Text>
                          </Tooltip>
                        ) : item.state === "completed" && item.disable_date ? (
                          <Text>{convertReverseFormat(item.disable_date)}</Text>
                        ) : item.state === "failed" ? (
                          <Link>{"Повторить"}</Link>
                        ) : item.state === "in_progress" && item.link ? (
                          <Link href={item.link}>{"Подключить"}</Link>
                        ) : null}
                        {!(item.state == "in_progress" && !item.link) && (
                          <Tooltip
                            title={
                              item.is_integrated === false &&
                              item.state === "completed" &&
                              (item.type === "account" || item.type === "ofd")
                                ? CONTENT.OFF_SOURCE
                                : item.state === "failed"
                                ? CONTENT.DELETE_SOURCE
                                : item.is_integrated === true &&
                                  item.state === "in_progress" &&
                                  !!item.link
                                ? CONTENT.CANCEL_INTEGRATION_SOURCE
                                : item.is_integrated === true &&
                                  item.state === "completed"
                                ? CONTENT.OFF_INTEGRATION_SOURCE
                                : ""
                            }
                          >
                            <Button
                              className={styles["source-delete-icon"]}
                              onClick={() => {
                                setIsDeletedSource(true)
                                setOffSourceTitle(
                                  item.is_integrated === false &&
                                    item.state === "completed" &&
                                    (item.type === "account" ||
                                      item.type === "ofd")
                                    ? CONTENT.OFF_SOURCE
                                    : item.state === "failed"
                                    ? CONTENT.DELETE_SOURCE
                                    : item.is_integrated === true &&
                                      item.state === "in_progress" &&
                                      !!item.link
                                    ? CONTENT.CANCEL_INTEGRATION_SOURCE
                                    : item.is_integrated === true &&
                                      item.state === "completed"
                                    ? CONTENT.OFF_INTEGRATION_SOURCE
                                    : ""
                                )
                                setTypeSource(
                                  item.is_integrated === false &&
                                    item.state === "completed" &&
                                    item.type === "account"
                                    ? 1
                                    : item.is_integrated === false &&
                                      item.state === "completed" &&
                                      item.type === "ofd"
                                    ? 2
                                    : item.state === "failed"
                                    ? 3
                                    : item.is_integrated === true &&
                                      item.state === "in_progress" &&
                                      !!item.link
                                    ? 4
                                    : item.is_integrated === true &&
                                      item.state === "completed"
                                    ? 5
                                    : 0
                                )
                                setTypeSourceName(item.name)
                                setOffSourceId(item.id)
                              }}
                            >
                              <DeleteSourceIcon />
                            </Button>
                          </Tooltip>
                        )}
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            </>
          )}
        </Sider>
      )}
      {isMobile && (
        <Drawer
          open={isOpenDrawer}
          onClose={closeDrawer}
          width={"100%"}
          className="taxes-drawer"
        >
          <div className={styles["drawer-wrapper"]}>
            <Title level={3}>
              {CONTENT.HEADING_DATA_SOURCES}{" "}
              <Button
                onClick={() => dispatch(fetchSourcesInfo())}
                className={styles["refresh-sources"]}
              >
                <ArrowCounterIcon />
              </Button>
            </Title>

            <div className={styles["sider-buttons"]}>
              <Button
                className={styles["default-button"]}
                onClick={() => setIsAddSourceOpen(true)}
              >
                <PlusOutlined
                  className={styles["plus-icon"]}
                  style={{ marginInlineStart: "4px" }}
                />
                {CONTENT.BUTTON_SIDER_ADD_TEXT}
              </Button>
            </div>
            {sourcesHandSider && sourcesHandSider.length > 0 && (
              <>
                <Title level={4}>
                  {CONTENT.HEADING_HAND_SOURCERS + " "}
                  <Tooltip title={CONTENT.HAND_LOAD_INFO_TOOLTIP}>
                    <InfoCircleOutlined
                      className={styles["sider-icon"]}
                      size={24}
                    />
                  </Tooltip>
                </Title>
                <List
                  dataSource={sourcesHandSider}
                  renderItem={(item) => (
                    <List.Item
                      className={styles["list-item-right"]}
                      style={{ borderBlockEnd: "none" }}
                    >
                      <div className={styles["left-source-name"]}>
                        {item.state === "in_progress" ? (
                          item.link || item.link == "" ? (
                            <Tooltip title={CONTENT.TOOLTIP_ORANGE}>
                              <InProgressOrangeIcon />
                            </Tooltip>
                          ) : (
                            <Tooltip title={CONTENT.TOOLTIP_GREY}>
                              <InProgressIcon />
                            </Tooltip>
                          )
                        ) : item.state === "failed" ? (
                          <FailedIcon />
                        ) : item.state === "completed" &&
                          item.is_integrated === false ? (
                          <Tooltip title={CONTENT.ADD_SOURCE_COMPLETED}>
                            <Button
                              className={styles["source-completed-icon"]}
                              onClick={() =>
                                handleCompletedSource(
                                  item.type === "account"
                                    ? 1
                                    : item.type === "ofd"
                                    ? 2
                                    : null
                                )
                              }
                            >
                              <CompletedHandIcon />
                            </Button>
                          </Tooltip>
                        ) : item.state === "completed" &&
                          item.is_integrated === true ? (
                          <CompletedAutoIcon />
                        ) : null}
                        {item.short_name && item.short_name !== null ? (
                          <Tooltip title={item.name}>
                            <Text className={styles["source-text-left"]}>
                              {item.short_name}{" "}
                            </Text>
                          </Tooltip>
                        ) : (
                          <Text className={styles["source-text-left"]}>
                            {item.name}{" "}
                          </Text>
                        )}

                        <Text className={styles["source-text-right"]}>
                          {item.sub_name ? " *" + item.sub_name?.slice(-4) : ""}
                        </Text>
                      </div>
                      <div className={styles["source-date-inner"]}>
                        <div className={styles["source-date-part"]}>
                          {item.state === "completed" && !item.disable_date ? (
                            <Tooltip title={CONTENT.TOOLTIP_DATE}>
                              <Text>
                                {item.last_info &&
                                  convertReverseFormat(item.last_info)}
                              </Text>
                            </Tooltip>
                          ) : item.state === "completed" &&
                            item.disable_date ? (
                            <Text>
                              {convertReverseFormat(item.disable_date)}
                            </Text>
                          ) : item.state === "failed" ? (
                            <Link>{"Повторить"}</Link>
                          ) : item.state === "in_progress" ? (
                            item.link ? (
                              <Link>{"Подключить"}</Link>
                            ) : (
                              "—"
                            )
                          ) : null}
                          {!(item.state == "in_progress" && !item.link) && (
                            <Tooltip
                              title={
                                item.is_integrated === false &&
                                item.state === "completed" &&
                                (item.type === "account" || item.type === "ofd")
                                  ? CONTENT.OFF_SOURCE
                                  : item.state === "failed"
                                  ? CONTENT.DELETE_SOURCE
                                  : item.is_integrated === true &&
                                    item.state === "in_progress" &&
                                    !!item.link
                                  ? CONTENT.CANCEL_INTEGRATION_SOURCE
                                  : item.is_integrated === true &&
                                    item.state === "completed"
                                  ? CONTENT.OFF_INTEGRATION_SOURCE
                                  : ""
                              }
                            >
                              <Button
                                className={styles["source-delete-icon"]}
                                onClick={() => {
                                  setIsDeletedSource(true)
                                  setOffSourceTitle(
                                    item.is_integrated === false &&
                                      item.state === "completed" &&
                                      (item.type === "account" ||
                                        item.type === "ofd")
                                      ? CONTENT.OFF_SOURCE
                                      : item.state === "failed"
                                      ? CONTENT.DELETE_SOURCE
                                      : item.is_integrated === true &&
                                        item.state === "in_progress" &&
                                        !!item.link
                                      ? CONTENT.CANCEL_INTEGRATION_SOURCE
                                      : item.is_integrated === true &&
                                        item.state === "completed"
                                      ? CONTENT.OFF_INTEGRATION_SOURCE
                                      : ""
                                  )
                                  setTypeSource(
                                    item.is_integrated === false &&
                                      item.state === "completed" &&
                                      item.type === "account"
                                      ? 1
                                      : item.is_integrated === false &&
                                        item.state === "completed" &&
                                        item.type === "ofd"
                                      ? 2
                                      : item.state === "failed"
                                      ? 3
                                      : item.is_integrated === true &&
                                        item.state === "in_progress" &&
                                        !!item.link
                                      ? 4
                                      : item.is_integrated === true &&
                                        item.state === "completed"
                                      ? 5
                                      : 0
                                  )
                                  setTypeSourceName(item.name)
                                  setAccountSource(item.sub_name || "")
                                  setOffSourceId(item.id)
                                }}
                              >
                                <DeleteSourceIcon />
                              </Button>
                            </Tooltip>
                          )}
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              </>
            )}
            {sourcesAutoSider && sourcesAutoSider?.length > 0 && (
              <>
                <Title level={4}>{CONTENT.HEADING_AUTO_SOURCERS}</Title>
                <List
                  dataSource={sourcesAutoSider}
                  renderItem={(item) => (
                    <List.Item
                      className={styles["list-item-right"]}
                      style={{ borderBlockEnd: "none" }}
                    >
                      <div className={styles["left-source-name"]}>
                        {item.state === "in_progress" ? (
                          item.link || item.link == "" ? (
                            <Tooltip title={CONTENT.TOOLTIP_ORANGE}>
                              <InProgressOrangeIcon />
                            </Tooltip>
                          ) : (
                            <Tooltip title={CONTENT.TOOLTIP_GREY}>
                              <InProgressIcon />
                            </Tooltip>
                          )
                        ) : item.state === "failed" ? (
                          <Tooltip title={item.reason}>
                            <FailedIcon />
                          </Tooltip>
                        ) : item.state === "completed" &&
                          item.is_integrated === false ? (
                          <CompletedHandIcon />
                        ) : item.state === "completed" &&
                          item.is_integrated === true ? (
                          <CompletedAutoIcon />
                        ) : null}

                        {item.short_name && item.short_name !== null ? (
                          <Tooltip title={item.name}>
                            <Text className={styles["source-text-left"]}>
                              {item.short_name}{" "}
                            </Text>
                          </Tooltip>
                        ) : (
                          <Text className={styles["source-text-left"]}>
                            {item.name}{" "}
                          </Text>
                        )}
                        <Text className={styles["source-text-right"]}>
                          {item.sub_name ? " *" + item.sub_name?.slice(-4) : ""}
                        </Text>
                      </div>
                      <div className={styles["source-date-inner"]}>
                        <div className={styles["source-date-part"]}>
                          {item.state === "completed" && !item.disable_date ? (
                            <Tooltip title={CONTENT.TOOLTIP_DATE}>
                              <Text>
                                {item.last_info &&
                                  convertReverseFormat(item.last_info)}
                              </Text>
                            </Tooltip>
                          ) : item.state === "completed" &&
                            item.disable_date ? (
                            <Text>
                              {convertReverseFormat(item.disable_date)}
                            </Text>
                          ) : item.state === "failed" ? (
                            <Link>{"Повторить"}</Link>
                          ) : item.state === "in_progress" && item.link ? (
                            <Link href={item.link}>{"Подключить"}</Link>
                          ) : null}
                          {!(item.state == "in_progress" && !item.link) && (
                            <Tooltip
                              title={
                                item.is_integrated === false &&
                                item.state === "completed" &&
                                (item.type === "account" || item.type === "ofd")
                                  ? CONTENT.OFF_SOURCE
                                  : item.state === "failed"
                                  ? CONTENT.DELETE_SOURCE
                                  : item.is_integrated === true &&
                                    item.state === "in_progress" &&
                                    !!item.link
                                  ? CONTENT.CANCEL_INTEGRATION_SOURCE
                                  : item.is_integrated === true &&
                                    item.state === "completed"
                                  ? CONTENT.OFF_INTEGRATION_SOURCE
                                  : ""
                              }
                            >
                              <Button
                                className={styles["source-delete-icon"]}
                                onClick={() => {
                                  setIsDeletedSource(true)
                                  setOffSourceTitle(
                                    item.is_integrated === false &&
                                      item.state === "completed" &&
                                      (item.type === "account" ||
                                        item.type === "ofd")
                                      ? CONTENT.OFF_SOURCE
                                      : item.state === "failed"
                                      ? CONTENT.DELETE_SOURCE
                                      : item.is_integrated === true &&
                                        item.state === "in_progress" &&
                                        !!item.link
                                      ? CONTENT.CANCEL_INTEGRATION_SOURCE
                                      : item.is_integrated === true &&
                                        item.state === "completed"
                                      ? CONTENT.OFF_INTEGRATION_SOURCE
                                      : ""
                                  )
                                  setTypeSource(
                                    item.is_integrated === false &&
                                      item.state === "completed" &&
                                      item.type === "account"
                                      ? 1
                                      : item.is_integrated === false &&
                                        item.state === "completed" &&
                                        item.type === "ofd"
                                      ? 2
                                      : item.state === "failed"
                                      ? 3
                                      : item.is_integrated === true &&
                                        item.state === "in_progress" &&
                                        !!item.link
                                      ? 4
                                      : item.is_integrated === true &&
                                        item.state === "completed"
                                      ? 5
                                      : 0
                                  )
                                  setTypeSourceName(item.name)
                                  setOffSourceId(item.id)
                                }}
                              >
                                <DeleteSourceIcon />
                              </Button>
                            </Tooltip>
                          )}
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              </>
            )}
          </div>
        </Drawer>
      )}
      <DeleteOperationModal
        isOpen={deleteModalOpen}
        setOpen={setIsDeleteModalOpen}
        id={hoveredIndex}
        setWasDeleted={setWasDeleted}
      />
      <AddSourceModal
        isOpen={isAddSourceOpen}
        setOpen={setIsAddSourceOpen}
        setAddOperation={setAddOperation}
        completedSource={sourceCompleted}
        setCompletedSource={setSourceCompleted}
      />
      <AddOperationModal
        isOpen={addOperation}
        setOpen={setAddOperation}
        setWasDeleted={setWasDeleted}
      />
      <OffSourceModal
        isOpen={isDeletedSource}
        setOpen={setIsDeletedSource}
        setWasDeleted={setIsDeletedSource}
        titleModal={offSourceTitle}
        typeSource={typeSource}
        source={typeSourceName}
        account={accountSource}
        source_id={offSourceId}
      />
      <DownloadKudirModal isOpen={downloadKudir} setOpen={setDownloadKudir} />
    </>
  )
}
