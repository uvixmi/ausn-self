import { Button, Form, Input, Modal, Typography, message } from "antd"
import { AddAccountModalProps } from "./types"
import styles from "./styles.module.scss"
import { CONTENT } from "./constants"
import cn from "classnames"
import Cookies from "js-cookie"
import { useEffect, useState } from "react"
import { api } from "../../../../../api/myApi"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../../../../main-page/store"
import { fetchSourcesInfo } from "../../../client/sources/thunks"

export const AddAccountModal = ({ isOpen, setOpen }: AddAccountModalProps) => {
  const { Title, Text } = Typography
  const token = Cookies.get("token")
  const headers = {
    Authorization: `Bearer ${token}`,
  }

  const dispatch = useDispatch<AppDispatch>()
  const [messageApi, contextHolder] = message.useMessage()

  const [integrateBik, setIntegrateBik] = useState("")
  const [integrateAccount, setIntegrateAccount] = useState("")
  const [integrateBikError, setIntegrateBikError] = useState(false)
  const [integrateAccountError, setIntegrateAccountError] = useState(false)
  const [isIntegrateButtonDisabled, setIsIntegrateButtonDisabled] =
    useState(true)
  const successProcess = (text: string) => {
    messageApi.open({
      type: "success",
      content: text,
      style: { textAlign: "right" },
    })
  }

  const errorProcess = (text: string) => {
    messageApi.open({
      type: "error",
      content: text,
      style: { textAlign: "right" },
    })
  }

  const closeModal = () => {
    setOpen(false)
  }

  useEffect(() => {
    if (integrateBik.length == 9 && integrateAccount.length == 20)
      setIsIntegrateButtonDisabled(false)
    else setIsIntegrateButtonDisabled(true)
  }, [integrateBik, integrateAccount])

  const handleClick = async () => {
    try {
      await api.sources.createClientAccountSourcesAccountPost(
        { account_number: integrateAccount, bank_bik: integrateBik },
        { headers }
      )
      successProcess(CONTENT.NOTIFICATION_SUCCESS)
      dispatch(fetchSourcesInfo())
    } catch (error) {
      errorProcess(CONTENT.NOTIFICATION_ERROR)
    } finally {
      closeModal()
    }
  }

  useEffect(() => {
    if (integrateAccount !== "")
      if (
        !(
          integrateAccount.startsWith("408") ||
          integrateAccount.startsWith("407")
        )
      ) {
        setIntegrateAccountError(true)
      } else setIntegrateAccountError(false)
  }, [integrateAccount])

  return (
    <>
      {contextHolder}
      <Modal
        open={isOpen}
        onOk={closeModal}
        onCancel={closeModal}
        footer={null}
        style={{ borderRadius: "2px" }}
      >
        <div className={styles["modal-wrapper"]}>
          <Title level={3} style={{ marginBottom: "4px" }}>
            {CONTENT.MODAL_TITLE}
          </Title>
          <div className={styles["description-item"]}>
            <Text className={styles["title-description"]}>
              {CONTENT.MODAL_DESCRIPTION}
            </Text>
          </div>
          <div className={styles["inputs-inner"]}>
            <div className={styles["input-item"]}>
              <Text
                className={cn(
                  styles["text-description"],
                  styles["default-text"]
                )}
              >
                {CONTENT.TEXT_BANK_BIK}
                <Text className={styles["necessary"]}>{CONTENT.NECESSARY}</Text>
              </Text>
              <Form.Item
                className={styles["form-inn"]}
                validateStatus={integrateBikError ? "error" : ""} // Устанавливаем статус ошибки в 'error' при наличии ошибки
                help={
                  integrateBikError ? (
                    <div>
                      <Text className={styles["error-text"]}>
                        {CONTENT.INPUT_ERROR_HINT}
                      </Text>
                    </div>
                  ) : (
                    ""
                  )
                }
              >
                <Input
                  value={integrateBik}
                  placeholder={CONTENT.INPUT_PLACEHOLDER}
                  showCount
                  style={{ borderRadius: "2px" }}
                  maxLength={9}
                  onChange={(event) => {
                    const numericValue = event.target.value.replace(/\D/g, "")
                    setIntegrateBik(numericValue)
                    if (event.target.value !== "") setIntegrateBikError(false)
                    else setIntegrateBikError(true)
                  }}
                />
              </Form.Item>
            </div>
            <div className={styles["input-item"]}>
              <Text
                className={cn(
                  styles["text-description"],
                  styles["default-text"]
                )}
              >
                {CONTENT.TEXT_BANK_ACCOUNT}
                <Text className={styles["necessary"]}>{CONTENT.NECESSARY}</Text>
              </Text>
              <Form.Item
                className={styles["form-inn"]}
                validateStatus={integrateAccountError ? "error" : ""}
                help={
                  integrateAccountError ? (
                    <div>
                      <Text className={styles["error-text"]}>
                        {integrateAccount === ""
                          ? CONTENT.INPUT_ERROR_HINT
                          : !(
                              integrateAccount.startsWith("408") ||
                              integrateAccount.startsWith("407")
                            )
                          ? CONTENT.INPUT_FAULT_ACCOUNT
                          : ""}
                      </Text>
                    </div>
                  ) : (
                    ""
                  )
                }
              >
                <Input
                  value={integrateAccount}
                  placeholder={CONTENT.INPUT_PLACEHOLDER}
                  maxLength={20}
                  showCount
                  style={{ borderRadius: "2px" }}
                  onChange={(event) => {
                    const numericValue = event.target.value.replace(/\D/g, "")
                    setIntegrateAccount(numericValue)
                    if (event.target.value === "")
                      setIntegrateAccountError(true)
                  }}
                />
              </Form.Item>
            </div>
          </div>
          <Button
            onClick={handleClick}
            disabled={isIntegrateButtonDisabled}
            className={styles["generate-button"]}
          >
            {CONTENT.BUTTON_TEXT}
          </Button>
        </div>
      </Modal>
    </>
  )
}
