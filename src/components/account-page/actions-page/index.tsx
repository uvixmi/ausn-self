import {
  Button,
  ConfigProvider,
  Layout,
  Progress,
  Spin,
  Tooltip,
  Typography,
  message,
} from "antd"
import Link from "antd/es/typography/Link"
import { CONTENT, LINK_MAP } from "./constants"
import styles from "./styles.module.scss"
import cn from "classnames"
import { useEffect, useState } from "react"
import { PaymentModal } from "./payment-modal"
import { useDispatch, useSelector } from "react-redux"
import {
  BannerType,
  ReportFormat,
  TaskResponse,
  TaskType,
  api,
} from "../../../api/myApi"
import { AppDispatch, RootState } from "../../main-page/store"
import Cookies from "js-cookie"
import { useLocation, useNavigate } from "react-router-dom"
import { formatDateString, taxesQuarterHeading } from "./utils"
import { EnsPaymentModal } from "./ens-payment-modal"
import { AnalysisEnsModal } from "./analysis-ens-modal"
import { AllDoneBlock } from "./all-done-block"
import {
  DownloadOutlined,
  LoadingOutlined,
  CloseOutlined,
  InfoCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons"
import { formatToPayDate } from "../../main-page/utils"
import { setAmount } from "./payment-modal/slice"
import { convertDateFormat, getCurrentDate } from "./payment-modal/utils"
import { ConfirmPassModal } from "./confirm-pass-modal"
import { fetchSourcesInfo } from "../client/sources/thunks"
import { fetchTasks } from "../client/tasks/thunks"
import { fetchBanners } from "../client/banners/thunks"
import { useMediaQuery } from "@react-hook/media-query"
import { ApiError } from "../taxes-page/utils"
import { clearData } from "../../authorization-page/slice"
import { useAuth } from "../../../AuthContext"
import { ActionCurrencyIcon } from "../taxes-page/type-operation/icons/actions-currency"
import { ActionsReportIcon } from "../taxes-page/type-operation/icons/actions-report"
import { ButtonOne } from "../../../ui-kit/button"
import { NewActionsImage } from "../taxes-page/images/new-actions"
import { ArrowCounterIcon } from "../taxes-page/type-operation/icons/arrow-counter"
import dayjs from "dayjs"
import "dayjs/locale/ru"
import { Amount } from "../../../ui-kit/amount"
import { HideEyeIcon } from "../taxes-page/type-operation/icons/hide-eye"
import { BellBannerIcon } from "../taxes-page/type-operation/icons/bell-banner"
import { NoBannersIcon } from "../taxes-page/type-operation/icons/no-banners"
import { HaveBannersIcon } from "../taxes-page/type-operation/icons/have-banners"
import { NotificationsModal } from "./notifications-modal"
import "./styles.scss"
import { ArrowRoundUpdateIcon } from "../taxes-page/type-operation/icons/arrow-round-update"
import { clearTasks } from "../client/tasks/slice"
import { clearSources } from "../client/sources/slice"

export interface InfoBannerLinked {
  id: string

  banner_type: BannerType

  begin_date?: string | null

  end_date?: string | null

  title: string

  description: string[]
}

export const ActionsPage = () => {
  const dateFormat = "YYYY-MM-DD"
  dayjs.locale("ru")
  const [isPaymentOpen, setPaymentOpen] = useState(false)
  const [isEnsOpen, setEnsOpen] = useState(false)
  const { logout } = useAuth()
  const [isAnalysisOpen, setAnalysisOpen] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 22,
      }}
      spin
    />
  )

  const updateIcon = (
    <LoadingOutlined
      style={{
        fontSize: 14,
      }}
      spin
    />
  )

  const [dueAmount, setDueAmount] = useState<number | undefined>(undefined)

  const openEnsModal = (due_amount?: number | null) => {
    due_amount && setDueAmount(due_amount)
    setEnsOpen(true)
  }
  const openAnalysis = () => {
    setAnalysisOpen(true)
  }
  const { Sider, Content } = Layout
  const { Title, Text } = Typography

  const sources = useSelector(
    (state: RootState) => state.sources.sourcesInfo?.sources
  )

  const tasks = useSelector((state: RootState) => state.tasks.tasks?.tasks)
  const isRelevant = useSelector(
    (state: RootState) => state.tasks.tasks?.is_relevant
  )
  const tasksLoaded = useSelector((state: RootState) => state.tasks.loading)
  const fetchedBanners = useSelector(
    (state: RootState) => state.banners.banners?.banners
  )
  const token = Cookies.get("token")
  const location = useLocation()

  const [messageApi, contextHolder] = message.useMessage()
  const successDownload = () => {
    messageApi.open({
      type: "success",
      content: CONTENT.NOTIFICATION_DOWNLOAD_SUCCESS,
      style: { textAlign: "right" },
    })
  }
  const errorReport = () => {
    messageApi.open({
      type: "error",
      content: CONTENT.NOTIFCATION_REPORT_ERROR,
      style: { textAlign: "right" },
    })
  }
  const errorDownload = () => {
    messageApi.open({
      type: "error",
      content: CONTENT.NOTIFCATION_DOWNLOAD_ERROR,
      style: { textAlign: "right" },
    })
  }

  const errorTasks = () => {
    messageApi.open({
      type: "error",
      content: CONTENT.NOTIFCATION_TASKS_ERROR,
      style: { marginTop: "10vh", textAlign: "right" },
    })
  }

  const headers = {
    Authorization: `Bearer ${token}`,
  }

  const fetchTasksModal = async () => {
    try {
      dispatch(fetchTasks())
      setIsTasksLoaded(true)
    } catch (error) {
      errorTasks()
    }
  }

  const recalculation = async () => {
    try {
      startTimer()
      await api.taxes.recalculationTaxesTaxesRecalculationPut({ headers })

      dispatch(fetchTasks())
      setIsTasksLoaded(true)
    } catch (error) {
      errorTasks()
    }
  }

  const clearAll = () => {
    dispatch(clearData())
    dispatch(clearTasks())
    dispatch(clearSources())
  }

  const [isConfirmPass, setIsConfirmPass] = useState(false)
  const [сonfirmTaskCode, setConfirmTaskCode] = useState("")
  const [confirmYear, setConfirmYear] = useState(0)
  const [confirmReportCode, setConfirmReportCode] = useState<
    string | null | undefined
  >("")

  const [banners, setBanners] = useState<InfoBannerLinked[] | null | undefined>(
    null
  )

  useEffect(() => {
    const getBanners = async () => {
      try {
        dispatch(fetchBanners())
      } catch (error) {}
    }
    getBanners()
  }, [dispatch])

  const { loading, loaded: loadedSources } = useSelector(
    (state: RootState) => state.sources
  )

  const { loading: tasksLoading, loaded: loadedTasks } = useSelector(
    (state: RootState) => state.tasks
  )

  const [isTasksLoaded, setIsTasksLoaded] = useState(false)

  const [isSourcesLoaded, setIsSourcesLoaded] = useState(false)
  useEffect(() => {
    const fetchSources = async () => {
      try {
        if (
          tasksLoading !== undefined &&
          tasksLoading !== "loading" &&
          !isTasksLoaded
        ) {
          dispatch(fetchTasks())
        }
        setIsTasksLoaded(true)
      } catch (error) {
        errorTasks()
      }
      if (loading !== undefined && loading !== "loading" && !isSourcesLoaded)
        dispatch(fetchSourcesInfo())
      setIsSourcesLoaded(true)
      try {
        const linkedBanners = fetchedBanners?.map((item) => {
          const regex = /(\{link:[^\}]+\})/g
          const parts = item.description.split(regex)
          return { ...item, description: parts }
        })

        setBanners(linkedBanners)
      } catch (error) {
        console.log("Ошибка даты")
      }
    }
    fetchSources()
  }, [fetchedBanners, loading, isSourcesLoaded, loadedTasks, isTasksLoaded])

  const [taskYear, setTaskYear] = useState(2020)

  const [isForming, setIsForming] = useState(false)
  const [tasCodeForming, setTaskCodeForming] = useState("")
  const [yearForming, setYearForming] = useState<number | null>(null)
  const [formedSuccess, setFormedSucces] = useState([
    { task_code: "", year: 0 },
  ])
  const navigate = useNavigate()
  const handleFormReport = async (task_code: string, year: number) => {
    setIsForming(true)
    setTaskCodeForming(task_code)
    setYearForming(year)
    try {
      const data = {
        report_type: task_code === "ZDP" ? 3 : 2,
        period_type:
          task_code === "ZDP"
            ? 0
            : task_code === "UV1"
            ? 1
            : task_code === "UV2"
            ? 2
            : 3,
        period_year: year,
      }
      await api.reports.generateReportsReportsPost(data, { headers })
      setIsForming(false)
      setFormedSucces([...formedSuccess, { task_code: task_code, year: year }])
      try {
        dispatch(fetchTasks())
      } catch (error) {
        errorTasks()

        if ((error as ApiError).status === 422) {
          logout(), clearAll(), navigate("/login")
        }
      }
    } catch (error) {
      setIsForming(false)
      errorReport()
    }
  }

  const downloadXmlReport = async (
    report_code: string,
    title: string,
    report_date: string
  ) => {
    try {
      const response =
        await api.reports.getReportByIdReportsReportIdReportFormatGet(
          report_code,
          ReportFormat.Xml,
          { headers }
        )

      const blob = await response.blob()
      const downloadLink = document.createElement("a")

      downloadLink.href = window.URL.createObjectURL(blob)

      downloadLink.download = `${title} от ${report_date}.xml`
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
      successDownload()
    } catch (error) {
      console.error("Error during API call:", error)
      errorDownload()
      if ((error as ApiError).status === 422) {
        logout(), clearAll(), navigate("/login")
      }
    }
  }

  const downloadPdfReport = async (
    report_code: string,
    title: string,
    report_date: string
  ) => {
    try {
      const response =
        await api.reports.getReportByIdReportsReportIdReportFormatGet(
          report_code,
          ReportFormat.Pdf,
          { headers }
        )

      const blob = await response.blob()
      const downloadLink = document.createElement("a")

      downloadLink.href = window.URL.createObjectURL(blob)
      downloadLink.download = `${title} от ${report_date}.pdf`
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
      successDownload()
    } catch (error) {
      console.error("Error during API call:", error)
      errorDownload()
      if ((error as ApiError).status === 422) {
        logout(), clearAll(), navigate("/login")
      }
    }
  }

  const handleSentReport = async (
    task_code: string,
    period_year: number,
    report_code?: string | null
  ) => {
    setConfirmTaskCode(task_code)
    setConfirmYear(period_year)
    setConfirmReportCode(report_code)
    setIsConfirmPass(true)
  }

  const handleSentPayment = (amount: string, year: number) => {
    dispatch(setAmount({ amount, index: 0 }))
    setTaskYear(year)
    setDueAmount(parseFloat(amount))
    setPaymentOpen(true)
  }

  const deleteBanner = async (id: string) => {
    try {
      await api.banners.updateUserBannerStateBannersPut(
        { banner_id: id },
        { headers }
      )
      const bannersResponse = await api.banners.getUserBannersBannersGet(
        {
          current_date: convertDateFormat(new Date().toLocaleDateString()),
        },
        {
          headers,
        }
      )
      const linkedBanners = bannersResponse.data.banners.map((item) => {
        const regex = /(\{link:[^\}]+\})/g
        const parts = item.description.split(regex)
        return { ...item, description: parts }
      })

      setBanners(linkedBanners)
    } catch (error) {
      if ((error as ApiError).status === 422) {
        logout(), clearAll(), navigate("/login")
      }
    }
  }

  const defaultAccount =
    sources && sources?.find((item) => item.is_main)?.sub_name

  const isMobile = useMediaQuery("(max-width: 1023px)")
  const isTablet = useMediaQuery("(max-width: 1439px)")
  const isMediumSize = useMediaQuery("(max-width: 1919px)")

  const compareDates = (date1: string, date2: string) => {
    const date1Obj = new Date(date1)
    const date2Obj = new Date(date1)
    const date3Obj = new Date(date2)
    date2Obj.setDate(date2Obj.getDate() - 10)

    return date3Obj >= date2Obj && date3Obj <= date1Obj ? 1 : 0
  }

  const getTooltipUsn = (
    accrued_kv: number,
    accrued_amount: number,
    paid_amount: number,
    due_amount: number,
    dueDate: string
  ) => {
    return (
      <div
        style={
          !isMobile
            ? { display: "flex", flexDirection: "column" }
            : { display: "flex", flexDirection: "column", width: "250px" }
        }
      >
        <Text
          style={{
            color: "#fff",
            fontSize: "14px",
            lineHeight: "20px",
            fontFamily: "Inter",
          }}
        >
          {CONTENT.TOOLTIP_USN_TEXT_ONE}
        </Text>
        <Text
          style={
            !isMobile
              ? {
                  color: "#fff",
                  fontSize: "14px",
                  lineHeight: "20px",
                  fontFamily: "Inter",
                  textWrap: "nowrap",
                }
              : {
                  color: "#fff",
                  fontSize: "14px",
                  lineHeight: "20px",
                  fontFamily: "Inter",
                }
          }
        >
          <Amount
            value={due_amount - (accrued_amount - accrued_kv - paid_amount)}
            className={styles["amount-tooltip"]}
          />
          {CONTENT.TOOLTIP_USN_TEXT_TWO + " "}
          {formatDateString(dueDate)}
        </Text>
        <Text
          style={
            !isMobile
              ? {
                  color: "#fff",
                  fontSize: "14px",
                  lineHeight: "20px",
                  fontFamily: "Inter",
                  textWrap: "nowrap",
                }
              : {
                  color: "#fff",
                  fontSize: "14px",
                  lineHeight: "20px",
                  fontFamily: "Inter",
                }
          }
        >
          <Amount
            value={accrued_amount - accrued_kv - paid_amount}
            className={styles["amount-tooltip"]}
          />
          {CONTENT.TOOLTIP_USN_TEXT_THREE}
        </Text>
      </div>
    )
  }

  const getTooltipReport = (
    accrued_amount?: number | null,
    accrued_amount_now?: number | null
  ) => {
    if (accrued_amount && accrued_amount_now)
      return (
        <div
          style={
            !isMobile
              ? { display: "flex", flexDirection: "column", width: "385px" }
              : { display: "flex", flexDirection: "column", width: "250px" }
          }
        >
          <Text
            style={
              !isMobile
                ? {
                    color: "#fff",
                    fontSize: "14px",
                    lineHeight: "20px",
                    fontFamily: "Inter",
                    textWrap: "nowrap",
                  }
                : {
                    color: "#fff",
                    fontSize: "14px",
                    lineHeight: "20px",
                    fontFamily: "Inter",
                  }
            }
          >
            {CONTENT.TOOLTIP_REPORT_TEXT_ONE}
            <Amount
              value={accrued_amount}
              className={styles["amount-tooltip"]}
            />
          </Text>
          <Text
            style={
              !isMobile
                ? {
                    color: "#fff",
                    fontSize: "14px",
                    lineHeight: "20px",
                    fontFamily: "Inter",
                    textWrap: "nowrap",
                  }
                : {
                    color: "#fff",
                    fontSize: "14px",
                    lineHeight: "20px",
                    fontFamily: "Inter",
                  }
            }
          >
            {CONTENT.TOOLTIP_REPORT_TEXT_TWO}
            <Amount
              value={accrued_amount_now}
              className={styles["amount-tooltip"]}
            />
          </Text>
          <Text
            style={{
              color: "#fff",
              fontSize: "14px",
              lineHeight: "20px",
              fontFamily: "Inter",
              marginTop: "20px",
            }}
          >
            {CONTENT.TOOLTIP_REPORT_TEXT_THREE}
          </Text>
        </div>
      )
    else return undefined
  }

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)

  const showNotifications = () => {
    setIsNotificationsOpen(true)
  }

  const [isButtonDisabled, setButtonDisabled] = useState(false)
  const [secondsRemaining, setSecondsRemaining] = useState(0)
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isButtonDisabled) {
      timer = setInterval(() => {
        if (secondsRemaining > 0) {
          setSecondsRemaining((prev) => prev - 1)
        } else {
          setButtonDisabled(false)
          clearInterval(timer)
        }
      }, 1000)
    }
    return () => {
      clearInterval(timer)
    }
  }, [isButtonDisabled, secondsRemaining])

  const startTimer = () => {
    setButtonDisabled(true)
    setSecondsRemaining(60)
  }

  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            Message: {
              contentBg: "#000000",
              colorText: "#fff",
            },
            Progress: {
              defaultColor: "#6159ff",
            },
          },
        }}
      >
        {contextHolder}
        <Content className={styles["content-wrapper"]}>
          <div className={styles["remark-wrapper"]}>
            <div className={styles["open-source-wrapper"]}>
              <Text className={styles["heading-text"]}>
                {CONTENT.ACTIONS_HEADING}
              </Text>
              {isMobile && (
                <Button
                  className={cn(
                    styles["source-link-title"],
                    styles["button-notifications"]
                  )}
                  onClick={
                    banners?.length && banners?.length > 0
                      ? showNotifications
                      : undefined
                  }
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {banners?.length && banners?.length > 0 ? (
                      <div className={styles["notifcations-inner"]}>
                        <HaveBannersIcon />
                        <div className={styles["notifications-count"]}></div>
                      </div>
                    ) : (
                      <HaveBannersIcon />
                    )}
                  </div>
                  {CONTENT.NOTIFICATIONS_TITLE}
                </Button>
              )}
            </div>
            <div className={styles["right-header-part"]}>
              {!isMediumSize && (
                <div className={styles["remark-text"]}>
                  <Text className={styles["remark-ens-text"]}>
                    {CONTENT.ENS_TEXT_DETAILS}
                  </Text>
                  <Link
                    className={styles["declaration-link-operations"]}
                    onClick={openAnalysis}
                  >
                    {CONTENT.TEXT_DETAILS}
                  </Link>
                </div>
              )}
              <div className={styles["buttons-header"]}>
                <ButtonOne
                  onClick={() => openEnsModal()}
                  className={styles["header-button-item"]}
                >
                  <PlusOutlined
                    className={styles["plus-icon"]}
                    style={{ marginInlineStart: "4px" }}
                  />
                  {CONTENT.BUTTON_ENS_TEXT}
                </ButtonOne>
                <ButtonOne
                  onClick={() => {
                    recalculation()
                  }}
                  type="secondary"
                  className={styles["header-button-item-update"]}
                  disabled={isButtonDisabled}
                >
                  {!isButtonDisabled ? (
                    <>
                      <ArrowRoundUpdateIcon /> {CONTENT.BUTTON_UPDATE_ACTIONS}
                    </>
                  ) : secondsRemaining > 58 ? (
                    <>
                      <Spin indicator={antIcon} />
                      <Text className={styles["button-updating"]}>
                        {CONTENT.BUTTON_IN_UDPATING}
                      </Text>
                    </>
                  ) : (
                    <>
                      {CONTENT.TIMER_START +
                        secondsRemaining +
                        CONTENT.TIMER_SEC}
                    </>
                  )}
                </ButtonOne>
              </div>
            </div>
          </div>
          {isMediumSize && (
            <div className={styles["remark-text-medium"]}>
              <Text className={styles["remark-ens-text"]}>
                {CONTENT.ENS_TEXT_DETAILS}
              </Text>
              <Link
                className={styles["declaration-link-operations"]}
                style={{ color: "#6159ff", whiteSpace: "nowrap" }}
                onClick={openAnalysis}
              >
                {CONTENT.TEXT_DETAILS}
              </Link>
            </div>
          )}
          <div>
            {tasks &&
              tasks
                .filter((item) => item.type !== TaskType.Other)
                .map((item, index) => (
                  <div className={styles["row-item"]} key={index}>
                    <div className={styles["row-inner"]}>
                      <div className={styles["left-part-row"]}>
                        {!isTablet && (
                          <div
                            className={cn(styles["icon-part"], {
                              [styles["alert-date"]]:
                                new Date() > new Date(item.due_date),
                              [styles["soon-icon"]]: compareDates(
                                item.due_date,
                                getCurrentDate()
                              ),
                            })}
                          >
                            {item.type === "report" ? (
                              <ActionsReportIcon
                                className={cn(styles["default-icon"], {
                                  [styles["alert-icon"]]:
                                    item.due_date <= getCurrentDate(),
                                  [styles["soon-icon"]]: compareDates(
                                    item.due_date,
                                    getCurrentDate()
                                  ),
                                })}
                              />
                            ) : item.type === "fixed_fees" ||
                              item.type === "usn" ||
                              item.type === "income_percentage" ? (
                              <ActionCurrencyIcon
                                className={cn(styles["default-icon"], {
                                  [styles["alert-icon"]]:
                                    item.due_date <= getCurrentDate(),
                                  [styles["soon-icon"]]: compareDates(
                                    item.due_date,
                                    getCurrentDate()
                                  ),
                                })}
                              />
                            ) : null}
                          </div>
                        )}
                        <div className={styles["info-part"]}>
                          <div className={styles["info-title"]}>
                            <div className={styles["date-title-overdue"]}>
                              {isTablet && (
                                <div
                                  className={cn(styles["icon-part"], {
                                    [styles["alert-date"]]:
                                      new Date() > new Date(item.due_date),
                                    [styles["soon-icon"]]: compareDates(
                                      item.due_date,
                                      getCurrentDate()
                                    ),
                                  })}
                                >
                                  {item.type === "report" ? (
                                    <ActionsReportIcon
                                      className={cn(styles["default-icon"], {
                                        [styles["alert-icon"]]:
                                          item.due_date <= getCurrentDate(),
                                        [styles["soon-icon"]]: compareDates(
                                          item.due_date,
                                          getCurrentDate()
                                        ),
                                      })}
                                    />
                                  ) : item.type === "fixed_fees" ||
                                    item.type === "usn" ||
                                    item.type === "income_percentage" ? (
                                    <ActionCurrencyIcon
                                      className={cn(styles["default-icon"], {
                                        [styles["alert-icon"]]:
                                          item.due_date <= getCurrentDate(),
                                        [styles["soon-icon"]]: compareDates(
                                          item.due_date,
                                          getCurrentDate()
                                        ),
                                      })}
                                    />
                                  ) : null}
                                </div>
                              )}
                              {new Date() > new Date(item.due_date) ? (
                                <div className={styles["warning-overdue"]}>
                                  <Text
                                    className={cn(styles["text-date"], [
                                      styles["alert-date"],
                                    ])}
                                  >
                                    {CONTENT.OVERDUE_WARNING}
                                  </Text>
                                </div>
                              ) : compareDates(
                                  item.due_date,
                                  getCurrentDate()
                                ) ? (
                                <div className={styles["soon-overdue"]}>
                                  <Text
                                    className={cn(styles["text-date"], [
                                      styles["soon-date"],
                                    ])}
                                  >
                                    {CONTENT.SOON_WARNING}
                                  </Text>
                                </div>
                              ) : null}
                              <Text
                                className={cn(styles["text-date"], {
                                  [styles["alert-date-text"]]:
                                    new Date() > new Date(item.due_date),
                                  [styles["soon-date"]]: compareDates(
                                    item.due_date,
                                    getCurrentDate()
                                  ),
                                })}
                              >
                                {"до " + formatToPayDate(item.due_date)}
                              </Text>
                            </div>
                            <Text className={styles["card-title"]}>
                              {item.title}
                            </Text>
                          </div>
                          <Text className={styles["text-description"]}>
                            {item.description}
                          </Text>
                        </div>
                      </div>
                      <div className={styles["amount-part"]}>
                        <div className={styles["amount-info"]}>
                          {item.type !== "report" && item.due_amount ? (
                            <>
                              <div className={styles["amount-pay"]}>
                                <Text className={styles["amount-heading"]}>
                                  {CONTENT.TEXT_AMOUNT_ALREADY_PAID}
                                </Text>
                                <Text className={styles["amount-paid-text"]}>
                                  {item.paid_amount ||
                                  (item.paid_amount === 0 &&
                                    item.paid_amount !== undefined) ? (
                                    <Amount
                                      value={item.paid_amount}
                                      withDecimal
                                      decimalStyle="translucent"
                                      className={styles["amount-paid-text"]}
                                    />
                                  ) : null}
                                  {" из "}
                                  {item.accrued_amount && (
                                    <Amount
                                      value={item.accrued_amount}
                                      withDecimal
                                      decimalStyle="translucent"
                                      className={styles["amount-paid-text"]}
                                    />
                                  )}
                                </Text>
                              </div>

                              {item.accrued_amount && (
                                <Progress
                                  percent={
                                    item.paid_amount &&
                                    (item.paid_amount / item.accrued_amount) *
                                      100 >
                                      3
                                      ? (item.paid_amount /
                                          item.accrued_amount) *
                                        100
                                      : 3
                                  }
                                  showInfo={false}
                                  strokeColor={
                                    item.due_date <= getCurrentDate()
                                      ? "#CF133C"
                                      : compareDates(
                                          item.due_date,
                                          getCurrentDate()
                                        )
                                      ? "#FF8D00"
                                      : "#6159FF"
                                  }
                                />
                              )}
                              <div className={styles["amount-pay"]}>
                                <Text className={styles["amount-heading"]}>
                                  {CONTENT.TEXT_AMOUNT_TO_PAY}
                                </Text>
                                <div className={styles["tooltip-amount"]}>
                                  {item.due_amount ? (
                                    <>
                                      {item.accrued_amount_kv &&
                                        item.accrued_amount &&
                                        item.accrued_amount_kv <
                                          item.accrued_amount && (
                                          <Tooltip
                                            title={() =>
                                              item.accrued_amount_kv &&
                                              item.accrued_amount &&
                                              item.paid_amount &&
                                              item.due_amount
                                                ? getTooltipUsn(
                                                    item.accrued_amount_kv,
                                                    item.accrued_amount,
                                                    item.paid_amount,
                                                    item.due_amount,
                                                    item.due_date
                                                  )
                                                : null
                                            }
                                            placement={
                                              !isMobile ? "topRight" : undefined
                                            }
                                            arrow={{ pointAtCenter: true }}
                                            overlayInnerStyle={
                                              !isMobile
                                                ? {
                                                    width: "fit-content",
                                                  }
                                                : undefined
                                            }
                                            className="tooltip-custom"
                                          >
                                            <InfoCircleOutlined
                                              className={
                                                styles["info-icon-amount"]
                                              }
                                            />
                                          </Tooltip>
                                        )}
                                      <Text
                                        className={styles["amount-to-pay-text"]}
                                      >
                                        <Amount
                                          value={item.due_amount}
                                          withDecimal
                                          className={
                                            styles["amount-to-pay-text"]
                                          }
                                        />
                                      </Text>
                                    </>
                                  ) : null}
                                </div>
                              </div>
                            </>
                          ) : (
                            item.type === "report" && (
                              <>
                                <div className={styles["amount-pay"]}>
                                  <Text
                                    className={styles["amount-heading-quarter"]}
                                  >
                                    {taxesQuarterHeading(
                                      item.task_code,
                                      item.year
                                    )}
                                  </Text>
                                  {item.type === "report" && (
                                    <div
                                      style={{ display: "flex", gap: "6px" }}
                                    >
                                      {item.accrued_amount_now !== null &&
                                        item.accrued_amount_now !=
                                          item.accrued_amount && (
                                          <Tooltip
                                            title={() =>
                                              getTooltipReport(
                                                item.accrued_amount,
                                                item.accrued_amount_now
                                              )
                                            }
                                            overlayInnerStyle={
                                              !isMobile
                                                ? {
                                                    width: "fit-content",
                                                  }
                                                : undefined
                                            }
                                            placement={
                                              !isMobile ? "topRight" : undefined
                                            }
                                            className="tooltip-custom"
                                            arrow={{ pointAtCenter: true }}
                                          >
                                            <InfoCircleOutlined
                                              className={
                                                styles["report-icon-amount"]
                                              }
                                            />
                                          </Tooltip>
                                        )}
                                      <Text
                                        className={styles["amount-to-pay-text"]}
                                      >
                                        {(item.accrued_amount ||
                                          item.accrued_amount === 0.0) && (
                                          <Amount
                                            value={item.accrued_amount}
                                            withDecimal
                                            className={
                                              styles["amount-to-pay-text"]
                                            }
                                          />
                                        )}
                                      </Text>
                                    </div>
                                  )}
                                </div>
                                {(!item.report_update ||
                                  (!formedSuccess.includes({
                                    task_code: item.task_code,
                                    year: item.year,
                                  }) &&
                                    !item.report_update)) && (
                                  <div
                                    className={styles["declaration-wrapper"]}
                                  >
                                    <Text
                                      className={styles["declaration-text"]}
                                    >
                                      {CONTENT.TEXT_DECLARATION}
                                    </Text>
                                    <Link
                                      className={
                                        styles["declaration-link-operations"]
                                      }
                                      onClick={() => navigate("/taxes")}
                                    >
                                      {CONTENT.OPERATIONS_LINK}
                                    </Link>
                                    {/* <Tooltip title={CONTENT.DECLARATION_TOOLTIP}>
                                <InfoCircleOutlined
                                  className={styles["sider-icon"]}
                                  size={24}
                                />
                              </Tooltip>*/}
                                  </div>
                                )}
                              </>
                            )
                          )}
                        </div>
                        {((item.type === "report" &&
                          item.report_code &&
                          item.report_update) ||
                          formedSuccess.includes({
                            task_code: item.task_code,
                            year: item.year,
                          })) && (
                          <div className={styles["amount-pay"]}>
                            <div className={styles["formed-date"]}>
                              {formedSuccess.includes({
                                task_code: item.task_code,
                                year: item.year,
                              }) ? (
                                <Text
                                  className={styles["amount-heading-formed"]}
                                >
                                  {CONTENT.TITLE_FORMED +
                                    formatDateString("", true)}
                                </Text>
                              ) : (
                                item.report_update && (
                                  <Text
                                    className={styles["amount-heading-formed"]}
                                  >
                                    {CONTENT.TITLE_FORMED +
                                      formatDateString(
                                        item.report_update,
                                        true
                                      )}
                                  </Text>
                                )
                              )}
                            </div>
                            <Button
                              className={styles["paid-button"]}
                              onClick={() =>
                                handleFormReport(item.task_code, item.year)
                              }
                              disabled={
                                isForming &&
                                item.task_code === tasCodeForming &&
                                item.year === yearForming
                              }
                            >
                              {isForming &&
                              item.task_code === tasCodeForming &&
                              item.year === yearForming ? (
                                <Spin indicator={updateIcon} />
                              ) : (
                                <ArrowCounterIcon
                                  className={styles["hide-icon"]}
                                />
                              )}

                              {CONTENT.BUTTON_UPDATE}
                            </Button>
                          </div>
                        )}
                        <div className={styles["row-item-buttons"]}>
                          {(item.type === "report" && item.report_code) ||
                          formedSuccess.includes({
                            task_code: item.task_code,
                            year: item.year,
                          }) ? (
                            <div className={styles["row-item-buttons-wrapper"]}>
                              <ButtonOne
                                className={styles["download-button"]}
                                type="secondary"
                                onClick={() =>
                                  item.report_code &&
                                  downloadXmlReport(
                                    item.report_code,
                                    item.title,
                                    formatDateString(item.report_update)
                                  )
                                }
                              >
                                <DownloadOutlined />
                                <Text className={styles["xml-pdf-button"]}>
                                  {"xml"}
                                </Text>
                              </ButtonOne>
                              <ButtonOne
                                className={styles["download-button"]}
                                type="secondary"
                                onClick={() =>
                                  item.report_code &&
                                  downloadPdfReport(
                                    item.report_code,
                                    item.title,
                                    formatDateString(item.report_update)
                                  )
                                }
                              >
                                <DownloadOutlined />
                                <Text className={styles["xml-pdf-button"]}>
                                  {"pdf"}
                                </Text>
                              </ButtonOne>
                            </div>
                          ) : (
                            <ButtonOne
                              className={styles["amount-button"]}
                              type="secondary"
                              onClick={() =>
                                item.type === "report"
                                  ? handleFormReport(item.task_code, item.year)
                                  : openEnsModal(item.due_amount)
                              }
                            >
                              {item.type === "fixed_fees" ||
                              item.type === "usn" ||
                              item.type === "income_percentage" ? (
                                CONTENT.BUTTON_TO_PAY
                              ) : item.type === "report" ? (
                                isForming &&
                                item.task_code === tasCodeForming &&
                                item.year === yearForming ? (
                                  <Spin indicator={antIcon} />
                                ) : (
                                  CONTENT.BUTTON_FORM
                                )
                              ) : (
                                ""
                              )}
                            </ButtonOne>
                          )}
                          <Button
                            className={styles["paid-button"]}
                            onClick={() =>
                              item.type === "report"
                                ? handleSentReport(
                                    item.task_code,
                                    item.year,
                                    item.report_code
                                  )
                                : item.due_amount &&
                                  handleSentPayment(
                                    item.due_amount.toString(),
                                    item.year
                                  )
                            }
                          >
                            <HideEyeIcon className={styles["hide-icon"]} />
                            {item.type === "report"
                              ? CONTENT.BUTTON_PASSED
                              : CONTENT.BUTTON_PAID}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
          {tasks && tasks.length === 0 && isRelevant === false && (
            <div className={styles["block-new"]}>
              <NewActionsImage />
              <div className={styles["block-new-text"]}>
                <Text className={styles["title-block"]}>
                  {CONTENT.TITLE_NEW_ACTIONS}
                </Text>
                <Text className={styles["text-block"]}>
                  {CONTENT.DESCRIPTION_NEW_ACTIONS_ONE}
                </Text>
                <Text className={styles["text-block"]}>
                  {CONTENT.DESCRIPTION_NEW_ACTIONS_TWO}
                </Text>
                <Link
                  className={styles["link-block"]}
                  onClick={() => navigate("/taxes")}
                >
                  {CONTENT.OPERATIONS_LINK}
                </Link>
              </div>
            </div>
          )}
          {(tasks?.filter((item) => item.type === "report").length === 0 ||
            !tasks) &&
            tasksLoaded === "succeeded" &&
            isRelevant === true && <AllDoneBlock type="report" />}
          {(tasks?.filter((item) => item.type !== "report").length === 0 ||
            !tasks) &&
            tasksLoaded === "succeeded" &&
            isRelevant === true && <AllDoneBlock type="usn" />}
        </Content>
        {!isMobile && (
          <Sider
            className={styles["right-sider-wrapper"]}
            width={320}
            breakpoint="lg"
            collapsedWidth="0"
          >
            <div className={styles["sider-inner-wrapper"]}>
              {banners?.map((item) => {
                return (
                  <div className={styles["update-wrapper"]}>
                    <div className={styles["update-inner"]}>
                      <div className={styles["update-text-inner"]}>
                        <BellBannerIcon />
                        <Text
                          style={{
                            maxWidth: "200px",
                          }}
                          className={styles["banner-title"]}
                        >
                          {item.title}
                        </Text>
                        {item.description.map((text) => {
                          if (text.startsWith("{") && text.endsWith("}")) {
                            const link = text.slice("{link:".length, -1)
                            return (
                              <Link
                                className={styles["update-text-link"]}
                                onClick={() => navigate(link)}
                              >
                                {LINK_MAP[link]}
                              </Link>
                            )
                          } else
                            return (
                              <Text className={styles["update-text"]}>
                                {text}
                              </Text>
                            )
                        })}
                      </div>
                      <Button
                        className={styles["delete-banner"]}
                        style={{ border: "none", boxShadow: "none" }}
                        onClick={() => deleteBanner(item.id)}
                      >
                        <CloseOutlined />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </Sider>
        )}
        <ConfirmPassModal
          isOpen={isConfirmPass}
          setOpen={setIsConfirmPass}
          task_code={сonfirmTaskCode}
          year={confirmYear}
          report_code={confirmReportCode}
        />
        <PaymentModal
          isOpen={isPaymentOpen}
          setOpen={setPaymentOpen}
          payAmount={dueAmount}
          fetchTasks={fetchTasksModal}
          taskYear={taskYear}
          openAnalysis={openAnalysis}
        />
        <EnsPaymentModal
          isOpen={isEnsOpen}
          setOpen={setEnsOpen}
          payAmount={dueAmount}
          setDueAmount={setDueAmount}
          defaultAccount={defaultAccount}
          openAnalysis={openAnalysis}
        />
        <AnalysisEnsModal isOpen={isAnalysisOpen} setOpen={setAnalysisOpen} />
        <NotificationsModal
          isOpen={isNotificationsOpen}
          setOpen={setIsNotificationsOpen}
        />
      </ConfigProvider>
    </>
  )
}
