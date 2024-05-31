import { Button, DatePicker, Modal, Typography, message } from "antd"
import { OffSourceProps } from "./types"
import "./styles.scss"
import styles from "./styles.module.scss"
import { api } from "../../../../api/myApi"
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
import { useDispatch } from "react-redux"
import { AppDispatch } from "../../../main-page/store"
import { fetchSourcesInfo } from "../../client/sources/thunks"
import { formatDateString } from "../../actions-page/utils"
import { ButtonOne } from "../../../../ui-kit/button"

export const OffSourceModal = ({
  isOpen,
  setOpen,
  setWasDeleted,
  titleModal,
  typeSource,
  source,
  account,
  source_id,
  fetchSourcesHand,
}: OffSourceProps) => {
  const { Title, Text } = Typography
  const token = Cookies.get("token")
  const headers = {
    Authorization: `Bearer ${token}`,
  }

  dayjs.locale("ru")
  const dateFormat = "DD.MM.YYYY"

  const dispatch = useDispatch<AppDispatch>()

  const [messageApi, contextHolder] = message.useMessage()
  const successProcess = () => {
    messageApi.open({
      type: "success",
      content: CONTENT.NOTIFICATION_PROCESSING_SUCCESS,
      style: { textAlign: "right" },
    })
  }

  const errorProcess = () => {
    messageApi.open({
      type: "error",
      content: CONTENT.NOTIFICATION_PROCESSING_FAILED,
      style: { textAlign: "right" },
    })
  }

  const deleteOperation = async (id: string) => {
    try {
      await api.operations.deleteOperationOperationsDelete(
        { operation_id: id },
        { headers }
      )
      successProcess()
      setWasDeleted(true)
    } catch (error) {
      errorProcess()
    }
  }

  const [dateOperation, setDateOperation] = useState("")

  const clear = () => {
    setDateOperation("")
  }

  const handleOffSource = async () => {
    const data = {
      disable_date:
        dateOperation !== ""
          ? convertDateFormat(dateOperation)
          : getCurrentDate(),
      source_id: source_id ? source_id : "",
    }
    try {
      await api.sources.disableSourceSourcesDisablePut(data, { headers })
      successProcess()
      dispatch(fetchSourcesInfo())
    } catch (error) {
      errorProcess()
    } finally {
      setOpen(false)
      clear()
      fetchSourcesHand()
    }
  }

  const [isButtonDisabled, setIsButtonDisabled] = useState(true)

  useEffect(() => {
    if (dateOperation !== "" || typeSource === 3 || typeSource === 5)
      setIsButtonDisabled(false)
    else setIsButtonDisabled(true)
  }, [dateOperation, typeSource])

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
          <Text className={styles["off-title"]}>{titleModal}</Text>
          <div className={styles["list-wrapper"]}>
            <div className={styles["list-text"]}>
              {account && (
                <Text className={styles["text-source"]}>
                  {CONTENT.ACCOUNT_TEXT + "*" + account.slice(-4)}
                </Text>
              )}
              <Text className={styles["text-source"]}> {source}</Text>
            </div>
            <Text className={styles["text-source"]}>
              {CONTENT.LINE_DESCRIPTION}
            </Text>
            {typeSource === 1 || typeSource === 2 ? (
              <div className={styles["list-text"]}>
                <Text className={styles["text-input"]}>
                  {typeSource === 1
                    ? CONTENT.DATE_CLOSE_TEXT
                    : CONTENT.DATE_CLOSE_OFD_TEXT}
                  <Text className={styles["necessary"]}>
                    {" " + CONTENT.NECESSARY}
                  </Text>
                </Text>

                <DatePicker
                  placeholder={CONTENT.DATEPICKER_PLACEHOLDER}
                  style={{ borderRadius: "4px", height: "32px" }}
                  maxDate={dayjs(formatDateString(), dateFormat)}
                  locale={locale}
                  format={dateFormat}
                  className="picker-off"
                  value={
                    dateOperation ? dayjs(dateOperation, dateFormat) : null
                  }
                  onChange={(value, dateString) => {
                    typeof dateString === "string" &&
                      setDateOperation(dateString)
                  }}
                />
              </div>
            ) : typeSource === 3 ? (
              <Text className={styles["text-input-load"]}>
                {CONTENT.DATA_NOT_LOAD}
              </Text>
            ) : typeSource === 4 ? (
              <Text className={styles["text-input-load"]}>
                {CONTENT.CANCEL_INTEGRATION_DESCRIPTION}
              </Text>
            ) : typeSource === 5 ? (
              <div className={styles["list-text"]}>
                <Text className={styles["text-input-load"]}>
                  {CONTENT.DATA_WILL_SAVE}
                </Text>
                <Text className={styles["text-input-load"]}>
                  {CONTENT.SYMBOL_S}
                  <Text className={styles["text-date"]}>
                    {convertReverseFormat(getCurrentDate())}
                  </Text>
                  {CONTENT.NECESSARY_BY_HAND}
                </Text>
              </div>
            ) : null}
          </div>

          <div className={styles["buttons-row"]}>
            <ButtonOne
              key="back"
              onClick={() => {
                setOpen(false)
                clear()
              }}
              className={styles["button-item-cancel"]}
              type="secondary"
            >
              {CONTENT.CANCEL_BUTTON}
            </ButtonOne>

            <ButtonOne
              key="delete"
              onClick={() => {
                handleOffSource()
              }}
              className={styles["button-item-enter"]}
              disabled={isButtonDisabled}
              type="danger"
            >
              {titleModal}
            </ButtonOne>
          </div>
        </div>
      </Modal>
    </>
  )
}
