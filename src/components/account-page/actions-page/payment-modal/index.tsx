import { Button, DatePicker, Input, Modal, Select, Typography } from "antd"
import { ConfirmModalProps } from "./types"
import styles from "./styles.module.scss"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { CONTENT } from "./constants"
import cn from "classnames"
import "./styles.scss"
import { useState } from "react"

export const PaymentModal = ({ isOpen, setOpen }: ConfirmModalProps) => {
  const { Title, Text, Link } = Typography

  const [payments, setPayments] = useState([{ amount: 1 }])
  const dispatch = useDispatch()

  const navigate = useNavigate()
  return (
    <Modal
      open={isOpen}
      style={{
        top: 0,
        marginRight: 0,
        borderRadius: "0",
      }}
      onOk={() => setOpen(false)}
      mask={false}
      onCancel={() => setOpen(false)}
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
                    <Input style={{ borderRadius: 0 }} />
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
                    <DatePicker style={{ borderRadius: 0 }} />
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
                  <Select className={"modal-select"} />
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
                  <Input style={{ borderRadius: 0 }} />
                </div>
              </div>
            ))}
            <Button
              className={styles["add-payment-inner"]}
              onClick={() => setPayments([...payments, { amount: 1 }])}
            >
              {CONTENT.BUTTON_ADD_PAYMENT}
            </Button>
          </div>
          <div className={styles["footer-button"]}>
            <Button className={styles["pay-inner"]}>
              {CONTENT.BUTTON_PAY}
            </Button>
            <Text className={styles["remark-text"]}>{CONTENT.TEXT_REMARK}</Text>
          </div>
        </div>
      </div>
    </Modal>
  )
}
