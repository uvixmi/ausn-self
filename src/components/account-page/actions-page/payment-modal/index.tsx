import { Button, DatePicker, Input, Modal, Select, Typography } from "antd"
import { ConfirmModalProps } from "./types"
import styles from "./styles.module.scss"
import { useDispatch, useSelector } from "react-redux"
import { CONTENT } from "./constants"
import cn from "classnames"
import "./styles.scss"
import dayjs from "dayjs"
import { useEffect, useState } from "react"
import {
  addPayment,
  setAmount,
  setDate,
  setDocNumber,
  setYear,
  clear,
} from "./slice"
import { RootState } from "../../../main-page/store"
import { api } from "../../../../api/myApi"
import Cookies from "js-cookie"

export const PaymentModal = ({ isOpen, setOpen }: ConfirmModalProps) => {
  const { Title, Text } = Typography

  const dispatch = useDispatch()

  const { payments } = useSelector((state: RootState) => state.payments)

  const handleAmount = (amount: string, index: number) => {
    dispatch(setAmount({ amount, index }))
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

  const token = Cookies.get("token")

  const headers = {
    Authorization: `Bearer ${token}`,
  }
  const handlePay = async () => {
    try {
      await api.operations.createOperationTaxPaymentOperationsTaxPaymentPost(
        { tax_payments: payments[0] },
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

  useEffect(() => {
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
                  <Title
                    level={3}
                    style={{ marginBottom: 0, marginTop: "8px" }}
                  >
                    {CONTENT.NEXT_PAYMENT}
                  </Title>
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
                      value={item.amount}
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
                      placeholder={CONTENT.DATEPICKER_PLACEHOLDER}
                      value={item.date ? dayjs(item.date) : null}
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
                    value={item.doc_number}
                    onChange={(event) =>
                      handleDocNumber(event.target.value, index)
                    }
                  />
                </div>
              </div>
            ))}
            <Button
              className={styles["add-payment-inner"]}
              onClick={() => dispatch(addPayment())}
            >
              {CONTENT.BUTTON_ADD_PAYMENT}
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
