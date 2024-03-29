import {
  Button,
  DatePicker,
  Form,
  Modal,
  Select,
  Typography,
  message,
} from "antd"
import { DownloadKudirModalProps } from "./types"
import styles from "./styles.module.scss"
import { KudirFormat, api } from "../../../../api/myApi"
import Cookies from "js-cookie"
import { CONTENT } from "./constants"
import { useEffect, useState } from "react"
import locale from "antd/lib/date-picker/locale/ru_RU"
import dayjs from "dayjs"
import "dayjs/locale/ru"
import {
  convertDateFormat,
  convertReverseFormat,
  getCurrentDate,
} from "../../actions-page/payment-modal/utils"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../../main-page/store"
import { fetchSourcesInfo } from "../../client/sources/thunks"
import cn from "classnames"
import { formatDateString } from "../../actions-page/utils"
import { fetchCurrentUser } from "../../../authorization-page/slice"

export const DownloadKudirModal = ({
  isOpen,
  setOpen,
}: DownloadKudirModalProps) => {
  const { Title, Text } = Typography
  const token = Cookies.get("token")
  const headers = {
    Authorization: `Bearer ${token}`,
  }

  dayjs.locale("ru")
  const dateFormat = "DD.MM.YYYY"

  const dispatch = useDispatch<AppDispatch>()

  const [messageApi, contextHolder] = message.useMessage()
  const successDownload = () => {
    messageApi.open({
      type: "success",
      content: CONTENT.NOTIFICATION_DOWNLOAD_SUCCESS,
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

  const [isButtonDisabled, setIsButtonDisabled] = useState(true)

  const user = useSelector((state: RootState) => state.user)
  const year = new Date().getFullYear()

  const yearsOptions = [
    {
      value: user.data.tax_date_begin?.split("-")[0],
      label: user.data.tax_date_begin?.split("-")[0],
    },
    { value: year, label: year },
  ].filter((option, index, self) => {
    const isUnique =
      self.findIndex(
        (o) => o.value == option.value && o.label == option.label
      ) === index

    return isUnique
  })

  const formatOptions = [
    { value: "pdf", label: "pdf" },
    {
      value: "xlsx",
      label: "xlsx",
    },
  ]

  const [selectedYear, setSelectedYear] = useState<number | undefined>(
    undefined
  )
  const [selectedFormat, setSelectedFormat] = useState<KudirFormat | undefined>(
    undefined
  )

  useEffect(() => {
    if (selectedYear !== 0 && selectedFormat !== undefined)
      setIsButtonDisabled(false)
    else setIsButtonDisabled(true)
  }, [selectedFormat, selectedYear])

  const { loaded, loading } = useSelector((state: RootState) => state.user)

  useEffect(() => {
    if (!loaded && !loading) dispatch(fetchCurrentUser())
  }, [dispatch, loaded, loading])

  const clear = () => {
    setSelectedYear(undefined)
    setSelectedFormat(undefined)
  }

  const downloadKudir = async () => {
    try {
      const response = await api.reports.getKudirReportReportsKudirGet(
        {
          period_type: 0,
          period_year: selectedYear || 0,
          kudir_format: selectedFormat,
        },

        { headers }
      )

      const blob = await response.blob()
      const downloadLink = document.createElement("a")

      downloadLink.href = window.URL.createObjectURL(blob)
      downloadLink.download = `${
        CONTENT.TITLE_KUDIR
      } от ${formatDateString()}.${selectedFormat}`
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
      successDownload()
    } catch (error) {
      errorDownload()
    } finally {
      setOpen(false)
      clear()
    }
  }
  return (
    <>
      {contextHolder}
      <Modal
        open={isOpen}
        onOk={() => {
          setOpen(false), clear()
        }}
        onCancel={() => {
          setOpen(false), clear()
        }}
        footer={null}
      >
        <div className={styles["modal-wrapper"]}>
          <Title level={3} style={{ margin: "0 0 32px" }}>
            {CONTENT.TITLE_KUDIR}
          </Title>
          <div className={styles["list-wrapper"]}>
            <div className={styles["input-item"]}>
              <Text
                className={cn(
                  styles["text-description"],
                  styles["default-text"]
                )}
              >
                {CONTENT.SELECT_PERIOD_TITLE}
                <Text className={styles["necessary"]}>
                  {" " + CONTENT.NECESSARY}
                </Text>
              </Text>

              <Select
                style={{ borderRadius: "4px" }}
                value={selectedYear}
                options={yearsOptions}
                onChange={(value) => setSelectedYear(value)}
              />
            </div>
            <div className={styles["input-item"]}>
              <Text
                className={cn(
                  styles["text-description"],
                  styles["default-text"]
                )}
              >
                {CONTENT.SELECT_FORMAT_TITLE}
                <Text className={styles["necessary"]}>
                  {" " + CONTENT.NECESSARY}
                </Text>
              </Text>

              <Select
                style={{ borderRadius: "4px" }}
                value={selectedFormat}
                options={formatOptions}
                onChange={(value) => setSelectedFormat(value)}
              />
            </div>
          </div>

          <div className={styles["buttons-row"]}>
            <Button
              key="back"
              onClick={() => {
                setOpen(false)
                clear()
              }}
              className={styles["button-item-cancel"]}
            >
              {CONTENT.CANCEL_BUTTON}
            </Button>

            <Button
              key="delete"
              onClick={downloadKudir}
              className={styles["button-item-download"]}
              disabled={isButtonDisabled}
            >
              {CONTENT.BUTTON_DOWNLOAD}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
