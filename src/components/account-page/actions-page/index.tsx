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

export interface InfoBannerLinked {
  id: string

  banner_type: BannerType

  begin_date?: string | null

  end_date?: string | null

  title: string

  description: string[]
}

export const ActionsPage = () => {
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
    const fetchSources = async () => {
      try {
        dispatch(fetchTasks())
        setIsTasksLoaded(true)
      } catch (error) {
        errorTasks()
      }

      dispatch(fetchSourcesInfo())
      try {
        await dispatch(fetchBanners())
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
  }, [])

  const [taskYear, setTaskYear] = useState(2020)

  const [isForming, setIsForming] = useState(false)
  const [tasCodeForming, setTaskCodeForming] = useState("")
  const [formedSuccess, setFormedSucces] = useState([""])
  const navigate = useNavigate()
  const handleFormReport = async (task_code: string, year: number) => {
    setIsForming(true)
    setTaskCodeForming(task_code)
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
      setFormedSucces([...formedSuccess, task_code])
      try {
        dispatch(fetchTasks())
      } catch (error) {
        errorTasks()

        if ((error as ApiError).status === 422) {
          logout(), dispatch(clearData()), navigate("/login")
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
        logout(), dispatch(clearData()), navigate("/login")
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
        logout(), dispatch(clearData()), navigate("/login")
      }
    }
  }

  const [isTasksLoaded, setIsTasksLoaded] = useState(false)

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
        logout(), dispatch(clearData()), navigate("/login")
      }
    }
  }

  const defaultAccount =
    sources && sources?.find((item) => item.is_main)?.sub_name

  const isMobile = useMediaQuery("(max-width: 767px)")

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
          <Text className={styles["heading-text"]}>
            {CONTENT.ACTIONS_HEADING}
          </Text>
          <div className={styles["remark-wrapper"]}>
            <Button
              className={styles["remark-button"]}
              onClick={() => openEnsModal()}
            >
              {CONTENT.BUTTON_ENS_TEXT}
            </Button>
            <div className={styles["remark-text"]}>
              <Text>{CONTENT.ENS_TEXT_DETAILS}</Text>
              <Link
                className={styles["link-details"]}
                style={{ color: "#6159ff", whiteSpace: "nowrap" }}
                onClick={openAnalysis}
              >
                {CONTENT.TEXT_DETAILS}
              </Link>
            </div>
          </div>
          <div>
            {tasks &&
              tasks
                .filter((item) => item.type !== TaskType.Other)
                .map((item, index) => (
                  <div className={styles["row-item"]} key={index}>
                    <div className={styles["row-inner"]}>
                      <div className={styles["info-part"]}>
                        <div className={styles["info-title"]}>
                          <div className={styles["date-title-overdue"]}>
                            <Text
                              className={cn(styles["text-date"], {
                                [styles["alert-date"]]:
                                  new Date() > new Date(item.due_date),
                              })}
                            >
                              {"до " + formatToPayDate(item.due_date)}
                            </Text>
                            {new Date() > new Date(item.due_date) && (
                              <div className={styles["warning-overdue"]}>
                                <Text
                                  className={cn(styles["text-date"], [
                                    styles["alert-date"],
                                  ])}
                                >
                                  {CONTENT.OVERDUE_WARNING}
                                </Text>
                              </div>
                            )}
                          </div>
                          <Title level={4} style={{ margin: 0 }}>
                            {item.title}
                          </Title>
                        </div>
                        <Text className={styles["text-description"]}>
                          {item.description}
                        </Text>
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
                                  {item.paid_amount &&
                                    new Intl.NumberFormat("ru", {
                                      style: "currency",
                                      currency: "RUB",
                                    }).format(item.paid_amount)}
                                  {" из "}
                                  {item.accrued_amount &&
                                    new Intl.NumberFormat("ru", {
                                      style: "currency",
                                      currency: "RUB",
                                    }).format(item.accrued_amount)}
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
                                  status={
                                    item.due_date <= getCurrentDate()
                                      ? "exception"
                                      : undefined
                                  }
                                />
                              )}
                              <div className={styles["amount-pay"]}>
                                <Text className={styles["amount-heading"]}>
                                  {CONTENT.TEXT_AMOUNT_TO_PAY}
                                </Text>
                                {item.due_amount && (
                                  <Text
                                    className={styles["amount-to-pay-text"]}
                                  >
                                    {new Intl.NumberFormat("ru", {
                                      style: "currency",
                                      currency: "RUB",
                                    }).format(item.due_amount)}
                                  </Text>
                                )}
                              </div>
                            </>
                          ) : item.task_code === "ZDP" && !item.report_code ? (
                            <div className={styles["declaration-wrapper"]}>
                              <Text className={styles["declaration-text"]}>
                                {CONTENT.TEXT_DECLARATION}
                              </Text>
                              <Tooltip title={CONTENT.DECLARATION_TOOLTIP}>
                                <InfoCircleOutlined
                                  className={styles["sider-icon"]}
                                  size={24}
                                />
                              </Tooltip>
                            </div>
                          ) : (
                            <div className={styles["amount-pay"]}>
                              <Text className={styles["amount-heading"]}>
                                {taxesQuarterHeading(item.task_code)}
                              </Text>
                              {item.type === "report" &&
                                item.task_code !== "ZDP" && (
                                  <Text
                                    className={styles["amount-to-pay-text"]}
                                  >
                                    {(item.accrued_amount ||
                                      item.accrued_amount === 0.0) &&
                                      new Intl.NumberFormat("ru", {
                                        style: "currency",
                                        currency: "RUB",
                                      }).format(item.accrued_amount)}
                                  </Text>
                                )}
                            </div>
                          )}
                        </div>
                        <div className={styles["row-item-buttons"]}>
                          {(item.type === "report" && item.report_code) ||
                          formedSuccess.includes(item.task_code) ? (
                            <div className={styles["row-item-buttons-wrapper"]}>
                              <Button
                                className={styles["download-button"]}
                                onClick={() =>
                                  item.report_code &&
                                  downloadXmlReport(
                                    item.report_code,
                                    item.title,
                                    formatDateString(item.report_update)
                                  )
                                }
                              >
                                <Text>{".xml"}</Text>
                                <DownloadOutlined />
                              </Button>
                              <Button
                                className={styles["download-button"]}
                                onClick={() =>
                                  item.report_code &&
                                  downloadPdfReport(
                                    item.report_code,
                                    item.title,
                                    formatDateString(item.report_update)
                                  )
                                }
                              >
                                <Text>{".pdf"}</Text>
                                <DownloadOutlined />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              className={styles["amount-button"]}
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
                                item.task_code === tasCodeForming ? (
                                  <Spin indicator={antIcon} />
                                ) : (
                                  CONTENT.BUTTON_FORM
                                )
                              ) : (
                                ""
                              )}
                            </Button>
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
                            {item.type === "report"
                              ? CONTENT.BUTTON_PASSED
                              : CONTENT.BUTTON_PAID}
                          </Button>
                        </div>
                        {((item.type === "report" &&
                          item.report_code &&
                          item.report_update) ||
                          formedSuccess.includes(item.task_code)) && (
                          <div className={styles["amount-pay"]}>
                            {formedSuccess.includes(item.task_code) ? (
                              <Text className={styles["amount-heading"]}>
                                {CONTENT.TITLE_FORMED +
                                  formatDateString("", true)}
                              </Text>
                            ) : (
                              item.report_update && (
                                <Text className={styles["amount-heading"]}>
                                  {CONTENT.TITLE_FORMED +
                                    formatDateString(item.report_update, true)}
                                </Text>
                              )
                            )}
                            <Link
                              className={styles["link-details"]}
                              underline
                              onClick={() =>
                                handleFormReport(item.task_code, item.year)
                              }
                            >
                              {CONTENT.BUTTON_UPDATE}
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
          </div>
          {(tasks?.filter((item) => item.type === "report").length === 0 ||
            !tasks) &&
            tasksLoaded === "succeeded" && <AllDoneBlock type="report" />}
          {(tasks?.filter((item) => item.type !== "report").length === 0 ||
            !tasks) &&
            tasksLoaded === "succeeded" && <AllDoneBlock type="usn" />}
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
                        <div>
                          <Title
                            style={{
                              marginBottom: 0,
                              marginTop: "8px",
                              maxWidth: "200px",
                            }}
                            level={5}
                          >
                            {item.title}
                          </Title>
                          {item.description.map((text) => {
                            if (text.startsWith("{") && text.endsWith("}")) {
                              const link = text.slice("{link:".length, -1)
                              return (
                                <Link
                                  className={styles["update-text"]}
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
        />
        <EnsPaymentModal
          isOpen={isEnsOpen}
          setOpen={setEnsOpen}
          payAmount={dueAmount}
          setDueAmount={setDueAmount}
          defaultAccount={defaultAccount}
        />
        <AnalysisEnsModal isOpen={isAnalysisOpen} setOpen={setAnalysisOpen} />
      </ConfigProvider>
    </>
  )
}
