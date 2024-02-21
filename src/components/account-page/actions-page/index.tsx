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
import LampImage from "./images/lamp"
import cn from "classnames"
import { useEffect, useState } from "react"
import { PaymentModal } from "./payment-modal"
import { useDispatch } from "react-redux"
import {
  BannerType,
  InfoBanner,
  ReportFormat,
  SourcesInfo,
  TaskResponse,
  api,
} from "../../../api/myApi"
import { AppDispatch } from "../../main-page/store"
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
import {
  convertDateFormat,
  convertReverseFormat,
  getCurrentDate,
} from "./payment-modal/utils"

export interface InfoBannerLinked {
  id: string

  banner_type: BannerType

  begin_date?: string | null

  end_date?: string | null

  title: string

  description: string[]

  show_for_user: boolean
}

export const ActionsPage = () => {
  const [isPaymentOpen, setPaymentOpen] = useState(false)
  const [isEnsOpen, setEnsOpen] = useState(false)
  const [isAnalysisOpen, setAnalysisOpen] = useState(false)

  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 24,
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

  const [sources, setSources] = useState<SourcesInfo | undefined>(undefined)
  const [tasks, setTasks] = useState<TaskResponse | undefined>(undefined)

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

  const [banners, setBanners] = useState<InfoBannerLinked[] | null>(null)
  const dispatch = useDispatch<AppDispatch>()
  useEffect(() => {
    const fetchSources = async () => {
      try {
        const tasksResponse = await api.tasks.getTasksTasksGet({ headers })
        setTasks(tasksResponse.data)
      } catch (error) {
        errorTasks()
      }
      const sourcesResponse = await api.sources.getSourcesInfoSourcesGet({
        headers,
      })
      setSources(sourcesResponse.data)
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
    }
    fetchSources()
  }, [])

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
        const tasksResponse = await api.tasks.getTasksTasksGet({ headers })
        setTasks(tasksResponse.data)
      } catch (error) {
        errorTasks()
      }
    } catch (error) {
      setIsForming(false)
      errorReport()
    }
  }

  const downloadXmlReport = async (report_code: string) => {
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
      downloadLink.download = "Новый_отчет.xml"
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
      successDownload()
    } catch (error) {
      console.error("Error during API call:", error)
      errorDownload()
    }
  }

  const downloadPdfReport = async (report_code: string) => {
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
      downloadLink.download = "Новый_отчет.pdf"
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
      successDownload()
    } catch (error) {
      console.error("Error during API call:", error)
      errorDownload()
    }
  }

  const handleSentReport = async (
    task_code: string,
    period_year: number,
    report_code?: string | null
  ) => {
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
      period_year: period_year,
      report_code: report_code ? report_code : undefined,
      report_status: 4,
    }
    await api.tasks.updateReportStatusTasksStatusPut(data, { headers })
    try {
      const tasksResponse = await api.tasks.getTasksTasksGet({ headers })
      setTasks(tasksResponse.data)
    } catch (error) {
      errorTasks()
    }
  }

  const handleSentPayment = (amount: string) => {
    dispatch(setAmount({ amount, index: 0 }))
    setPaymentOpen(true)
  }

  const deleteBanner = async (id: string) => {
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
          <Title level={2} className={styles["heading-text"]}>
            {CONTENT.ACTIONS_HEADING}
          </Title>
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
              tasks.tasks.map((item, index) => (
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
                                    ? (item.paid_amount / item.accrued_amount) *
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
                                <Text className={styles["amount-to-pay-text"]}>
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
                            <Text className={styles["amount-to-pay-text"]}>
                              {item.accrued_amount &&
                                new Intl.NumberFormat("ru", {
                                  style: "currency",
                                  currency: "RUB",
                                }).format(item.accrued_amount)}
                            </Text>
                          </div>
                        )}
                      </div>
                      <div className={styles["row-item-buttons"]}>
                        {(item.type === "report" && item.report_code) ||
                        formedSuccess.includes(item.task_code) ? (
                          <div className={styles["row-item-buttons"]}>
                            <Button
                              className={styles["download-button"]}
                              onClick={() =>
                                item.report_code &&
                                downloadXmlReport(item.report_code)
                              }
                            >
                              <Text>{".xml"}</Text>
                              <DownloadOutlined />
                            </Button>
                            <Button
                              className={styles["download-button"]}
                              onClick={() =>
                                item.report_code &&
                                downloadPdfReport(item.report_code)
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
                              isForming && item.task_code === tasCodeForming ? (
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
                                handleSentPayment(item.due_amount.toString())
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
                              {CONTENT.TITLE_FORMED + formatDateString("")}
                            </Text>
                          ) : (
                            item.report_update && (
                              <Text className={styles["amount-heading"]}>
                                {CONTENT.TITLE_FORMED +
                                  formatDateString(item.report_update)}
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
          {tasks?.tasks.length == 0 && <AllDoneBlock type="report" />}
        </Content>
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

            {/* <div className={styles["update-wrapper"]}>
              <div className={styles["update-inner"]}>
                <div className={styles["update-text-inner"]}>
                  <LampImage />
                  <Title
                    style={{ marginBottom: 0, marginTop: "8px" }}
                    level={5}
                  >
                    {CONTENT.UPDATE_DATA_HEADING}
                  </Title>
                </div>
                <div className={styles["update-text-inner"]}>
                  <Text className={styles["update-text"]}>
                    {CONTENT.UPDATE_DATA_TEXT}
                  </Text>
                  <Text className={styles["update-taxes-link"]}>
                    {CONTENT.UPDATE_TAXES_LINK}
                  </Text>
                </div>
                <Button
                  className={styles["delete-banner"]}
                  style={{ border: "none", boxShadow: "none" }}
                  onClick={() => {}}
                >
                  <CloseOutlined />
                </Button>
              </div>
            </div>*/}
          </div>
        </Sider>
        <PaymentModal
          isOpen={isPaymentOpen}
          setOpen={setPaymentOpen}
          payAmount={dueAmount}
        />
        <EnsPaymentModal
          isOpen={isEnsOpen}
          setOpen={setEnsOpen}
          payAmount={dueAmount}
          setDueAmount={setDueAmount}
        />
        <AnalysisEnsModal isOpen={isAnalysisOpen} setOpen={setAnalysisOpen} />
      </ConfigProvider>
    </>
  )
}
