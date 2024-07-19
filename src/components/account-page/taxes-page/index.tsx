import {
  Button,
  Collapse,
  ConfigProvider,
  DatePicker,
  Drawer,
  Layout,
  List,
  RefSelectProps,
  Select,
  Skeleton,
  Table,
  Tooltip,
  Typography,
  message,
} from "antd"
import type { PickerRef } from "rc-picker"
import Link from "antd/es/typography/Link"
import { CONTENT } from "./constants"
import styles from "./styles.module.scss"
import cn from "classnames"
import {
  InfoCircleOutlined,
  DeleteOutlined,
  PlusOutlined,
  DownloadOutlined,
  CloseOutlined,
} from "@ant-design/icons"
import { LegacyRef, useCallback, useEffect, useRef, useState } from "react"
import { v4 as uuid, v4 } from "uuid"
import { useDispatch, useSelector } from "react-redux"
import "./styles.scss"
import {
  GetOperationsRequest,
  Operation,
  OperationType,
  OperationsResponse,
  SourcesInfo,
  api,
} from "../../../api/myApi"
import { AppDispatch, RootState } from "../../main-page/store"
import Cookies from "js-cookie"
import { formatToPayDate } from "../../main-page/utils"
import { TypeOperation } from "./type-operation"
import { formatDateString, getCurrency } from "../actions-page/utils"
import { ApiError, getFormattedYearDate, getSourceText } from "./utils"
import { IncomeIcon } from "./type-operation/icons/income"
import { TaxesIcon } from "./type-operation/icons/taxes"
import { BackIcon } from "./type-operation/icons/back"
import { NonIcon } from "./type-operation/icons/non"
import dayjs from "dayjs"
import "dayjs/locale/ru"
import ru_RU from "antd/lib/date-picker/locale/ru_RU"
import { InProgressIcon } from "./type-operation/icons/in-progress"
import { FailedIcon } from "./type-operation/icons/failed"
import { CompletedHandIcon } from "./type-operation/icons/completed-hand"
import { CompletedAutoIcon } from "./type-operation/icons/completed-auto"
import {
  convertDateFormat,
  convertReverseFormat,
  getCurrentDate,
} from "../actions-page/payment-modal/utils"
import { DeleteOperationModal } from "./delete-modal"
import { NonTaxesImage } from "./images/non-operations"
import { AddSourceModal } from "./add-source-modal"
import { ArrowCounterIcon } from "./type-operation/icons/arrow-counter"
import { fetchSourcesInfo } from "../client/sources/thunks"
import { AddOperationModal } from "./add-operation-modal"
import { TrashNewIcon as DeleteSourceIcon } from "./type-operation/icons/trash-new-icon"
import { OffSourceModal } from "./off-source-modal"
import { useMediaQuery } from "@react-hook/media-query"
import { InProgressOrangeIcon } from "./type-operation/icons/in-progress-orange"
import { OpenSourceIcon } from "./type-operation/icons/open-source"
import { DownloadKudirModal } from "./download-kudir-modal"
import { useAuth } from "../../../AuthContext"
import { clearData, fetchCurrentUser } from "../../authorization-page/slice"
import { useNavigate } from "react-router-dom"
import { ButtonOne } from "../../../ui-kit/button"
import { Amount } from "../../../ui-kit/amount"
import { TaxesErrorImage } from "./images/taxes-error"
import { PersonEditIcon } from "./type-operation/icons/person-edit"
import { SelectOne } from "../../../ui-kit/select"
import { antdMonths } from "../../../ui-kit/datepicker/localization"
import { WalletPigIcon } from "./type-operation/icons/wallet-pig"
import { RepeatCrossIcon } from "./type-operation/icons/repeat-cross"
import { HideEyeIcon } from "./type-operation/icons/hide-eye"
import { AddMarketplaceOperationModal } from "./add-marketplace-operation-modal"
import { CollapseFilterIcon } from "./type-operation/icons/collapse-filter"
import { DeleteOperationIcon } from "./type-operation/icons/delete-operation"
import { SourceMobileIcon } from "./type-operation/icons/source-mobile"
import { SelectProps, SelectValue } from "antd/lib/select"
import { PickerProps } from "antd/lib/date-picker/generatePicker"
import { clearTasks } from "../client/tasks/slice"
import { clearSources, newPage } from "../client/sources/slice"

export const TaxesPage = () => {
  const { Sider, Content } = Layout
  const { Title, Text } = Typography
  const dateFormat = "DD.MM.YYYY"

  const locale = {
    ...ru_RU,
    lang: {
      ...ru_RU.lang,
      shortMonths: antdMonths.monthsShort,
      dateFormat: dateFormat,
    },
  }

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
        <div className={cn([styles["type-new-income"]])}>
          <IncomeIcon className={styles["type-income-3"]} />

          <Text className={cn(styles["type-new-text"])}>{"Доход"}</Text>
        </div>
      ),
      value: 1,
    },
    {
      label: (
        <div className={cn([styles["type-new-income"]])}>
          <NonIcon className={styles["type-non-3"]} />
          <Text className={cn(styles["type-new-text"])}>
            {"Не учитывается"}
          </Text>
        </div>
      ),
      value: 2,
    },
    {
      label: (
        <div className={cn([styles["type-new-income"]])}>
          <BackIcon className={styles["type-back-3"]} />
          <Text className={cn(styles["type-new-text"])}>{"Возврат"}</Text>
        </div>
      ),
      value: 3,
    },
    {
      label: (
        <div className={cn([styles["type-new-income"]])}>
          <TaxesIcon className={styles["type-taxes-3"]} />
          <Text className={cn(styles["type-new-text"])}>
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

  const updateRef = useRef<HTMLElement>(null)

  const optionsTypes = [
    {
      label: (
        <div className={cn("income-inner", [styles["type-new-income"]])}>
          <IncomeIcon className={cn("inner-icon-2", styles["type-income-2"])} />
          <Text className={cn(styles["type-new-text-2"])}>{"Доход"}</Text>
        </div>
      ),
      value: 1,
    },
    {
      label: (
        <div className={cn("non-inner", [styles["type-new-income"]])}>
          <NonIcon className={cn("inner-icon-2", styles["type-income-2"])} />
          <Text className={cn(styles["type-new-text-2"])}>
            {"Не учитывается"}
          </Text>
        </div>
      ),
      value: 2,
    },
    {
      label: (
        <div className={cn("back-inner", [styles["type-new-income"]])}>
          <BackIcon className={cn("inner-icon-2", styles["type-income-2"])} />
          <Text className={cn(styles["type-new-text-2"])}>{"Возврат"}</Text>
        </div>
      ),
      value: 3,
    },
    {
      label: (
        <div className={cn("taxes-inner", [styles["type-new-income"]])}>
          <TaxesIcon className={cn("inner-icon-2", styles["type-income-2"])} />
          <Text className={cn(styles["type-new-text-2"])}>
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
          label: item.short_name ? (
            <>
              <Text className={styles["sources-non-text"]}>
                {item.short_name + " "}
              </Text>
              <Text className={styles["sources-account-short"]}>{subName}</Text>
            </>
          ) : (
            <>
              <Text className={styles["sources-non-text"]}>
                {item.name + " "}{" "}
              </Text>

              <Text className={styles["sources-account-short"]}>{subName}</Text>
            </>
          ),
          value: item.id,
        }
      })

  const [optionsSources, setOptionsSources] = useState(inititalSources)

  const sourcesAutoSider =
    sources &&
    sources.sources
      ?.filter(
        (item) =>
          item.is_integrated &&
          item.name !== "Ручной ввод" &&
          !item.disable_date
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
  const sourcesHandSider =
    sources &&
    sources.sources
      ?.filter(
        (item) =>
          !item.is_integrated &&
          item.name !== "Ручной ввод" &&
          !item.disable_date
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
  const [sourcesIsLoading, setSourcesIsLoading] = useState("")

  const [sourcesLoaded, setSourcesLoaded] = useState(false)
  const [sourcesError, setSourcesError] = useState(false)

  const {
    loaded: loadedSources,
    loading: loadingSources,
    isLoadingForPage,
  } = useSelector((state: RootState) => state.sources)

  const sources_red = useSelector(
    (state: RootState) => state.sources.sourcesInfo
  )

  const clearAll = () => {
    dispatch(clearData())
    dispatch(clearTasks())
    dispatch(clearSources())
  }

  const [isSourcesLoaded, setIsSourcesLoaded] = useState(false)

  useEffect(() => {
    const fetchOperations = () => {
      setIsSourcesLoaded(true)
      try {
        dispatch(fetchSourcesInfo())
      } catch (error) {
        if ((error as ApiError).status === 422) {
          logout(), clearAll(), navigate("/login")
        }
        setSourcesIsLoading("")
        setSourcesLoaded(false)
        setSourcesError(true)
      }
    }
    if (
      loadingSources !== "loading" &&
      loadingSources !== undefined &&
      !isSourcesLoaded &&
      !isLoadingForPage
    ) {
      fetchOperations()
    }
  }, [loadingSources, isSourcesLoaded, isLoadingForPage])

  useEffect(() => {
    setSources(sources_red)
    setSourcesLoaded(true)
    setSourcesIsLoading("")
    setSourcesError(false)
  }, [sources_red])

  const fetchSourcesHand = async () => {
    try {
      const sourcesResponse = await api.sources.getSourcesInfoSourcesGet({
        headers,
      })
      setSourcesLoaded(true)
      setSources(sourcesResponse.data)
      setSourcesError(false)
    } catch (error) {
      if ((error as ApiError).status === 422) {
        logout(), clearAll(), navigate("/login")
      }
      setSourcesLoaded(false)
      setSourcesError(true)
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

  const selectRef = useRef<RefSelectProps>(null)

  const [operationsValue, setOperationsValue] = useState([{ id: "", value: 1 }])

  const handleChangeMarkup = async (newMarkup: number) => {
    if (selectRef.current) {
      selectRef.current.blur()
    }

    const updatedGroupedOperations: Record<string, Operation[]> = {}

    operationsData?.operations.forEach((operation) => {
      const date = operation.date

      if (!updatedGroupedOperations[date]) {
        updatedGroupedOperations[date] = []
      }
      if (operation.id === hoveredIndex) {
        const newOperation = { ...operation, operation_type: newMarkup }
        updatedGroupedOperations[date].push(newOperation)
      } else updatedGroupedOperations[date].push(operation)
    })

    setGroupedOperations(updatedGroupedOperations)
    hoveredIndex &&
      setOperationsValue((prevData) => {
        const indexToUpdate = prevData.findIndex(
          (item) => item.id === hoveredIndex
        )
        if (indexToUpdate !== -1) {
          const updatedData = [...prevData]
          updatedData[indexToUpdate] = {
            id: hoveredIndex,
            value: newMarkup,
          }
          return updatedData
        } else {
          return [...prevData, { id: hoveredIndex, value: newMarkup }]
        }
      })

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
    } finally {
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

      setSelectedStartDate(dateStrings[0])
      setSelectedEndDate(dateStrings[1])
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
  const startDateRef = useRef<PickerRef>(null)

  const endDateRef = useRef<PickerRef>(null)

  const handleMinDateRangeChange = (dateStrings: string) => {
    if (selectedEndDate === null) {
      setSelectedStartDate(dateStrings)
      endDateRef.current?.focus()
    } else {
      setSelectedStartDate(dateStrings)
      setPagination({
        page_number: 1,
        row_count: 30,
        request_id: v4(),
      })
      setIsFetching(true)
    }
  }

  const handleMaxDateRangeChange = (dateStrings: string) => {
    if (selectedStartDate === null) {
      setSelectedEndDate(dateStrings)
      startDateRef.current?.focus()
    } else {
      if (selectedStartDate !== "" && dateStrings != "") {
        setPagination({
          page_number: 1,
          row_count: 30,
          request_id: v4(),
        })

        setSelectedEndDate(dateStrings)
        setIsFetching(true)
      }
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

  const [haveData, setHaveDate] = useState(false)

  const fetchOperations = useCallback(async () => {
    if (isFetching) {
      try {
        const filters: GetOperationsRequest = {
          start_date: selectedStartDate
            ? convertDateFormat(selectedStartDate)
            : undefined,
          end_date: selectedEndDate
            ? convertDateFormat(selectedEndDate)
            : undefined,
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

          setOperationsValue(
            operations.data.operations.map((item) => {
              return { id: item.id, value: item.markup.operation_type }
            })
          )
        } else {
          setOperationsData((prevData) => ({
            ...prevData,
            operations: [
              ...(prevData?.operations || []),
              ...operations.data.operations,
            ],
            pages_count: operations.data.pages_count,
          }))
          setOperationsValue((prevData) => [
            ...prevData,
            ...operations.data.operations.map((item) => ({
              id: item.id,
              value: item.markup.operation_type,
            })),
          ])
        }

        if (
          pagination.page_number === 1 &&
          operations.data.operations.length === 0 &&
          selectedStartDate === null &&
          selectedEndDate === null &&
          selectedOperationTypes.length === 0 &&
          selectedSources.length === 0
        )
          setFirstLoadedEmpty(true)
        else setFirstLoadedEmpty(false)

        if (
          pagination.page_number === 1 &&
          operations.data.operations.length === 0 &&
          (selectedStartDate !== null ||
            selectedEndDate !== null ||
            selectedOperationTypes.length !== 0 ||
            selectedSources.length !== 0)
        )
          setFilteredLoadedEmpty(true)
        else setFilteredLoadedEmpty(false)

        if (operations.data.operations.length !== 0)
          setPagination((prevPagination) => ({
            ...prevPagination,
            page_number: prevPagination.page_number + 1,
          }))
        setIsFetching(false)
        setOperationsLoaded(true)
      } catch (error) {
        console.log(error)
        if ((error as ApiError).status === 422) {
          logout(), clearAll(), navigate("/login")
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

  const {
    data: currentUser,
    loaded,
    loading,
  } = useSelector((state: RootState) => state.user)

  useEffect(() => {
    if (!loaded && loading !== "succeeded" && loading !== "loading")
      dispatch(fetchCurrentUser())
  }, [dispatch, loaded, loading])

  const [filterButtonDisabled, setFilterButtonDisabled] = useState(true)

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

    setIsAddSourceOpen(true)
  }

  const [failedType, setFailedType] = useState("")
  const [failedBankBik, setFailedBankBik] = useState("")
  const [failedSubName, setFailedSubName] = useState("")

  const failedBank = (bik: string, sub_name: string) => {
    setFailedBankBik(bik)
    setFailedSubName(sub_name)
  }
  const failedOfd = (sub_name: string) => {
    setFailedSubName(sub_name)
  }
  const failedMarketplace = (sub_name: string) => {
    setFailedSubName(sub_name)
  }

  const isMobile = useMediaQuery("(max-width: 1023px)")
  const isTablet = useMediaQuery("(max-width: 1279px)")

  const [downloadKudir, setDownloadKudir] = useState(false)

  const [activeKey, setActiveKey] = useState<string | string[]>([])

  const collapseItems = [
    {
      key: 1,
      label: (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <CollapseFilterIcon />{" "}
            <Text className={styles["sources-non-text"]}>
              {CONTENT.FILTER_HEADING}
            </Text>
          </div>
          {activeKey.length === 0 && !filterButtonDisabled && (
            <Link
              className={styles["reset-filter-link"]}
              onClick={(eve) => {
                eve.stopPropagation()
                resetFilter()
              }}
            >
              {CONTENT.RESET_FILTERS}
            </Link>
          )}
        </div>
      ),

      children: (
        <div className={styles["income-header-wrapper"]}>
          <SelectOne
            placeholder={CONTENT.SELECT_ACCOUNT_NUMBER}
            className={styles["account-select"]}
            options={optionsSources}
            onChange={handleSourcesChange}
            mode="multiple"
            maxTagCount={1}
            value={selectedSources}
            allowClear
          />
          <SelectOne
            placeholder={CONTENT.SELECT_OPERATION_TYPE}
            className={styles["operation-select"]}
            options={optionsTypesSelect}
            onChange={handleOperationTypesChange}
            dropdownStyle={{
              width: "250px",
            }}
            onClear={() => setOptionsTypesSelect(initialOptionTypesSelect)}
            value={selectedOperationTypes}
            mode="multiple"
            maxTagCount={1}
          />
          {!isMobile ? (
            <DatePicker.RangePicker
              locale={locale}
              format={dateFormat}
              allowClear
              placeholder={["Дата с", "Дата по"]}
              className={cn("datepicker", styles["datepicker-item"])}
              minDate={
                currentUser.tax_date_begin
                  ? dayjs(
                      convertReverseFormat(currentUser.tax_date_begin),
                      dateFormat
                    )
                  : undefined
              }
              maxDate={dayjs(
                convertReverseFormat(getCurrentDate()),
                dateFormat
              )}
              style={{ borderRadius: "4px" }}
              value={[
                selectedStartDate !== null
                  ? dayjs(selectedStartDate, dateFormat)
                  : null,
                selectedEndDate !== null
                  ? dayjs(selectedEndDate, dateFormat)
                  : null,
              ]}
              onChange={(dates, dateStrings) =>
                handleDateRangeChange(dateStrings)
              }
            />
          ) : (
            <>
              <DatePicker
                locale={locale}
                format={dateFormat}
                allowClear
                ref={startDateRef}
                placeholder={"Дата с"}
                style={{ borderRadius: "4px" }}
                className={cn("datepicker", styles["datepicker-item"])}
                minDate={
                  currentUser.tax_date_begin
                    ? dayjs(
                        convertReverseFormat(currentUser.tax_date_begin),
                        dateFormat
                      )
                    : undefined
                }
                maxDate={
                  selectedEndDate !== null
                    ? dayjs(selectedEndDate, dateFormat)
                    : dayjs(formatDateString(), dateFormat)
                }
                value={
                  selectedStartDate
                    ? dayjs(selectedStartDate, dateFormat)
                    : null
                }
                onChange={(value, dateString) => {
                  typeof dateString === "string" &&
                    handleMinDateRangeChange(dateString)
                }}
              />
              <DatePicker
                locale={locale}
                ref={endDateRef}
                format={dateFormat}
                allowClear
                placeholder={"Дата по"}
                style={{ borderRadius: "4px" }}
                className={cn("datepicker", styles["datepicker-item"])}
                minDate={
                  currentUser.tax_date_begin && selectedStartDate !== null
                    ? dayjs(selectedStartDate, dateFormat)
                    : currentUser.tax_date_begin && selectedStartDate === null
                    ? dayjs(
                        convertReverseFormat(currentUser.tax_date_begin),
                        dateFormat
                      )
                    : undefined
                }
                maxDate={dayjs(formatDateString(), dateFormat)}
                value={
                  selectedEndDate ? dayjs(selectedEndDate, dateFormat) : null
                }
                onChange={(dates, value) =>
                  typeof value === "string" && handleMaxDateRangeChange(value)
                }
              />
            </>
          )}
          <ButtonOne
            onClick={resetFilter}
            type="secondary"
            disabled={filterButtonDisabled}
          >
            {CONTENT.RESET_FILTERS}
          </ButtonOne>
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
          <div className={styles["list-item-hide"]}>
            <div className={styles["left-source-name"]}>
              {item.short_name && item.short_name !== null ? (
                <Tooltip
                  title={
                    item.type !== "marketplace" &&
                    item.type !== "ofd" &&
                    item.name
                  }
                >
                  <Text className={styles["source-text-left"]}>
                    {item.short_name.length > 10 && item.type !== "marketplace"
                      ? `${item.short_name.substring(0, 10)}...`
                      : item.short_name}
                  </Text>
                </Tooltip>
              ) : item.name.length > 10 ? (
                <Tooltip
                  title={
                    item.type !== "marketplace" &&
                    item.type !== "ofd" &&
                    item.name
                  }
                >
                  <Text className={styles["source-text-left"]}>
                    {item.name.length > 10 && isTablet
                      ? `${item.name.substring(0, 10)}...`
                      : item.name}
                  </Text>
                </Tooltip>
              ) : (
                <Text className={styles["source-text-left"]}>{item.name}</Text>
              )}

              <Text className={styles["source-text-right"]}>
                {item.sub_name ? " *" + item.sub_name?.slice(-4) : ""}
              </Text>
            </div>
            <div className={styles["hide-right-part"]}>
              <Text className={styles["date-style"]}>
                {CONTENT.OFF_AUTO_SOURCE_DISABLED}
              </Text>
              <Tooltip title={CONTENT.TOOLTIP_DISABLE_DATE}>
                <Text className={styles["date-style"]}>
                  {item.disable_date && convertReverseFormat(item.disable_date)}
                </Text>
              </Tooltip>
            </div>
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
                <Tooltip
                  title={
                    item.type !== "marketplace" &&
                    item.type !== "ofd" &&
                    item.name
                  }
                >
                  <Text className={styles["source-text-left"]}>
                    {item.short_name.length > 10
                      ? `${item.short_name.substring(0, 10)}...`
                      : item.short_name}
                  </Text>
                </Tooltip>
              ) : item.name.length > 10 ? (
                <Tooltip
                  title={
                    item.type !== "marketplace" &&
                    item.type !== "ofd" &&
                    item.name
                  }
                >
                  <Text className={styles["source-text-left"]}>
                    {item.name.length > 10 && isTablet
                      ? `${item.name.substring(0, 10)}...`
                      : item.name}
                  </Text>
                </Tooltip>
              ) : (
                <Text className={styles["source-text-left"]}>{item.name}</Text>
              )}

              <Text className={styles["source-text-right"]}>
                {item.sub_name ? " *" + item.sub_name?.slice(-4) : ""}
              </Text>
            </div>
            <div className={styles["hide-right-part"]}>
              <Text className={styles["date-style"]}>
                {CONTENT.OFF_SOURCE_DISABLED}
              </Text>
              <Tooltip title={CONTENT.TOOLTIP_DISABLE_DATE}>
                <Text className={styles["date-style"]}>
                  {item.disable_date && convertReverseFormat(item.disable_date)}
                </Text>
              </Tooltip>
            </div>
          </div>
        )),
    },
  ]

  useEffect(() => {
    if (
      !selectedEndDate &&
      !selectedStartDate &&
      selectedOperationTypes.length === 0 &&
      selectedSources.length === 0
    )
      setFilterButtonDisabled(true)
    else setFilterButtonDisabled(false)
  }, [
    selectedEndDate,
    selectedStartDate,
    selectedOperationTypes,
    selectedSources,
  ])

  const [marketplaceOperationOpen, setMarketplaceOperation] = useState(false)

  const [firstLoadedEmpty, setFirstLoadedEmpty] = useState(true)

  const [filteredLoadedEmpty, setFilteredLoadedEmpty] = useState(false)

  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            DatePicker: {
              cellActiveWithRangeBg: "#f0f0ff;",
              cellHoverWithRangeBg: "#6159FF",
              hoverBorderColor: "#8c8c8c",
              activeBorderColor: "#6159FF",
              colorTextDisabled: "#d1d1d1",
              fontFamily: "Inter",
              fontSize: 14,
            },
          },
        }}
      >
        {contextHolder}
        <Content className={styles["content-wrapper"]}>
          <div className={styles["title-button-header"]}>
            {isMobile && (
              <div className={styles["open-source-wrapper"]}>
                <Text
                  className={styles["mobile-source-title"]}
                  style={{ margin: "0" }}
                >
                  {CONTENT.HEADING_INCOME}
                </Text>
                <Link
                  className={styles["source-link-title"]}
                  onClick={showDrawer}
                >
                  <div
                    style={{
                      display: "flex",

                      justifyContent: "center",
                    }}
                  >
                    <SourceMobileIcon />
                  </div>
                  {CONTENT.SOURCE_MOBILE_TITLE}
                </Link>
              </div>
            )}
            {!isMobile && (
              <Text className={styles["heading-operations"]}>
                {CONTENT.HEADING_INCOME}
              </Text>
            )}
            <div className={styles["buttons-header"]}>
              <ButtonOne
                type="secondary"
                onClick={() => setDownloadKudir(true)}
              >
                <DownloadOutlined className={styles["download-icon"]} />
                {CONTENT.BUTTON_DOWNLOAD_KUDIR}
              </ButtonOne>
              <ButtonOne
                className={cn(
                  styles["buttons-row-item"],
                  styles["button-make"]
                )}
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
              {isMobile
                ? !firstLoadedEmpty && (
                    <Collapse
                      items={collapseItems}
                      bordered={true}
                      className="filter-collapse"
                      expandIconPosition="end"
                      onChange={(ckeyshange) => {
                        setActiveKey(ckeyshange)
                      }}
                    />
                  )
                : !firstLoadedEmpty && (
                    <div className={styles["income-header-wrapper"]}>
                      <SelectOne
                        placeholder={CONTENT.SELECT_ACCOUNT_NUMBER}
                        className={styles["account-select"]}
                        options={optionsSources}
                        onChange={handleSourcesChange}
                        value={selectedSources}
                        mode="multiple"
                        dropdownStyle={{
                          width: "250px",
                        }}
                        maxTagCount={1}
                        allowClear
                      />
                      <SelectOne
                        placeholder={CONTENT.SELECT_OPERATION_TYPE}
                        className={cn(
                          "select-operations-custom",
                          styles["operation-select"]
                        )}
                        options={optionsTypesSelect}
                        onChange={handleOperationTypesChange}
                        value={selectedOperationTypes}
                        mode="multiple"
                        dropdownStyle={{
                          width: "250px",
                        }}
                        maxTagCount={1}
                        allowClear
                      />
                      <DatePicker.RangePicker
                        locale={locale}
                        format={dateFormat}
                        placeholder={["Дата с", "Дата по"]}
                        className={cn("datepicker", styles["datepicker-item"])}
                        minDate={
                          currentUser.tax_date_begin
                            ? dayjs(
                                convertReverseFormat(
                                  currentUser.tax_date_begin
                                ),
                                dateFormat
                              )
                            : undefined
                        }
                        maxDate={dayjs(
                          convertReverseFormat(getCurrentDate()),
                          dateFormat
                        )}
                        style={{ borderRadius: "4px" }}
                        value={[
                          selectedStartDate !== null
                            ? dayjs(selectedStartDate, dateFormat)
                            : null,
                          selectedEndDate !== null
                            ? dayjs(selectedEndDate, dateFormat)
                            : null,
                        ]}
                        allowClear
                        onChange={(dates, dateStrings) =>
                          handleDateRangeChange(dateStrings)
                        }
                      />
                      <ButtonOne
                        onClick={resetFilter}
                        type="secondary"
                        disabled={filterButtonDisabled}
                      >
                        {CONTENT.RESET_FILTERS}
                      </ButtonOne>
                    </div>
                  )}

              <div className={styles["operations-table-wrapper"]}>
                <div className={styles["operations-table-inner"]}>
                  {!isMobile && !firstLoadedEmpty && !filteredLoadedEmpty && (
                    <div className={styles["table-header"]}>
                      {columns.map((item, index) => (
                        <div
                          className={styles["table-header-title"]}
                          key={index}
                        >
                          {item.title}
                        </div>
                      ))}
                    </div>
                  )}
                  {operationsLoaded ? (
                    operationsData && operationsData?.operations.length > 0 ? (
                      Object.entries(groupedOperations).length > 0 &&
                      Object.entries(groupedOperations).map(
                        ([date, operations]) => (
                          <div key={date}>
                            <div className={styles["table-date-row"]}>
                              {formatToPayDate(date)}
                            </div>
                            <div className={styles["operation-list-item"]}>
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
                                        setHoveredAmount(
                                          operation.markup.amount
                                        )
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
                                      className={
                                        styles["operation-type-wrapper"]
                                      }
                                    >
                                      <div
                                        className={cn(
                                          styles["operation-type-inner"],
                                          {
                                            ["type-income"]:
                                              operationsValue.filter(
                                                (item) =>
                                                  item.id === operation.id
                                              )[0] &&
                                              operationsValue.filter(
                                                (item) =>
                                                  item.id === operation.id
                                              )[0].value === 1,
                                            ["type-non"]:
                                              operationsValue.filter(
                                                (item) =>
                                                  item.id === operation.id
                                              )[0] &&
                                              operationsValue.filter(
                                                (item) =>
                                                  item.id === operation.id
                                              )[0].value === 2,
                                            ["type-back"]:
                                              operationsValue.filter(
                                                (item) =>
                                                  item.id === operation.id
                                              )[0] &&
                                              operationsValue.filter(
                                                (item) =>
                                                  item.id === operation.id
                                              )[0].value === 3,
                                            ["type-taxes"]:
                                              operationsValue.filter(
                                                (item) =>
                                                  item.id === operation.id
                                              )[0] &&
                                              operationsValue.filter(
                                                (item) =>
                                                  item.id === operation.id
                                              )[0].value === 4,
                                          }
                                        )}
                                      >
                                        <Select
                                          onSelect={() => {
                                            if (selectRef.current) {
                                              selectRef.current.blur()
                                            }
                                          }}
                                          ref={selectRef}
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
                                            width: "300px",
                                            padding: 0,
                                            borderRadius: "1px",
                                          }}
                                          className={cn(
                                            "type-item-select",
                                            styles["type-select-inner"],
                                            {
                                              ["type-income"]:
                                                operationsValue.filter(
                                                  (item) =>
                                                    item.id === operation.id
                                                )[0] &&
                                                operationsValue.filter(
                                                  (item) =>
                                                    item.id === operation.id
                                                )[0].value === 1,
                                              ["type-non"]:
                                                operationsValue.filter(
                                                  (item) =>
                                                    item.id === operation.id
                                                )[0] &&
                                                operationsValue.filter(
                                                  (item) =>
                                                    item.id === operation.id
                                                )[0].value === 2,
                                              ["type-back"]:
                                                operationsValue.filter(
                                                  (item) =>
                                                    item.id === operation.id
                                                )[0] &&
                                                operationsValue.filter(
                                                  (item) =>
                                                    item.id === operation.id
                                                )[0].value === 3,
                                              ["type-taxes"]:
                                                operationsValue.filter(
                                                  (item) =>
                                                    item.id === operation.id
                                                )[0] &&
                                                operationsValue.filter(
                                                  (item) =>
                                                    item.id === operation.id
                                                )[0].value === 4,
                                            }
                                          )}
                                          onChange={(value) => {
                                            handleChangeMarkup(value)
                                          }}
                                        />

                                        {operation.markup_mode_code === 2 ||
                                        operation.markup_mode_code === 3 ||
                                        (operationsValue.filter(
                                          (item) => item.id === operation.id
                                        )[0] &&
                                          operationsValue.filter(
                                            (item) => item.id === operation.id
                                          )[0].value !==
                                            operation.markup.operation_type) ? (
                                          <Tooltip
                                            title={
                                              CONTENT.TOOLTIP_MARKUP_CHANGED
                                            }
                                          >
                                            <PersonEditIcon />
                                          </Tooltip>
                                        ) : null}
                                      </div>
                                      {isMobile && (
                                        <Button
                                          className={cn(
                                            styles["no-border-button"],
                                            styles["button-delete-mobile"]
                                          )}
                                          onClick={() =>
                                            setIsDeleteModalOpen(true)
                                          }
                                        >
                                          <DeleteOperationIcon />
                                        </Button>
                                      )}
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
                                              className={
                                                styles["amount-nowrap"]
                                              }
                                            />
                                          ) : (
                                            <Amount
                                              prefix={
                                                operation.category === "debet"
                                                  ? "plus"
                                                  : "minus"
                                              }
                                              currency="RUB"
                                              value={Math.abs(
                                                operation.markup.amount
                                              )}
                                              className={
                                                styles["amount-nowrap"]
                                              }
                                            />
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

                                      {!isMobile && (
                                        <Tooltip title={CONTENT.DELETE_TOOLTIP}>
                                          <ButtonOne
                                            className={styles["delete-icon"]}
                                            type="danger"
                                            onClick={() =>
                                              setIsDeleteModalOpen(true)
                                            }
                                          >
                                            <DeleteOutlined />
                                          </ButtonOne>
                                        </Tooltip>
                                      )}
                                    </div>
                                  </div>
                                  {/*isMobile && (
                                      <div className={styles["divider"]}></div>
                                    )*/}
                                </>
                              ))}
                            </div>
                          </div>
                        )
                      )
                    ) : firstLoadedEmpty ? (
                      <div className={styles["non-taxes-operations"]}>
                        <NonTaxesImage />
                        <div className={styles["non-operations-wrapper"]}>
                          <Text className={styles["non-title"]}>
                            {CONTENT.NON_OPERATIONS_TITLE}
                          </Text>
                          <Text className={styles["non-text"]}>
                            {CONTENT.NON_OPERATIONS}
                          </Text>
                          <Text className={styles["non-text"]}>
                            {CONTENT.NON_OPERATIONS_NEED}
                            <Text className={styles["non-text-bold"]}>
                              {getFormattedYearDate()}
                            </Text>
                          </Text>
                        </div>
                        <ButtonOne
                          className={styles["non-source-button"]}
                          onClick={() => setIsAddSourceOpen(true)}
                        >
                          <PlusOutlined
                            className={styles["plus-non-icon"]}
                            style={{ marginInlineStart: "4px" }}
                          />
                          {CONTENT.BUTTON_ADD_SOURCE_NON}
                        </ButtonOne>
                      </div>
                    ) : (
                      filteredLoadedEmpty &&
                      filteredLoadedEmpty && (
                        <div className={styles["non-taxes"]}>
                          <NonTaxesImage />
                          <div className={styles["non-wrapper"]}>
                            <Text className={styles["non-text"]}>
                              {CONTENT.TEXT_NON_TAXES}
                            </Text>
                          </div>
                          {/*<ButtonOne
                          className={styles["non-source-button"]}
                          onClick={() => setIsAddSourceOpen(true)}
                        >
                          <PlusOutlined
                            className={styles["plus-non-icon"]}
                            style={{ marginInlineStart: "4px" }}
                          />
                          {CONTENT.BUTTON_ADD_SOURCE_NON}
                    </ButtonOne>*/}
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
            <Text className={styles["non-title"]}>
              {CONTENT.HEADING_DATA_SOURCES}
              <Button
                onClick={() => fetchSourcesHand()}
                className={styles["refresh-sources"]}
              >
                <ArrowCounterIcon />
              </Button>
            </Text>

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
                  {/*<Tooltip title={CONTENT.HAND_LOAD_INFO_TOOLTIP}>
                    <InfoCircleOutlined
                      className={styles["sider-icon"]}
                      size={24}
                    />
            </Tooltip>*/}
                </Title>
                <List
                  dataSource={sourcesHandSider}
                  renderItem={(item) => (
                    <List.Item
                      className={cn(
                        "sources-list-item",
                        styles["list-item-right"]
                      )}
                      style={{ borderBlockEnd: "none" }}
                    >
                      <div className={styles["left-source-name"]}>
                        {item.state === "in_progress" ? (
                          item.link && item.link !== "" ? (
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
                        ) : (
                          item.state === "completed" &&
                          item.is_integrated === false &&
                          !item.disable_date && (
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
                          )
                        )}
                        {item.short_name && item.short_name !== null ? (
                          <Tooltip
                            title={
                              item.type !== "marketplace" &&
                              item.type !== "ofd" &&
                              item.name
                            }
                          >
                            <Text className={styles["source-text-left"]}>
                              {item.short_name.length > 10 && isTablet
                                ? `${item.short_name.substring(0, 10)}...`
                                : item.short_name}
                            </Text>
                          </Tooltip>
                        ) : item.name.length > 10 ? (
                          <Tooltip
                            title={
                              item.type !== "marketplace" &&
                              item.type !== "ofd" &&
                              item.name
                            }
                          >
                            <Text className={styles["source-text-left"]}>
                              {`${item.name.substring(0, 10)}..`}{" "}
                            </Text>
                          </Tooltip>
                        ) : (
                          <Text className={styles["source-text-left"]}>
                            {item.name}
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
                            [styles["source-no-date-part"]]:
                              !item.disable_date && !item.last_info,
                          })}
                        >
                          {item.state === "completed" &&
                          !item.disable_date &&
                          item.last_info ? (
                            <Tooltip title={CONTENT.TOOLTIP_DATE}>
                              <Text className={styles["date-style"]}>
                                {item.last_info &&
                                  convertReverseFormat(item.last_info)}
                              </Text>
                            </Tooltip>
                          ) : item.state === "failed" ? (
                            <Link
                              className={styles["source-link"]}
                              onClick={() => {
                                isMobile && closeDrawer()
                                handleCompletedSource(
                                  item.type === "account" &&
                                    item.is_integrated === false
                                    ? 1
                                    : item.type === "ofd" &&
                                      item.is_integrated === false
                                    ? 2
                                    : item.type === "account" &&
                                      item.is_integrated === true
                                    ? 3
                                    : item.type === "ofd" &&
                                      item.is_integrated === true
                                    ? 4
                                    : item.type === "marketplace" &&
                                      item.is_integrated === true
                                    ? 5
                                    : null
                                )
                                item.type === "account" &&
                                item.is_integrated === true
                                  ? item.bank_bik &&
                                    item.sub_name &&
                                    failedBank(item.bank_bik, item.sub_name)
                                  : item.type === "ofd" &&
                                    item.is_integrated === true
                                  ? failedOfd(item.name)
                                  : item.type === "marketplace" &&
                                    item.is_integrated === true
                                  ? failedMarketplace(item.name)
                                  : null
                              }}
                            >
                              {"Повторить"}
                            </Link>
                          ) : item.state === "in_progress" &&
                            item.link &&
                            item.link !== "" ? (
                            <Link className={styles["source-link"]}>
                              {"Подключить"}
                            </Link>
                          ) : (
                            CONTENT.NO_SOURCE
                          )}
                          {!(item.state == "in_progress" && !item.link) ? (
                            <Tooltip
                              title={
                                item.is_integrated === false &&
                                item.state === "completed" &&
                                !item.disable_date &&
                                (item.type === "account" || item.type === "ofd")
                                  ? CONTENT.OFF_SOURCE_TOOLTIP
                                  : item.state === "failed"
                                  ? CONTENT.DELETE_SOURCE_TOOLTIP
                                  : item.is_integrated === true &&
                                    item.state === "in_progress" &&
                                    !!item.link
                                  ? CONTENT.CANCEL_INTEGRATION_SOURCE_TOOPLTIP
                                  : item.is_integrated === true &&
                                    item.state === "completed" &&
                                    !item.disable_date
                                  ? CONTENT.OFF_INTEGRATION_SOURCE_TOOLTIP
                                  : undefined
                              }
                            >
                              {!(
                                item.state === "completed" && item.disable_date
                              ) ? (
                                <Button
                                  className={cn("delete-fly-icon", {
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
                                    setTypeSourceName(
                                      item.type === "marketplace" &&
                                        item.short_name
                                        ? item.short_name
                                        : item.name
                                    )
                                    setAccountSource(item.sub_name || "")
                                    setOffSourceId(item.id)
                                  }}
                                >
                                  {item.state === "failed" ? (
                                    <DeleteSourceIcon />
                                  ) : item.state === "completed" ? (
                                    <HideEyeIcon />
                                  ) : item.state === "in_progress" &&
                                    !!item.link ? (
                                    <HideEyeIcon />
                                  ) : undefined}
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
                          ) : (
                            <div style={{ width: "26px" }}></div>
                          )}
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              </>
            )}
            {sourcesHandDisabledSider &&
              sourcesHandDisabledSider.length > 0 && (
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
                      className={cn(
                        "sources-list-item",
                        styles["list-item-right"]
                      )}
                      style={{ borderBlockEnd: "none" }}
                    >
                      <div className={styles["left-source-name"]}>
                        {item.state === "in_progress" ? (
                          item.link && item.link !== "" ? (
                            <Tooltip title={CONTENT.TOOLTIP_ORANGE}>
                              <InProgressOrangeIcon />
                            </Tooltip>
                          ) : (
                            <Tooltip title={CONTENT.TOOLTIP_GREY_AUTO}>
                              <InProgressIcon />
                            </Tooltip>
                          )
                        ) : item.state === "failed" ? (
                          <Tooltip title={item.reason}>
                            <FailedIcon />
                          </Tooltip>
                        ) : item.state === "completed" &&
                          item.is_integrated === true &&
                          !item.disable_date ? (
                          <Tooltip title={CONTENT.TOOLTIP_AUTO_INTEGRATED}>
                            <CompletedAutoIcon />
                          </Tooltip>
                        ) : null}

                        {item.short_name && item.short_name !== null ? (
                          <Tooltip
                            title={
                              item.type !== "marketplace" &&
                              item.type !== "ofd" &&
                              item.name
                            }
                          >
                            <Text className={styles["source-text-left"]}>
                              {item.short_name.length > 10 &&
                              isTablet &&
                              item.type !== "marketplace"
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
                            [styles["source-no-date-part"]]:
                              !item.disable_date && !item.last_info,
                          })}
                        >
                          {item.state === "completed" &&
                          !item.disable_date &&
                          item.last_info ? (
                            <Tooltip title={CONTENT.TOOLTIP_DATE}>
                              <Text className={styles["date-style"]}>
                                {item.last_info &&
                                  convertReverseFormat(item.last_info)}
                              </Text>
                            </Tooltip>
                          ) : item.state === "failed" ? (
                            <Link
                              className={styles["source-link"]}
                              onClick={() => {
                                isMobile && closeDrawer()
                                handleCompletedSource(
                                  item.type === "account" &&
                                    item.is_integrated === false
                                    ? 1
                                    : item.type === "ofd" &&
                                      item.is_integrated === false
                                    ? 2
                                    : item.type === "account" &&
                                      item.is_integrated === true
                                    ? 3
                                    : item.type === "ofd" &&
                                      item.is_integrated === true
                                    ? 4
                                    : item.type === "marketplace" &&
                                      item.is_integrated === true
                                    ? 5
                                    : null
                                )
                                item.type === "account" &&
                                item.is_integrated === true
                                  ? item.bank_bik &&
                                    item.sub_name &&
                                    failedBank(item.bank_bik, item.sub_name)
                                  : item.type === "ofd" &&
                                    item.is_integrated === true
                                  ? failedOfd(item.name)
                                  : item.type === "marketplace" &&
                                    item.is_integrated === true
                                  ? failedMarketplace(item.name)
                                  : null
                              }}
                            >
                              {"Повторить"}
                            </Link>
                          ) : item.state === "in_progress" &&
                            item.link &&
                            item.link !== "" ? (
                            <Link className={styles["source-link"]}>
                              {"Подключить"}
                            </Link>
                          ) : (
                            CONTENT.NO_SOURCE
                          )}
                          {!(item.state == "in_progress" && !item.link) ? (
                            <Tooltip
                              title={
                                item.state === "failed"
                                  ? CONTENT.DELETE_SOURCE_TOOLTIP
                                  : item.state === "completed"
                                  ? CONTENT.OFF_INTEGRATION_SOURCE_TOOLTIP
                                  : item.state === "in_progress" && !!item.link
                                  ? CONTENT.CANCEL_INTEGRATION_SOURCE_TOOPLTIP
                                  : undefined
                              }
                            >
                              {!(
                                item.state === "completed" && item.disable_date
                              ) ? (
                                <Button
                                  className={cn("delete-fly-icon", {
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
                                    setTypeSourceName(
                                      item.type === "marketplace" &&
                                        item.short_name
                                        ? item.short_name
                                        : item.name
                                    )
                                    setOffSourceId(item.id)
                                  }}
                                >
                                  {item.state === "failed" ? (
                                    <DeleteSourceIcon />
                                  ) : item.state === "completed" ? (
                                    <RepeatCrossIcon />
                                  ) : item.state === "in_progress" &&
                                    !!item.link ? (
                                    <DeleteSourceIcon />
                                  ) : undefined}
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
                          ) : (
                            <div style={{ width: "26px" }}></div>
                          )}
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              </>
            )}
            {sourcesAutoDisabledSider &&
              sourcesAutoDisabledSider.length > 0 && (
                <Collapse
                  items={collapsedAutoSources}
                  bordered={false}
                  className="hide-sources payment-collapse"
                  ghost
                  expandIconPosition="right"
                />
              )}
            {sourcesLoaded &&
              sources?.sources?.length == 0 &&
              sources.sources.filter((item) => item.name !== "Ручной ввод") && (
                <div className={styles["sources-non-banner"]}>
                  <div className={styles["sources-non-banner-inner"]}>
                    <WalletPigIcon />
                    <Text className={styles["sources-non-title"]}>
                      {CONTENT.SOURCES_LOADED_EMPTY_TITLE}
                    </Text>
                    <Text className={styles["sources-non-text"]}>
                      {CONTENT.SOURCES_LOADED_EMPTY_DESCRIPTION_ONE}
                      <Text className={styles["sources-non-bold"]}>
                        {CONTENT.SOURCES_LOADED_EMPTY_DESCRIPTION_TWO}
                      </Text>
                      {CONTENT.SOURCES_LOADED_EMPTY_DESCRIPTION_THREE}
                      <Text className={styles["sources-non-bold"]}>
                        {CONTENT.SOURCES_LOADED_EMPTY_DESCRIPTION_FOUR}
                      </Text>
                      {CONTENT.SOURCES_LOADED_EMPTY_DESCRIPTION_FIVE}
                    </Text>
                    <Text className={styles["sources-non-text"]}>
                      {CONTENT.SOURCES_LOADED_EMPTY_DESCRIPTION_SIX}
                    </Text>
                  </div>
                </div>
              )}
            {sourcesError && (
              <div className={styles["sources-error-banner"]}>
                <div className={styles["sources-error-banner-inner"]}>
                  <FailedIcon />
                  <Text className={styles["sources-non-title"]}>
                    {CONTENT.SOURCES_ERROR_TITLE}
                  </Text>
                  <Text className={styles["sources-non-text"]}>
                    {CONTENT.SOURCES_ERROR_ONE}
                  </Text>
                  <Text className={styles["sources-non-text"]}>
                    {CONTENT.SOURCES_ERROR_TWO}
                  </Text>
                </div>
              </div>
            )}
          </Sider>
        )}
        {isMobile && (
          <Drawer
            open={isOpenDrawer}
            onClose={closeDrawer}
            width={"100%"}
            className="taxes-drawer"
            closeIcon={false}
          >
            <div className={styles["drawer-wrapper"]}>
              <div className={styles["open-source-wrapper"]}>
                <Text className={styles["mobile-source-title"]}>
                  {CONTENT.HEADING_DATA_SOURCES}{" "}
                </Text>
                <CloseOutlined
                  className="custom-close-icon"
                  onClick={closeDrawer}
                />
              </div>
              <div className={styles["buttons-drawer"]}>
                <ButtonOne
                  onClick={(e) => {
                    e.currentTarget.blur()
                    updateRef.current?.blur()
                    fetchSourcesHand()
                  }}
                  ref={updateRef}
                  onTouchEnd={(e) => {
                    e.currentTarget.blur()
                  }}
                  type="secondary"
                  className={styles["button-drawer-item"]}
                >
                  <ArrowCounterIcon />
                  {CONTENT.SOURCE_MOBILE_UPDATE}
                </ButtonOne>
                <ButtonOne
                  className={cn(
                    styles["buttons-row-item"],
                    styles["button-make"],
                    styles["button-drawer-item"]
                  )}
                  onClick={() => {
                    closeDrawer()
                    setIsAddSourceOpen(true)
                  }}
                >
                  <PlusOutlined
                    className={styles["plus-icon"]}
                    style={{ marginInlineStart: "4px" }}
                  />
                  {CONTENT.BUTTON_ADD_OPERATION}
                </ButtonOne>
              </div>
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
                    {/*<Tooltip title={CONTENT.HAND_LOAD_INFO_TOOLTIP}>
                      <InfoCircleOutlined
                        className={styles["sider-icon"]}
                        size={24}
                      />
              </Tooltip>*/}
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
                            item.link && item.link !== "" ? (
                              <Tooltip
                                title={CONTENT.TOOLTIP_ORANGE}
                                placement="topLeft"
                              >
                                <InProgressOrangeIcon />
                              </Tooltip>
                            ) : (
                              <Tooltip
                                title={CONTENT.TOOLTIP_GREY}
                                placement="topLeft"
                              >
                                <InProgressIcon />
                              </Tooltip>
                            )
                          ) : item.state === "failed" ? (
                            <Tooltip title={item.reason} placement="topLeft">
                              <FailedIcon />
                            </Tooltip>
                          ) : (
                            item.state === "completed" &&
                            item.is_integrated === false &&
                            !item.disable_date && (
                              <Tooltip
                                title={
                                  !isMobile
                                    ? CONTENT.ADD_SOURCE_COMPLETED
                                    : undefined
                                }
                              >
                                <Button
                                  className={styles["source-completed-icon"]}
                                  onClick={() => {
                                    closeDrawer()
                                    handleCompletedSource(
                                      item.type === "account"
                                        ? 1
                                        : item.type === "ofd"
                                        ? 2
                                        : null
                                    )
                                  }}
                                >
                                  <CompletedHandIcon />
                                </Button>
                              </Tooltip>
                            )
                          )}
                          {item.short_name && item.short_name !== null ? (
                            <Tooltip
                              title={
                                item.type !== "marketplace" &&
                                item.type !== "ofd" &&
                                item.name
                              }
                            >
                              <Text className={styles["source-text-left"]}>
                                {item.short_name.length > 10 && isTablet
                                  ? `${item.short_name.substring(0, 10)}...`
                                  : item.short_name}
                              </Text>
                            </Tooltip>
                          ) : item.name.length > 10 ? (
                            <Tooltip
                              title={
                                item.type !== "marketplace" &&
                                item.type !== "ofd" &&
                                item.name
                              }
                            >
                              <Text className={styles["source-text-left"]}>
                                {`${item.name.substring(0, 10)}..`}{" "}
                              </Text>
                            </Tooltip>
                          ) : (
                            <Text className={styles["source-text-left"]}>
                              {item.name}
                            </Text>
                          )}

                          <Text className={styles["source-text-right"]}>
                            {item.sub_name
                              ? " *" + item.sub_name?.slice(-4)
                              : ""}
                          </Text>
                        </div>
                        <div className={styles["source-date-inner"]}>
                          <div
                            className={cn({
                              [styles["source-date-part-disable"]]:
                                item.disable_date,
                              [styles["source-date-part"]]: !item.disable_date,
                              [styles["source-no-date-part"]]:
                                !item.disable_date && !item.last_info,
                            })}
                          >
                            {item.state === "completed" &&
                            !item.disable_date &&
                            item.last_info ? (
                              <Tooltip title={CONTENT.TOOLTIP_DATE}>
                                <Text className={styles["date-style"]}>
                                  {item.last_info &&
                                    convertReverseFormat(item.last_info)}
                                </Text>
                              </Tooltip>
                            ) : item.state === "failed" ? (
                              <Link
                                className={styles["source-link"]}
                                onClick={() => {
                                  isMobile && closeDrawer()
                                  handleCompletedSource(
                                    item.type === "account" &&
                                      item.is_integrated === false
                                      ? 1
                                      : item.type === "ofd" &&
                                        item.is_integrated === false
                                      ? 2
                                      : item.type === "account" &&
                                        item.is_integrated === true
                                      ? 3
                                      : item.type === "ofd" &&
                                        item.is_integrated === true
                                      ? 4
                                      : item.type === "marketplace" &&
                                        item.is_integrated === true
                                      ? 5
                                      : null
                                  )
                                  item.type === "account" &&
                                  item.is_integrated === true
                                    ? item.bank_bik &&
                                      item.sub_name &&
                                      failedBank(item.bank_bik, item.sub_name)
                                    : item.type === "ofd" &&
                                      item.is_integrated === true
                                    ? failedOfd(item.name)
                                    : item.type === "marketplace" &&
                                      item.is_integrated === true
                                    ? failedMarketplace(item.name)
                                    : null
                                }}
                              >
                                {"Повторить"}
                              </Link>
                            ) : item.state === "in_progress" &&
                              item.link &&
                              item.link !== "" ? (
                              <Link className={styles["source-link"]}>
                                {"Подключить"}
                              </Link>
                            ) : (
                              CONTENT.NO_SOURCE
                            )}
                            {!(item.state == "in_progress" && !item.link) ? (
                              <Tooltip
                                title={
                                  isMobile
                                    ? undefined
                                    : item.is_integrated === false &&
                                      item.state === "completed" &&
                                      !item.disable_date &&
                                      (item.type === "account" ||
                                        item.type === "ofd")
                                    ? CONTENT.OFF_SOURCE_TOOLTIP
                                    : item.state === "failed"
                                    ? CONTENT.DELETE_SOURCE_TOOLTIP
                                    : item.is_integrated === true &&
                                      item.state === "in_progress" &&
                                      !!item.link
                                    ? CONTENT.CANCEL_INTEGRATION_SOURCE_TOOPLTIP
                                    : item.is_integrated === true &&
                                      item.state === "completed" &&
                                      !item.disable_date
                                    ? CONTENT.OFF_INTEGRATION_SOURCE_TOOLTIP
                                    : undefined
                                }
                              >
                                {!(
                                  item.state === "completed" &&
                                  item.disable_date
                                ) ? (
                                  <Button
                                    className={cn("delete-fly-icon", {
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
                                      setTypeSourceName(
                                        item.type === "marketplace" &&
                                          item.short_name
                                          ? item.short_name
                                          : item.name
                                      )
                                      setAccountSource(item.sub_name || "")
                                      setOffSourceId(item.id)
                                    }}
                                  >
                                    {item.state === "failed" ? (
                                      <DeleteSourceIcon />
                                    ) : item.state === "completed" ? (
                                      <HideEyeIcon />
                                    ) : item.state === "in_progress" &&
                                      !!item.link ? (
                                      <HideEyeIcon />
                                    ) : undefined}
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
                            ) : (
                              <div style={{ width: "26px" }}></div>
                            )}
                          </div>
                        </div>
                      </List.Item>
                    )}
                  />
                </>
              )}
              {sourcesHandDisabledSider &&
                sourcesHandDisabledSider.length > 0 && (
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
                            item.link && item.link !== "" ? (
                              <Tooltip
                                title={CONTENT.TOOLTIP_ORANGE}
                                placement="topLeft"
                              >
                                <InProgressOrangeIcon />
                              </Tooltip>
                            ) : (
                              <Tooltip
                                title={CONTENT.TOOLTIP_GREY}
                                placement="topLeft"
                              >
                                <InProgressIcon />
                              </Tooltip>
                            )
                          ) : item.state === "failed" ? (
                            <Tooltip title={item.reason} placement="topLeft">
                              <FailedIcon />
                            </Tooltip>
                          ) : item.state === "completed" &&
                            item.is_integrated === false &&
                            !item.disable_date ? (
                            <Tooltip
                              placement="topLeft"
                              title={CONTENT.TOOLTIP_AUTO_INTEGRATED}
                            >
                              <CompletedHandIcon />
                            </Tooltip>
                          ) : item.state === "completed" &&
                            item.is_integrated === true &&
                            !item.disable_date ? (
                            <Tooltip
                              placement="topLeft"
                              title={CONTENT.TOOLTIP_AUTO_INTEGRATED}
                            >
                              <CompletedAutoIcon />
                            </Tooltip>
                          ) : null}

                          {item.short_name && item.short_name !== null ? (
                            <Tooltip
                              title={
                                item.type !== "marketplace" &&
                                item.type !== "ofd" &&
                                item.name
                              }
                            >
                              <Text className={styles["source-text-left"]}>
                                {item.short_name.length > 10 &&
                                isTablet &&
                                item.type !== "marketplace"
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
                            {item.sub_name
                              ? " *" + item.sub_name?.slice(-4)
                              : ""}
                          </Text>
                        </div>
                        <div className={styles["source-date-inner"]}>
                          <div
                            className={cn({
                              [styles["source-date-part-disable"]]:
                                item.disable_date,
                              [styles["source-date-part"]]: !item.disable_date,
                              [styles["source-no-date-part"]]:
                                !item.disable_date && !item.last_info,
                            })}
                          >
                            {item.state === "completed" &&
                            !item.disable_date &&
                            item.last_info ? (
                              <Tooltip title={CONTENT.TOOLTIP_DATE}>
                                <Text className={styles["date-style"]}>
                                  {item.last_info &&
                                    convertReverseFormat(item.last_info)}
                                </Text>
                              </Tooltip>
                            ) : item.state === "failed" ? (
                              <Link
                                className={styles["source-link"]}
                                onClick={() => {
                                  isMobile && closeDrawer()
                                  handleCompletedSource(
                                    item.type === "account" &&
                                      item.is_integrated === false
                                      ? 1
                                      : item.type === "ofd" &&
                                        item.is_integrated === false
                                      ? 2
                                      : item.type === "account" &&
                                        item.is_integrated === true
                                      ? 3
                                      : item.type === "ofd" &&
                                        item.is_integrated === true
                                      ? 4
                                      : item.type === "marketplace" &&
                                        item.is_integrated === true
                                      ? 5
                                      : null
                                  )
                                  item.type === "account" &&
                                  item.is_integrated === true
                                    ? item.bank_bik &&
                                      item.sub_name &&
                                      failedBank(item.bank_bik, item.sub_name)
                                    : item.type === "ofd" &&
                                      item.is_integrated === true
                                    ? failedOfd(item.name)
                                    : item.type === "marketplace" &&
                                      item.is_integrated === true
                                    ? failedMarketplace(item.name)
                                    : null
                                }}
                              >
                                {"Повторить"}
                              </Link>
                            ) : item.state === "in_progress" &&
                              item.link &&
                              item.link !== "" ? (
                              <Link className={styles["source-link"]}>
                                {"Подключить"}
                              </Link>
                            ) : (
                              CONTENT.NO_SOURCE
                            )}
                            {!(item.state == "in_progress" && !item.link) ? (
                              <Tooltip
                                title={
                                  isMobile
                                    ? undefined
                                    : item.state === "failed"
                                    ? CONTENT.DELETE_SOURCE_TOOLTIP
                                    : item.state === "completed"
                                    ? CONTENT.OFF_INTEGRATION_SOURCE_TOOLTIP
                                    : item.state === "in_progress" &&
                                      !!item.link
                                    ? CONTENT.CANCEL_INTEGRATION_SOURCE_TOOPLTIP
                                    : undefined
                                }
                              >
                                {!(
                                  item.state === "completed" &&
                                  item.disable_date
                                ) ? (
                                  <Button
                                    className={cn("delete-fly-icon", {
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
                                      setTypeSourceName(
                                        item.type === "marketplace" &&
                                          item.short_name
                                          ? item.short_name
                                          : item.name
                                      )
                                      setOffSourceId(item.id)
                                    }}
                                  >
                                    {item.state === "failed" ? (
                                      <DeleteSourceIcon />
                                    ) : item.state === "completed" ? (
                                      <RepeatCrossIcon />
                                    ) : item.state === "in_progress" &&
                                      !!item.link ? (
                                      <DeleteSourceIcon />
                                    ) : undefined}
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
                            ) : (
                              <div style={{ width: "26px" }}></div>
                            )}
                          </div>
                        </div>
                      </List.Item>
                    )}
                  />
                </>
              )}
              {sourcesAutoDisabledSider &&
                sourcesAutoDisabledSider.length > 0 && (
                  <Collapse
                    items={collapsedAutoSources}
                    bordered={false}
                    className="hide-sources payment-collapse"
                    ghost
                    expandIconPosition="right"
                  />
                )}
              {sourcesLoaded &&
                sources?.sources?.length == 0 &&
                sources.sources.filter((item) => item.name !== "Ручной ввод")
                  .length === 0 && (
                  <div className={styles["sources-non-banner"]}>
                    <div className={styles["sources-non-banner-inner"]}>
                      <WalletPigIcon />
                      <Text className={styles["sources-non-title"]}>
                        {CONTENT.SOURCES_LOADED_EMPTY_TITLE}
                      </Text>
                      <Text className={styles["sources-non-text"]}>
                        {CONTENT.SOURCES_LOADED_EMPTY_DESCRIPTION_ONE}
                        <Text className={styles["sources-non-bold"]}>
                          {CONTENT.SOURCES_LOADED_EMPTY_DESCRIPTION_TWO}
                        </Text>
                        {CONTENT.SOURCES_LOADED_EMPTY_DESCRIPTION_THREE}
                        <Text className={styles["sources-non-bold"]}>
                          {CONTENT.SOURCES_LOADED_EMPTY_DESCRIPTION_FOUR}
                        </Text>
                        {CONTENT.SOURCES_LOADED_EMPTY_DESCRIPTION_FIVE}
                      </Text>
                      <Text className={styles["sources-non-text"]}>
                        {CONTENT.SOURCES_LOADED_EMPTY_DESCRIPTION_SIX}
                      </Text>
                    </div>
                  </div>
                )}
              {sourcesError && (
                <div className={styles["sources-error-banner"]}>
                  <div className={styles["sources-error-banner-inner"]}>
                    <FailedIcon />
                    <Text className={styles["sources-non-title"]}>
                      {CONTENT.SOURCES_ERROR_TITLE}
                    </Text>
                    <Text className={styles["sources-non-text"]}>
                      {CONTENT.SOURCES_ERROR_ONE}
                    </Text>
                    <Text className={styles["sources-non-text"]}>
                      {CONTENT.SOURCES_ERROR_TWO}
                    </Text>
                  </div>
                </div>
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
          failedBankBik={failedBankBik}
          failedSubName={failedSubName}
          setMarketplaceOperation={setMarketplaceOperation}
        />
        <AddOperationModal
          isOpen={addOperation}
          setOpen={setAddOperation}
          setWasDeleted={setWasDeleted}
        />
        <AddMarketplaceOperationModal
          isOpen={marketplaceOperationOpen}
          setOpen={setMarketplaceOperation}
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
          fetchSourcesHand={fetchSourcesHand}
        />
        <DownloadKudirModal isOpen={downloadKudir} setOpen={setDownloadKudir} />
      </ConfigProvider>
    </>
  )
}
