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
import { InputOne } from "../../../../../ui-kit/input"
import { ButtonOne } from "../../../../../ui-kit/button"
import "./styles.scss"
import { useMediaQuery } from "@react-hook/media-query"
import { isErrorResponse } from "../../../../authorization-page/utils"

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
  const [errorText, setErrorText] = useState("")
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

  const [bankName, setBankName] = useState("")
  const closeModal = () => {
    setOpen(false)
    setBankName("")
    setIntegrateBik("")
    setIntegrateAccount("")
    setIntegrateBikError(false)
    setIntegrateAccountError(false)
  }

  useEffect(() => {
    if (
      integrateBik.length == 9 &&
      integrateAccount.length == 20 &&
      integrateAccountError === false &&
      !integrateBikError
    )
      setIsIntegrateButtonDisabled(false)
    else setIsIntegrateButtonDisabled(true)
  }, [integrateBik, integrateAccount, integrateAccountError, integrateBikError])

  useEffect(() => {
    const getBankName = async () => {
      try {
        const response = await api.references.getBankInfoReferencesBankInfoGet(
          {
            bik: integrateBik,
          },
          { headers }
        )
        setBankName(response.data.bank_name)
      } catch (error) {
        setIntegrateBikError(true)
        if (isErrorResponse(error)) {
          setErrorText(error.error.detail.message)
        }
      }
    }
    if (integrateBik.length === 9) getBankName()
    else setBankName("")
  }, [integrateBik])

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

  const isMobile = useMediaQuery("(max-width: 1023px)")

  return (
    <>
      {contextHolder}
      <Modal
        open={isOpen}
        onOk={closeModal}
        onCancel={closeModal}
        footer={null}
        style={
          isMobile
            ? {
                top: 0,
                marginTop: "20px",
                borderRadius: "2px",
              }
            : { borderRadius: "2px" }
        }
        className="modal-add-account"
      >
        <div className={styles["modal-wrapper"]}>
          <Text className={styles["title-text"]}>{CONTENT.MODAL_TITLE}</Text>
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
                        {integrateBik.length === 0
                          ? CONTENT.INPUT_ERROR_HINT
                          : errorText}
                      </Text>
                    </div>
                  ) : (
                    ""
                  )
                }
              >
                <InputOne
                  value={integrateBik}
                  placeholder={CONTENT.INPUT_PLACEHOLDER}
                  showCount
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
            <div
              className={styles["input-item"]}
              style={{ marginBottom: "24px" }}
            >
              <Text className={cn(styles["text-disabled"])}>
                {CONTENT.INPUT_BANK_NAME}
              </Text>
              <InputOne
                disabled
                placeholder={CONTENT.INPUT_BANK_NAME_PLACEHOLDER}
                value={bankName}
              />
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
                <InputOne
                  value={integrateAccount}
                  placeholder={CONTENT.INPUT_PLACEHOLDER}
                  maxLength={20}
                  showCount
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
          <ButtonOne
            onClick={handleClick}
            disabled={isIntegrateButtonDisabled}
            className={styles["generate-button"]}
          >
            {CONTENT.BUTTON_TEXT}
          </ButtonOne>
        </div>
      </Modal>
    </>
  )
}
