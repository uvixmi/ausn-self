import { Button, DatePicker, Modal, Typography, message } from "antd"
import { OffSourceProps } from "./types"
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

export const OffSourceModal = ({
  isOpen,
  setOpen,
  setWasDeleted,
  titleModal,
  typeSource,
  source,
  account,
  source_id,
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
            {titleModal}
          </Title>
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
                  locale={locale}
                  format={dateFormat}
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
              <Text className={styles["text-input"]}>
                {CONTENT.DATA_NOT_LOAD}
              </Text>
            ) : typeSource === 4 ? (
              <Text className={styles["text-input"]}>
                {CONTENT.CANCEL_INTEGRATION_DESCRIPTION}
              </Text>
            ) : typeSource === 5 ? (
              <div className={styles["list-text"]}>
                <Text className={styles["text-input"]}>
                  {CONTENT.DATA_WILL_SAVE}
                </Text>
                <Text className={styles["text-input"]}>
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
              onClick={() => {
                handleOffSource()
              }}
              className={styles["button-item-enter"]}
            >
              {titleModal}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
