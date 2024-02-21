import { Button, DatePicker, Input, Modal, Select, Typography } from "antd"
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
import { convertDateFormat } from "./utils"

export const PaymentModal = ({
  isOpen,
  setOpen,
  payAmount,
}: ConfirmModalProps) => {
  const { Title, Text } = Typography
  dayjs.locale("ru")
  const dispatch = useDispatch()

  const { payments } = useSelector((state: RootState) => state.payments)

  const [amountInputs, setAmountInputs] = useState([{ amount: "" }])

  const handleAmount = (amount: string, index: number) => {
    const reg = /^-?\d+(\.\d{0,2})?$/

    if (reg.test(amount) || amount === "-") {
      setAmountInputs((prevAmountInputs) => {
        const updatedAmountInputs = [...prevAmountInputs]
        updatedAmountInputs[index] = { amount }
        return updatedAmountInputs
      })
      if (amount[amount.length - 1] !== ".")
        dispatch(setAmount({ amount: amount, index }))

      if (amount === "") dispatch(setAmount({ amount: "", index }))
    }
  }

  const handleDate = (date: string, index: number) => {
    dispatch(setDate({ date, index }))
  }
  const handleYear = (tax_period: number, index: number) => {
    dispatch(setYear({ tax_period, index }))
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
      dispatch(clear())
    } catch (error) {
      setOpen(false)
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
    setAmountInputs([{ amount: payAmount?.toString() || "" }])
    const amountsPayments = payments.every((item) => item.amount !== 0)
    const datesPayments = payments.every((item) => item.date !== "")
    const yearsPayments = payments.every((item) => item.tax_period !== 0)
    if (amountsPayments && datesPayments && yearsPayments)
      setIsButtonDisabled(false)
    else setIsButtonDisabled(true)
  }, [payments])

  return (
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
                      style={{ borderRadius: 0 }}
                      value={amountInputs[index].amount}
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
                      style={{ borderRadius: 0 }}
                      locale={locale}
                      format={dateFormat}
                      placeholder={CONTENT.DATEPICKER_PLACEHOLDER}
                      value={item.date ? dayjs(item.date, dateFormat) : null}
                      onChange={(value, dateString) =>
                        handleDate(dateString, index)
                      }
                    />
                  </div>
                </div>
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
                </div>
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
                dispatch(addPayment())
                setAmountInputs([...amountInputs, { amount: "" }])
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
            <Text className={styles["remark-text"]}>{CONTENT.TEXT_REMARK}</Text>
          </div>
        </div>
      </div>
    </Modal>
  )
}
