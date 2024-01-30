import { Button, Input, Modal, Typography } from "antd"
import { ConfirmModalProps } from "./types"
import styles from "./styles.module.scss"
import { CONTENT } from "./constants"
import cn from "classnames"
import "./styles.scss"
import Cookies from "js-cookie"
import { useEffect, useState } from "react"
import { LeadReason, api } from "../../../../api/myApi"
import { MaskedInput } from "antd-mask-input"

export const AnalysisEnsModal = ({ isOpen, setOpen }: ConfirmModalProps) => {
  const { Title, Text } = Typography
  const token = Cookies.get("token")
  const headers = {
    Authorization: `Bearer ${token}`,
  }

  const PhoneMask = "+{0} (000) 000-00-00"
  const [phone, setPhone] = useState("")
  const [phoneError, setPhoneError] = useState(false)
  const [isButtonDisabled, setIsButtonDisabled] = useState(true)

  const validatePhone = (phoneNumber: string) => {
    if (phoneNumber) {
      const strippedNumber = phoneNumber.replace(/[^\d]/g, "")
      const lengthRegex = /^\d{11}$/
      const isValidLength = lengthRegex.test(strippedNumber)
      return !isValidLength
    } else return true
  }
  const sendPhone = async () => {
    await api.users.saveUserLeadUsersLeadPut(
      { phone_number: phone.replace(/[^\d+]/g, ""), reason: LeadReason.Ens },
      {
        headers,
      }
    )
    setOpen(false)
  }
  useEffect(() => {
    if (!phoneError && phone !== "") setIsButtonDisabled(false)
    else setIsButtonDisabled(true)
  }, [phone, phoneError])

  return (
    <Modal
      open={isOpen}
      style={{
        borderRadius: "0",
      }}
      centered
      onOk={() => setOpen(false)}
      onCancel={() => setOpen(false)}
      footer={null}
      className={cn(styles["ant-modal"], "modal-payment")}
    >
      <div className={styles["modal-style"]}>
        <div className={styles["modal-inner"]}>
          <div className={styles["payment-wrapper"]}>
            <div className={styles["heading-row"]}>
              <Title level={3} style={{ marginBottom: 0 }}>
                {CONTENT.HEADING_MODAL}
              </Title>
              <Text className={cn(styles["text-description"])}>
                {CONTENT.PAID_RATE_DESCRIPTION_MODAL}
              </Text>
            </div>
            <div className={styles["inputs-row"]}>
              <div className={styles["input-item"]}>
                <Text
                  className={cn(
                    styles["text-description"],
                    styles["default-text"]
                  )}
                >
                  {CONTENT.TEXT_ONE}
                </Text>
              </div>
            </div>
            <div className={styles["inputs-row"]}>
              <div className={styles["input-item"]}>
                <Text
                  className={cn(
                    styles["text-description"],
                    styles["default-text"]
                  )}
                >
                  {CONTENT.TEXT_TWO}
                </Text>
              </div>
            </div>

            <div className={styles["inputs-row"]}>
              <div className={styles["input-item"]}>
                <Text
                  className={cn(
                    styles["text-description"],
                    styles["default-text"]
                  )}
                >
                  {CONTENT.TITLE_PHONE}
                </Text>
                <MaskedInput
                  mask={PhoneMask}
                  style={{ borderRadius: 0 }}
                  className={styles["input-item"]}
                  value={phone}
                  onChange={(event) => {
                    setPhone(event.target.value),
                      setPhoneError(validatePhone(event.target.value))
                  }}
                  placeholder={CONTENT.PHONE_PLACEHOLDER}
                  status={phoneError ? "error" : undefined}
                />
              </div>
            </div>
          </div>
          <div className={styles["footer-button"]}>
            <Button
              className={styles["pay-inner"]}
              onClick={sendPhone}
              disabled={isButtonDisabled}
            >
              {CONTENT.BUTTON_SEND}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
