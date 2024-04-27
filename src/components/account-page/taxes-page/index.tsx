import {
  Button,
  Collapse,
  DatePicker,
  Drawer,
  Layout,
  List,
  Select,
  Skeleton,
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
  DownloadOutlined,
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
import { ApiError, getSourceText } from "./utils"
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
import { isErrorResponse } from "./add-source-modal/utils"
import { useAuth } from "../../../AuthContext"
import { clearData } from "../../authorization-page/slice"
import { useNavigate } from "react-router-dom"
import { ButtonOne } from "../../../ui-kit/button"
import { Amount } from "../../../ui-kit/amount"
import { TaxesErrorImage } from "./images/taxes-error"

export const TaxesPage = () => {
  const { Sider, Content } = Layout
  const { Title, Text } = Typography
  const dateFormat = "DD.MM.YYYY"
  dayjs.locale("ru")
  const columns = [
    {
      title: "Источник",
      key: "source",
      dataIndex: "source",
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

  const initialOptionTypesSelect = [
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
  const [optionsTypesSelect, setOptionsTypesSelect] = useState(
    initialOptionTypesSelect
  )

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

  const isUUID = (str: string): boolean => {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    return uuidRegex.test(str)
  }

  const inititalSources =
    sources?.sources &&
    sources.sources
      .filter((item) => item.id && item.state !== "failed" && !isUUID(item.id))
      .map((item) => {
        const subName = item.sub_name ? " *" + item.sub_name?.slice(-4) : ""
        return {
          label: item.short_name
            ? item.short_name + subName
            : item.name + subName,
          value: item.id,
        }
      })

  const [optionsSources, setOptionsSources] = useState(inititalSources)

  const sourcesAutoSider =
    sources &&
    sources.sources
      ?.filter((item) => item.is_integrated && item.name !== "Ручной ввод")
      .sort((a, b) => {
        if (a.disable_date && !b.disable_date) {
          return 1
        } else if (!a.disable_date && b.disable_date) {
          return -1
        } else {
          return 0
        }
      })
  const sourcesHandSider =
    sources &&
    sources.sources
      ?.filter((item) => !item.is_integrated && item.name !== "Ручной ввод")
      .sort((a, b) => {
        if (a.disable_date && !b.disable_date) {
          return 1
        } else if (!a.disable_date && b.disable_date) {
          return -1
        } else {
          return 0
        }
      })
  const sourcesAutoDisabledSider =
    sources &&
    sources.sources
      ?.filter(
        (item) =>
          item.is_integrated &&
          item.name !== "Ручной ввод" &&
          item.state === "completed" &&
          item.disable_date
      )
      .sort((a, b) => {
        if (a.disable_date && !b.disable_date) {
          return 1
        } else if (!a.disable_date && b.disable_date) {
          return -1
        } else {
          return 0
        }
      })
  const sourcesHandDisabledSider =
    sources &&
    sources.sources
      ?.filter(
        (item) =>
          !item.is_integrated &&
          item.name !== "Ручной ввод" &&
          item.state === "completed" &&
          item.disable_date
      )
      .sort((a, b) => {
        if (a.disable_date && !b.disable_date) {
          return 1
        } else if (!a.disable_date && b.disable_date) {
          return -1
        } else {
          return 0
        }
      })
  const [deleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const { logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchOperations = async () => {
      try {
        const sourcesResponse = await api.sources.getSourcesInfoSourcesGet({
          headers,
        })
        setSources(sourcesResponse.data)
      } catch (error) {
        if ((error as ApiError).status === 422) {
          logout(), dispatch(clearData()), navigate("/login")
        }
      }
    }
    fetchOperations()
  }, [])

  const fetchSourcesHand = async () => {
    try {
      const sourcesResponse = await api.sources.getSourcesInfoSourcesGet({
        headers,
      })
      setSources(sourcesResponse.data)
    } catch (error) {
      if ((error as ApiError).status === 422) {
        logout(), dispatch(clearData()), navigate("/login")
      }
    }
  }

  useEffect(() => {
    setOptionsSources(inititalSources)
  }, [sources])

  const [pagination, setPagination] = useState({
    page_number: 1,
    row_count: 30,
    request_id: v4(),
  })

  const [taxesErrorImage, setTaxesErrorImage] = useState(false)

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
  const resetFilter = () => {
    setPagination({
      page_number: 1,
      row_count: 30,
      request_id: v4(),
    })
    setSelectedSources([])
    setSelectedOperationTypes([])
    setSelectedStartDate(null)
    setSelectedEndDate(null)
    setIsFetching(true)

    setOptionsTypesSelect(initialOptionTypesSelect)
    handleSourcesChange([])
  }

  const fetchOperations = useCallback(async () => {
    if (isFetching) {
      try {
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
      } catch (error) {
        console.log(error)
        if ((error as ApiError).status === 422) {
          logout(), dispatch(clearData()), navigate("/login")
        } else {
          setTaxesErrorImage(true)
        }
      }
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

  const isMobile = useMediaQuery("(max-width: 1023px)")
  const isTablet = useMediaQuery("(max-width: 1279px)")

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
            value={selectedSources}
            allowClear
          />
          <Select
            placeholder={CONTENT.SELECT_OPERATION_TYPE}
            className={styles["operation-select"]}
            style={{ borderRadius: "4px" }}
            options={optionsTypesSelect}
            onChange={handleOperationTypesChange}
            onClear={() => setOptionsTypesSelect(initialOptionTypesSelect)}
            value={selectedOperationTypes}
            mode="multiple"
            maxTagCount={1}
          />
          <DatePicker.RangePicker
            locale={locale}
            format={dateFormat}
            allowClear
            placeholder={["от", "до"]}
            className={styles["datepicker-item"]}
            style={{ borderRadius: "4px" }}
            value={[dayjs(selectedStartDate), dayjs(selectedEndDate)]}
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

  const collapsedAutoSources = [
    {
      key: 1,
      label: (
        <Text
          className={cn(styles["hide-source-title"])}
          style={{ marginTop: 0 }}
        >
          {CONTENT.TITLE_COLLAPSED_SOURCES}
        </Text>
      ),
      children:
        sourcesAutoDisabledSider &&
        sourcesAutoDisabledSider.map((item) => (
          <div className={styles["inputs-row"]}>
            <Tooltip
              title={
                item.is_integrated === false &&
                item.state === "completed" &&
                !item.disable_date &&
                (item.type === "account" || item.type === "ofd")
                  ? CONTENT.OFF_SOURCE
                  : item.state === "failed"
                  ? CONTENT.DELETE_SOURCE
                  : item.is_integrated === true &&
                    item.state === "in_progress" &&
                    !!item.link
                  ? CONTENT.CANCEL_INTEGRATION_SOURCE
                  : item.is_integrated === true &&
                    item.state === "completed" &&
                    !item.disable_date
                  ? CONTENT.OFF_INTEGRATION_SOURCE
                  : undefined
              }
            >
              <Button
                className={cn({
                  [styles["source-delete-icon-disable"]]: item.disable_date,
                  [styles["source-delete-icon"]]: !item.disable_date,
                })}
                onClick={() => {
                  setIsDeletedSource(true)
                  setOffSourceTitle(
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
          </div>
        )),
    },
  ]

  const collapsedHandSources = [
    {
      key: 1,
      label: (
        <Text
          className={cn(styles["hide-source-title"])}
          style={{ marginTop: 0 }}
        >
          {CONTENT.TITLE_COLLAPSED_SOURCES}
        </Text>
      ),
      children:
        sourcesHandDisabledSider &&
        sourcesHandDisabledSider.map((item) => (
          <div className={styles["list-item-hide"]}>
            <div className={styles["left-source-name"]}>
              {item.short_name && item.short_name !== null ? (
                <Tooltip title={item.name}>
                  <Text className={styles["source-text-left"]}>
                    {item.short_name.length > 10 && isTablet
                      ? `${item.short_name.substring(0, 10)}...`
                      : item.short_name}
                  </Text>
                </Tooltip>
              ) : (
                <Text className={styles["source-text-left"]}>{item.name} </Text>
              )}

              <Text className={styles["source-text-right"]}>
                {item.sub_name ? " *" + item.sub_name?.slice(-4) : ""}
              </Text>
            </div>
            <Tooltip title={CONTENT.TOOLTIP_DISABLE_DATE}>
              <Text className={styles["date-style"]}>
                {item.disable_date && convertReverseFormat(item.disable_date)}
              </Text>
            </Tooltip>
            <Tooltip
              title={
                item.is_integrated === false &&
                item.state === "completed" &&
                !item.disable_date &&
                (item.type === "account" || item.type === "ofd")
                  ? CONTENT.OFF_SOURCE
                  : item.state === "failed"
                  ? CONTENT.DELETE_SOURCE
                  : item.is_integrated === true &&
                    item.state === "in_progress" &&
                    !!item.link
                  ? CONTENT.CANCEL_INTEGRATION_SOURCE
                  : item.is_integrated === true &&
                    item.state === "completed" &&
                    !item.disable_date
                  ? CONTENT.OFF_INTEGRATION_SOURCE
                  : undefined
              }
            >
              <Button
                className={cn({
                  [styles["source-delete-icon-disable"]]: item.disable_date,
                  [styles["source-delete-icon"]]: !item.disable_date,
                })}
                onClick={() => {
                  setIsDeletedSource(true)
                  setOffSourceTitle(
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
          </div>
        )),
    },
  ]

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
            <ButtonOne type="secondary" onClick={() => setDownloadKudir(true)}>
              <DownloadOutlined className={styles["download-icon"]} />
              {CONTENT.BUTTON_DOWNLOAD_KUDIR}
            </ButtonOne>
            <ButtonOne
              className={cn(styles["buttons-row-item"], styles["button-make"])}
              onClick={() => setIsAddSourceOpen(true)}
            >
              <PlusOutlined
                className={styles["plus-icon"]}
                style={{ marginInlineStart: "4px" }}
              />
              {CONTENT.BUTTON_ADD_OPERATION}
            </ButtonOne>
          </div>
        </div>

        {!taxesErrorImage ? (
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
                  value={selectedSources}
                  mode="multiple"
                  maxTagCount={1}
                  allowClear
                />
                <Select
                  placeholder={CONTENT.SELECT_OPERATION_TYPE}
                  className={styles["operation-select"]}
                  style={{ borderRadius: "4px" }}
                  options={optionsTypesSelect}
                  onChange={handleOperationTypesChange}
                  value={selectedOperationTypes}
                  mode="multiple"
                  maxTagCount={1}
                  allowClear
                />
                <DatePicker.RangePicker
                  locale={locale}
                  format={dateFormat}
                  placeholder={["от", "до"]}
                  className={styles["datepicker-item"]}
                  style={{ borderRadius: "4px" }}
                  value={[
                    selectedStartDate !== null
                      ? dayjs(selectedStartDate)
                      : null,
                    selectedEndDate !== null ? dayjs(selectedEndDate) : null,
                  ]}
                  allowClear
                  onChange={(dates, dateStrings) =>
                    handleDateRangeChange(dateStrings)
                  }
                />
                <ButtonOne onClick={resetFilter}>
                  {CONTENT.RESET_FILTERS}
                </ButtonOne>
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
                {operationsLoaded ? (
                  Object.entries(groupedOperations).length > 0 ? (
                    Object.entries(groupedOperations).map(
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
                                                (item) =>
                                                  item.value !== 3 &&
                                                  item.value !== 4
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
                                      <Text
                                        className={styles["currency-income"]}
                                      >
                                        {operation.markup.amount >= 0 ? (
                                          <Amount
                                            prefix={
                                              operation.category === "debet"
                                                ? "plus"
                                                : "minus"
                                            }
                                            currency="RUB"
                                            value={operation.markup.amount}
                                            className={styles["amount-nowrap"]}
                                          />
                                        ) : (
                                          getCurrency(
                                            operation.amount_doc,
                                            operation.category
                                          )
                                        )}
                                      </Text>
                                      <Text
                                        className={
                                          styles["source-account-text"]
                                        }
                                      >
                                        {getSourceText(
                                          operation.source_name,
                                          operation.account_number,
                                          operation.short_name
                                        )}
                                      </Text>
                                    </div>
                                    {
                                      <ButtonOne
                                        className={styles["delete-icon"]}
                                        type="danger"
                                        onClick={() =>
                                          setIsDeleteModalOpen(true)
                                        }
                                      >
                                        <DeleteOutlined />
                                      </ButtonOne>
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
                  ) : (
                    groupedOperationsLoaded && (
                      <div className={styles["non-taxes"]}>
                        <NonTaxesImage />
                        <div className={styles["non-wrapper"]}>
                          <Text className={styles["non-text"]}>
                            {CONTENT.TEXT_NON_TAXES}
                          </Text>
                        </div>
                        <Button
                          className={styles["non-source-button"]}
                          onClick={() => setIsAddSourceOpen(true)}
                        >
                          <PlusOutlined
                            className={styles["plus-non-icon"]}
                            style={{ marginInlineStart: "4px" }}
                          />
                          {CONTENT.BUTTON_ADD_SOURCE_NON}
                        </Button>
                      </div>
                    )
                  )
                ) : !isMobile ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "20px",
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: "20px",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ width: "50%" }}>
                        <Skeleton
                          paragraph={{
                            rows: 2,
                          }}
                          active
                        />
                      </div>
                      <div style={{}}>
                        <Skeleton.Input active />
                      </div>
                      <div style={{ width: "20%" }}>
                        <Skeleton
                          title={false}
                          style={{ display: "flex", alignItems: "flex-end" }}
                          paragraph={{
                            rows: 2,
                            width: [140, 140],
                          }}
                          active
                        />
                      </div>
                    </div>
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: "20px",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ width: "50%" }}>
                        <Skeleton
                          paragraph={{
                            rows: 2,
                          }}
                          active
                        />
                      </div>
                      <div style={{}}>
                        <Skeleton.Input active />
                      </div>
                      <div style={{ width: "20%" }}>
                        <Skeleton
                          title={false}
                          style={{ display: "flex", alignItems: "flex-end" }}
                          paragraph={{
                            rows: 2,
                            width: [140, 140],
                          }}
                          active
                        />
                      </div>
                    </div>
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: "20px",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ width: "50%" }}>
                        <Skeleton
                          paragraph={{
                            rows: 2,
                          }}
                          active
                        />
                      </div>
                      <div style={{}}>
                        <Skeleton.Input active />
                      </div>
                      <div style={{ width: "20%" }}>
                        <Skeleton
                          title={false}
                          style={{ display: "flex", alignItems: "flex-end" }}
                          paragraph={{
                            rows: 2,
                            width: [140, 140],
                          }}
                          active
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "20px",
                      width: "100%",
                    }}
                  >
                    <div style={{ width: "100%" }}>
                      <Skeleton
                        paragraph={{
                          rows: 2,
                          width: [200, 200],
                        }}
                        active
                      />
                    </div>
                    <div style={{ width: "100%" }}>
                      <Skeleton.Input active />
                    </div>
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Skeleton
                        title={false}
                        paragraph={{
                          rows: 2,
                          width: [140, 140],
                        }}
                        active
                      />
                      <Skeleton.Avatar shape="square" />
                    </div>
                    <div className={styles["divider"]}></div>
                    <div style={{ width: "100%" }}>
                      <Skeleton
                        paragraph={{
                          rows: 2,
                          width: [200, 200],
                        }}
                        active
                      />
                    </div>
                    <div style={{ width: "100%" }}>
                      <Skeleton.Input active />
                    </div>
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Skeleton
                        title={false}
                        paragraph={{
                          rows: 2,
                          width: [140, 140],
                        }}
                        active
                      />
                      <Skeleton.Avatar shape="square" />
                    </div>
                  </div>
                )}
                <div ref={bottomBlockRef} style={{ height: "1px" }} />
              </div>
            </div>
          </div>
        ) : (
          <div className={styles["taxes-error-block"]}>
            <TaxesErrorImage />
            <Text className={styles["taxes-error-title"]}>
              {CONTENT.TAXES_ERROR_HEADING}
            </Text>
            <Text className={styles["non-text"]}>
              {CONTENT.TAXES_ERROR_DESCRIPTION}
            </Text>
          </div>
        )}
      </Content>
      {!isMobile && (
        <Sider
          className={styles["right-sider-wrapper"]}
          breakpoint="lg"
          collapsedWidth="0"
        >
          <Title level={3}>
            {CONTENT.HEADING_DATA_SOURCES}{" "}
            <Button
              onClick={() => fetchSourcesHand()}
              className={styles["refresh-sources"]}
            >
              <ArrowCounterIcon />
            </Button>
          </Title>

          {/*<div className={styles["sider-buttons"]}>
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
          </div>*/}
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
                        item.is_integrated === false &&
                        !item.disable_date ? (
                        <Tooltip
                          title={
                            !isMobile ? CONTENT.ADD_SOURCE_COMPLETED : undefined
                          }
                        >
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
                            {item.short_name.length > 10 && isTablet
                              ? `${item.short_name.substring(0, 10)}...`
                              : item.short_name}
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
                      <div
                        className={cn({
                          [styles["source-date-part-disable"]]:
                            item.disable_date,
                          [styles["source-date-part"]]: !item.disable_date,
                        })}
                      >
                        {item.state === "completed" && !item.disable_date ? (
                          <Tooltip title={CONTENT.TOOLTIP_DATE}>
                            <Text className={styles["date-style"]}>
                              {item.last_info &&
                                convertReverseFormat(item.last_info)}
                            </Text>
                          </Tooltip>
                        ) : item.state === "completed" && item.disable_date ? (
                          <Tooltip title={CONTENT.TOOLTIP_DISABLE_DATE}>
                            <Text className={styles["date-style"]}>
                              {convertReverseFormat(item.disable_date)}
                            </Text>
                          </Tooltip>
                        ) : item.state === "failed" ? null : item.state === // <Link>{"Повторить"}</Link>
                          "in_progress" ? (
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
                              !item.disable_date &&
                              (item.type === "account" || item.type === "ofd")
                                ? CONTENT.OFF_SOURCE
                                : item.state === "failed"
                                ? CONTENT.DELETE_SOURCE
                                : item.is_integrated === true &&
                                  item.state === "in_progress" &&
                                  !!item.link
                                ? CONTENT.CANCEL_INTEGRATION_SOURCE
                                : item.is_integrated === true &&
                                  item.state === "completed" &&
                                  !item.disable_date
                                ? CONTENT.OFF_INTEGRATION_SOURCE
                                : undefined
                            }
                          >
                            {!(
                              item.state === "completed" && item.disable_date
                            ) ? (
                              <Button
                                className={cn({
                                  [styles["source-delete-icon-disable"]]:
                                    item.disable_date,
                                  [styles["source-delete-icon"]]:
                                    !item.disable_date,
                                })}
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
                            ) : (
                              <div
                                className={styles["source-delete-icon-disable"]}
                              >
                                <DeleteSourceIcon />
                              </div>
                            )}
                          </Tooltip>
                        )}
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            </>
          )}
          {sourcesHandDisabledSider && sourcesHandDisabledSider.length > 0 && (
            <Collapse
              items={collapsedHandSources}
              bordered={false}
              className="hide-sources payment-collapse"
              ghost
              expandIconPosition="right"
            />
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
                        item.is_integrated === false &&
                        !item.disable_date ? (
                        <CompletedHandIcon />
                      ) : item.state === "completed" &&
                        item.is_integrated === true &&
                        !item.disable_date ? (
                        <CompletedAutoIcon />
                      ) : null}

                      {item.short_name && item.short_name !== null ? (
                        <Tooltip title={item.name}>
                          <Text className={styles["source-text-left"]}>
                            {item.short_name.length > 10 && isTablet
                              ? `${item.short_name.substring(0, 10)}...`
                              : item.short_name}
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
                      <div
                        className={cn({
                          [styles["source-date-part-disable"]]:
                            item.disable_date,
                          [styles["source-date-part"]]: !item.disable_date,
                        })}
                      >
                        {item.state === "completed" && !item.disable_date ? (
                          <Tooltip title={CONTENT.TOOLTIP_DATE}>
                            <Text>
                              {item.last_info &&
                                convertReverseFormat(item.last_info)}
                            </Text>
                          </Tooltip>
                        ) : item.state === "completed" && item.disable_date ? (
                          <Tooltip title={CONTENT.TOOLTIP_DISABLE_DATE}>
                            <Text>
                              {convertReverseFormat(item.disable_date)}
                            </Text>{" "}
                          </Tooltip>
                        ) : item.state === "failed" ? null : item.state === //<Link>{"Повторить"}</Link>
                            "in_progress" && item.link ? (
                          <Link href={item.link}>{"Подключить"}</Link>
                        ) : null}
                        {!(item.state == "in_progress" && !item.link) && (
                          <Tooltip
                            title={
                              item.is_integrated === false &&
                              item.state === "completed" &&
                              !item.disable_date &&
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
                                ? CONTENT.OFF_INTEGRATION_SOURCE &&
                                  !item.disable_date
                                : undefined
                            }
                          >
                            {!(
                              item.state === "completed" && item.disable_date
                            ) ? (
                              <Button
                                className={cn({
                                  [styles["source-delete-icon-disable"]]:
                                    item.disable_date,
                                  [styles["source-delete-icon"]]:
                                    !item.disable_date,
                                })}
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
                            ) : (
                              <div
                                className={styles["source-delete-icon-disable"]}
                              >
                                <DeleteSourceIcon />
                              </div>
                            )}
                          </Tooltip>
                        )}
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            </>
          )}
          {sourcesAutoDisabledSider && sourcesAutoDisabledSider.length > 0 && (
            <Collapse
              items={collapsedAutoSources}
              bordered={false}
              className="hide-sources payment-collapse"
              ghost
              expandIconPosition="right"
            />
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

            {/*<div className={styles["sider-buttons"]}>
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
      </div>*/}
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
                          item.is_integrated === false &&
                          !item.disable_date ? (
                          <Tooltip
                            title={
                              !isMobile
                                ? CONTENT.ADD_SOURCE_COMPLETED
                                : undefined
                            }
                          >
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
                          item.is_integrated === true &&
                          !item.disable_date ? (
                          <CompletedAutoIcon />
                        ) : null}
                        {item.short_name && item.short_name !== null ? (
                          <Tooltip title={item.name}>
                            <Text className={styles["source-text-left"]}>
                              {item.short_name.length > 10 && isTablet
                                ? `${item.short_name.substring(0, 10)}...`
                                : item.short_name}
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
                        <div
                          className={cn({
                            [styles["source-date-part-disable"]]:
                              item.disable_date,
                            [styles["source-date-part"]]: !item.disable_date,
                          })}
                        >
                          {item.state === "completed" && !item.disable_date ? (
                            <Tooltip title={CONTENT.TOOLTIP_DATE}>
                              <Text className={styles["date-style"]}>
                                {item.last_info &&
                                  convertReverseFormat(item.last_info)}
                              </Text>
                            </Tooltip>
                          ) : item.state === "completed" &&
                            item.disable_date ? (
                            <Tooltip title={CONTENT.TOOLTIP_DISABLE_DATE}>
                              <Text className={styles["date-style"]}>
                                {convertReverseFormat(item.disable_date)}
                              </Text>
                            </Tooltip>
                          ) : item.state === "failed" ? null : item.state === //<Link>{"Повторить"}</Link>
                            "in_progress" ? (
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
                                !item.disable_date &&
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
                                  ? CONTENT.OFF_INTEGRATION_SOURCE &&
                                    !item.disable_date
                                  : undefined
                              }
                            >
                              {!(
                                item.state === "completed" && item.disable_date
                              ) ? (
                                <Button
                                  className={cn({
                                    [styles["source-delete-icon-disable"]]:
                                      item.disable_date,
                                    [styles["source-delete-icon"]]:
                                      !item.disable_date,
                                  })}
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
                              ) : (
                                <div
                                  className={
                                    styles["source-delete-icon-disable"]
                                  }
                                >
                                  <DeleteSourceIcon />
                                </div>
                              )}
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
                          item.is_integrated === false &&
                          !item.disable_date ? (
                          <CompletedHandIcon />
                        ) : item.state === "completed" &&
                          item.is_integrated === true &&
                          !item.disable_date ? (
                          <CompletedAutoIcon />
                        ) : null}

                        {item.short_name && item.short_name !== null ? (
                          <Tooltip title={item.name}>
                            <Text className={styles["source-text-left"]}>
                              {item.short_name.length > 10 && isTablet
                                ? `${item.short_name.substring(0, 10)}...`
                                : item.short_name}
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
                        <div
                          className={cn({
                            [styles["source-date-part-disable"]]:
                              item.disable_date,
                            [styles["source-date-part"]]: !item.disable_date,
                          })}
                        >
                          {item.state === "completed" && !item.disable_date ? (
                            <Tooltip title={CONTENT.TOOLTIP_DATE}>
                              <Text className={styles["date-style"]}>
                                {item.last_info &&
                                  convertReverseFormat(item.last_info)}
                              </Text>
                            </Tooltip>
                          ) : item.state === "completed" &&
                            item.disable_date ? (
                            <Tooltip title={CONTENT.TOOLTIP_DISABLE_DATE}>
                              <Text className={styles["date-style"]}>
                                {convertReverseFormat(item.disable_date)}
                              </Text>
                            </Tooltip>
                          ) : item.state === "failed" ? null : item.state === // <Link>{"Повторить"}</Link>
                              "in_progress" && item.link ? (
                            <Link href={item.link}>{"Подключить"}</Link>
                          ) : null}
                          {!(item.state == "in_progress" && !item.link) && (
                            <Tooltip
                              title={
                                item.is_integrated === false &&
                                item.state === "completed" &&
                                !item.disable_date &&
                                (item.type === "account" || item.type === "ofd")
                                  ? CONTENT.OFF_SOURCE
                                  : item.state === "failed"
                                  ? CONTENT.DELETE_SOURCE
                                  : item.is_integrated === true &&
                                    item.state === "in_progress" &&
                                    !!item.link
                                  ? CONTENT.CANCEL_INTEGRATION_SOURCE
                                  : item.is_integrated === true &&
                                    item.state === "completed" &&
                                    !item.disable_date
                                  ? CONTENT.OFF_INTEGRATION_SOURCE
                                  : undefined
                              }
                            >
                              {!(
                                item.state === "completed" && item.disable_date
                              ) ? (
                                <Button
                                  className={cn({
                                    [styles["source-delete-icon-disable"]]:
                                      item.disable_date,
                                    [styles["source-delete-icon"]]:
                                      !item.disable_date,
                                  })}
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
                              ) : (
                                <div
                                  className={
                                    styles["source-delete-icon-disable"]
                                  }
                                >
                                  <DeleteSourceIcon />
                                </div>
                              )}
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
        fetchSourcesHand={fetchSourcesHand}
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
