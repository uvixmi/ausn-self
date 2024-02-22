import {
  Button,
  ConfigProvider,
  DatePicker,
  Input,
  Modal,
  Select,
  Typography,
  message,
} from "antd"
import { PlusOutlined, CloseOutlined } from "@ant-design/icons"
import { ConfirmModalProps } from "./types"
import styles from "./styles.module.scss"
import locale from "antd/lib/date-picker/locale/ru_RU"
import { useDispatch, useSelector } from "react-redux"
import { CONTENT } from "./constants"
import cn from "classnames"
import "./styles.scss"
import dayjs from "dayjs"
import "dayjs/locale/ru"

import { useEffect, useState } from "react"
import {
  addPayment,
  setAmount,
  setDate,
  setDocNumber,
  setYear,
  clear,
  deletePayment,
} from "./slice"
import { RootState } from "../../../main-page/store"
import { api } from "../../../../api/myApi"
import Cookies from "js-cookie"
import { convertDateFormat, numberWithSpaces } from "./utils"
import { formatDateString } from "../utils"

export const PaymentModal = ({
  isOpen,
  setOpen,
  payAmount,
  fetchTasks,
  taskYear,
}: ConfirmModalProps) => {
  const { Title, Text } = Typography
  dayjs.locale("ru")
  const dispatch = useDispatch()
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
      content: CONTENT.NOTIFCATION_PROCESSING_ERROR,
      style: { textAlign: "right" },
    })
  }

  const { payments } = useSelector((state: RootState) => state.payments)

  const [amountInputs, setAmountInputs] = useState([{ amountrrr: "" }])

  const handleAmount = (amountIn: string, index: number) => {
    const amount = amountIn.replace(/\s/g, "")
    const reg = /^-?\d+(\.\d{0,2})?$/
    if (reg.test(amount) || amount === "-" || amount === "") {
      setAmountInputs((prevAmountInputs) => {
        const updatedAmountInputs = [...prevAmountInputs]
        updatedAmountInputs[index] = {
          amountrrr: numberWithSpaces(amount),
        }

        return updatedAmountInputs
      })

      if (amount[amount.length - 1] !== ".") {
        dispatch(setAmount({ amount: amount, index }))
      }

      if (amount === "") dispatch(setAmount({ amount: "", index }))
    }
  }

  const handleYear = (index: number) => {
    dispatch(setYear({ tax_period: taskYear, index }))
  }

  const handleDate = (date: string, index: number) => {
    dispatch(setDate({ date, index }))
    handleYear(index)
  }

  const handleDocNumber = (doc_number: string, index: number) => {
    dispatch(setDocNumber({ doc_number, index }))
  }

  const deletePay = (index: number) => {
    dispatch(deletePayment({ index }))
  }
  const token = Cookies.get("token")

  const headers = {
    Authorization: `Bearer ${token}`,
  }
  const handlePay = async () => {
    try {
      await api.operations.createOperationTaxPaymentOperationsTaxPaymentPost(
        {
          tax_payments: payments.map((item) => {
            return {
              ...item,
              date: convertDateFormat(payments[0].date).toString(),
            }
          }),
        },
        { headers }
      )
      setOpen(false)
      successProcess()
      dispatch(clear())
      fetchTasks()
    } catch (error) {
      setOpen(false)
      errorProcess()
      dispatch(clear())
    }
  }

  const [isButtonDisabled, setIsButtonDisabled] = useState(true)

  const currentYear = new Date().getFullYear()

  const optionsYears = [
    {
      label: `2022 год и ранее`,
      value: 2022,
    },
    {
      label: `2023 год и позже`,
      value: currentYear,
    },
  ]
  const dateFormat = "DD.MM.YYYY"

  useEffect(() => {
    setAmountInputs([
      { amountrrr: numberWithSpaces(payAmount?.toString() || "") },
    ])
  }, [isOpen])

  useEffect(() => {
    const amountsPayments = payments.every((item) => item.amount !== 0)
    const datesPayments = payments.every((item) => item.date !== "")
    //const yearsPayments = payments.every((item) => item.tax_period !== 0)
    if (
      amountsPayments &&
      datesPayments //&& yearsPayments
    )
      setIsButtonDisabled(false)
    else setIsButtonDisabled(true)
  }, [payments])

  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            DatePicker: {
              cellBgDisabled: "#D1D1D1",
            },
          },
        }}
      >
        {contextHolder}
        <Modal
          open={isOpen}
          style={{
            top: 0,
            marginRight: 0,
            borderRadius: "0",
          }}
          onOk={() => {
            setOpen(false)
            dispatch(clear())
          }}
          mask={false}
          onCancel={() => {
            setOpen(false)
            dispatch(clear())
          }}
          footer={null}
          className={cn(styles["ant-modal"], "modal-payment")}
        >
          <div className={styles["modal-style"]}>
            <div className={styles["modal-inner"]}>
              <div className={styles["payment-wrapper"]}>
                <Title level={3}>{CONTENT.HEADING_MODAL}</Title>
                <Text className={styles["text-description"]}>
                  {CONTENT.DESCRIPTION_MODAL}
                </Text>
                {payments.map((item, index) => (
                  <div className={styles["payment-inner"]}>
                    {index != 0 && (
                      <div className={styles["title-next"]}>
                        <Title
                          level={3}
                          style={{ marginBottom: 0, marginTop: "8px" }}
                        >
                          {CONTENT.NEXT_PAYMENT}
                        </Title>
                        <Button
                          className={styles["delete-payment"]}
                          onClick={() => {
                            deletePay(index)
                            setAmountInputs((prevAmountInputs) =>
                              prevAmountInputs.filter((_, i) => i !== index)
                            )
                          }}
                        >
                          <CloseOutlined />
                        </Button>
                      </div>
                    )}
                    <div className={styles["inputs-row"]}>
                      <div className={styles["input-item"]}>
                        <Text
                          className={cn(
                            styles["text-description"],
                            styles["default-text"]
                          )}
                        >
                          {CONTENT.TEXT_AMOUNT}
                        </Text>
                        <Input
                          style={{ borderRadius: 0, height: "32px" }}
                          value={amountInputs[index].amountrrr}
                          onChange={(event) =>
                            handleAmount(event.target.value, index)
                          }
                        />
                      </div>
                      <div className={styles["input-item"]}>
                        <Text
                          className={cn(
                            styles["text-description"],
                            styles["default-text"]
                          )}
                        >
                          {CONTENT.TEXT_DATE}
                        </Text>

                        <DatePicker
                          style={{ borderRadius: 0, height: "32px" }}
                          locale={locale}
                          format={dateFormat}
                          maxDate={dayjs(formatDateString(), dateFormat)}
                          placeholder={CONTENT.DATEPICKER_PLACEHOLDER}
                          value={
                            item.date ? dayjs(item.date, dateFormat) : null
                          }
                          onChange={(value, dateString) =>
                            typeof dateString === "string" &&
                            handleDate(dateString, index)
                          }
                        />
                      </div>
                    </div>
                    {/*
                <div className={styles["select-item"]}>
                  <Text
                    className={cn(
                      styles["text-description"],
                      styles["default-text"]
                    )}
                  >
                    {CONTENT.TEXT_YEAR}
                  </Text>
                  <Select
                    className={"modal-select"}
                    options={optionsYears}
                    placeholder={CONTENT.SELECT_YEAR_PLACEHOLDER}
                    value={item.tax_period ? item.tax_period : null}
                    onChange={(value) => {
                      handleYear(value, index)
                    }}
                  />
                </div>*/}
                    <div className={styles["select-item"]}>
                      <Text
                        className={cn(
                          styles["text-description"],
                          styles["default-text"]
                        )}
                      >
                        {CONTENT.TEXT_PAYMENT_NUMBER}
                      </Text>
                      <Input
                        style={{ borderRadius: 0 }}
                        value={item.doc_number ? item.doc_number : ""}
                        onChange={(event) =>
                          handleDocNumber(event.target.value, index)
                        }
                      />
                      <Text className={styles["input-description"]}>
                        {CONTENT.DESCRIPTION_PAYMENT_NUMBER}
                      </Text>
                    </div>
                  </div>
                ))}
                <Button
                  className={styles["add-payment-inner"]}
                  onClick={() => {
                    setAmountInputs([...amountInputs, { amountrrr: "" }])

                    dispatch(addPayment())
                  }}
                >
                  {CONTENT.BUTTON_ADD_PAYMENT}
                  <PlusOutlined
                    className={styles["plus-icon"]}
                    style={{ marginInlineStart: "4px" }}
                  />
                </Button>
              </div>
              <div className={styles["footer-button"]}>
                <Button
                  className={styles["pay-inner"]}
                  onClick={handlePay}
                  disabled={isButtonDisabled}
                >
                  {CONTENT.BUTTON_PAY}
                </Button>
                <Text className={styles["remark-text"]}>
                  {CONTENT.TEXT_REMARK}
                </Text>
              </div>
            </div>
          </div>
        </Modal>
      </ConfigProvider>
    </>
  )
}
