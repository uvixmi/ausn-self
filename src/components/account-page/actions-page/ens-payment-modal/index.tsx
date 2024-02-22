import {
  Button,
  Collapse,
  Input,
  Modal,
  Select,
  Typography,
  message,
} from "antd"
import { ConfirmModalProps } from "./types"
import styles from "./styles.module.scss"
import { useLocation, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { CONTENT } from "./constants"
import cn from "classnames"
import "./styles.scss"
import { useEffect, useState } from "react"
import TextArea from "antd/es/input/TextArea"
import Cookies from "js-cookie"
import { ENSInfo, SourcesInfo, api } from "../../../../api/myApi"
import * as iconv from "iconv-lite"
import { numberWithSpaces } from "../payment-modal/utils"

export const EnsPaymentModal = ({
  isOpen,
  setOpen,
  setDueAmount,
  payAmount,
  defaultAccount,
}: ConfirmModalProps) => {
  const { Title, Text, Link } = Typography
  const dispatch = useDispatch()
  const token = Cookies.get("token")
  const location = useLocation()

  const [ensRequsites, setEnsRequsites] = useState<ENSInfo | undefined>(
    undefined
  )

  const [amount, setAmount] = useState(0)
  const [amountInput, setAmountInput] = useState("")

  const headers = {
    Authorization: `Bearer ${token}`,
  }

  const [reason, setReason] = useState<string>("")

  const handleReason = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReason(event.target.value)
  }

  const [isButtonDisabled, setIsButtonDisabled] = useState(true)

  const clear = () => {
    setReason("")
    setAmount(0)
    setAmountInput("")
    setDueAmount && setDueAmount(undefined)
    setEnsRequsites(undefined)
  }

  const [messageApi, contextHolder] = message.useMessage()
  const successProcess = () => {
    messageApi.open({
      type: "success",
      content: CONTENT.NOTIFICATION_PROCESSING_SUCCESS,
      style: { textAlign: "right" },
    })
  }

  const loadingProcess = () => {
    messageApi.open({
      type: "loading",
      content: CONTENT.NOTIFICATION_PROCESSING,
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
  const [sources, setSources] = useState<SourcesInfo | undefined>(undefined)
  const optionsAddSources = [
    { label: <Button>{"Добавить счет"}</Button>, value: null },
  ]
  const options =
    sources?.sources &&
    sources.sources
      .filter(
        (item) =>
          item.id &&
          item.type === "account" &&
          item.state === "completed" &&
          item.name !== "Ручной ввод" &&
          !item.disable_date
      )
      .map((item) => {
        return {
          label: item.name + " *" + item.sub_name?.slice(-4),
          value: item.sub_name,
        }
      })

  const [account, setAccount] = useState("")

  useEffect(() => {
    if (token && isOpen) {
      const fetchSources = async () => {
        const tasksResponse = await api.taxes.getEnsInfoTaxesEnsRequisitesGet({
          headers,
        })
        setEnsRequsites(tasksResponse.data)
        setReason(tasksResponse.data.purpose || "")
        payAmount && setAmount(payAmount)
        payAmount && setAmountInput(numberWithSpaces(payAmount.toString()))
        const sourcesResponse = await api.sources.getSourcesInfoSourcesGet({
          headers,
        })
        setSources(sourcesResponse.data)
        setAccount(defaultAccount || "")
      }
      fetchSources()
    }
  }, [isOpen])

  useEffect(() => {
    if (amount > 0 && reason !== "" && account !== "")
      setIsButtonDisabled(false)
    else setIsButtonDisabled(true)
  }, [account, amount, reason])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = e.target
    const amount = inputValue.replace(/\s/g, "")
    const reg = /^-?\d+(\.\d{0,2})?$/

    if (reg.test(amount) || amount === "-" || amount === "") {
      setAmountInput(numberWithSpaces(amount))
      if (amount[amount.length - 1] !== ".") setAmount(parseFloat(amount))

      if (amount === "") setAmount(0)
    }
  }
  const collapseItems = [
    {
      key: 1,
      label: (
        <Title
          className={cn(styles["text-description"], styles["default-text"])}
          level={5}
          style={{ marginTop: 0 }}
        >
          {CONTENT.TITLE_REQUISITES}
        </Title>
      ),
      children: (
        <div className={styles["inputs-row"]}>
          <div className={styles["requisites-item"]}>
            <div className={styles["text-row"]}>
              <Text className={styles["text-left-part"]}>{CONTENT.NAME}</Text>
              <Text className={styles["text-right-part"]}>
                {ensRequsites?.receiver_name}
              </Text>
            </div>
            <div className={styles["text-row"]}>
              <Text className={styles["text-left-part"]}>{CONTENT.KBK}</Text>
              <Text className={styles["text-right-part"]}>
                {ensRequsites?.kbk}
              </Text>
            </div>
            <div className={styles["text-row"]}>
              <Text className={styles["text-left-part"]}>{CONTENT.INN}</Text>
              <Text className={styles["text-right-part"]}>
                {ensRequsites?.receiver_inn}
              </Text>
            </div>
            <div className={styles["text-row"]}>
              <Text className={styles["text-left-part"]}>
                {CONTENT.ACCOUNT}
              </Text>
              <Text className={styles["text-right-part"]}>
                {ensRequsites?.receiver_cor_account}
              </Text>
            </div>
            <div className={styles["text-row"]}>
              <Text className={styles["text-left-part"]}>{CONTENT.BIK}</Text>
              <Text className={styles["text-right-part"]}>
                {ensRequsites?.receiver_bank_bik}
              </Text>
            </div>
            <div className={styles["text-row"]}>
              <Text className={styles["text-left-part"]}>{CONTENT.BANK}</Text>
              <Text className={styles["text-right-part"]}>
                {ensRequsites?.receiver_bank_name}
              </Text>
            </div>
          </div>
        </div>
      ),
    },
  ]
  const handlePayment = async () => {
    if (account) {
      const data = {
        account_number: account,
        purpose: reason,
        amount: amount,
      }

      try {
        loadingProcess()
        const response =
          await api.taxes.generateEnsOrderTxtTaxesEnsOrderTxtPost(data, {
            headers,
          })

        successProcess()
        const text = await response.text()

        const downloadLink = document.createElement("a")
        downloadLink.href = window.URL.createObjectURL(
          new Blob([text], {
            type: "text/plain",
          })
        )
        downloadLink.setAttribute("download", "Новое платежное поручение.txt")
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)

        setOpen(false)
        clear()
      } catch (error) {
        console.error("Error during API call:", error)
        errorProcess()
        setOpen(false)
        clear()
      }
    }
  }

  return (
    <>
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
          clear()
        }}
        mask={false}
        onCancel={() => {
          setOpen(false)
          clear()
        }}
        footer={null}
        className={cn(styles["ant-modal"], "modal-payment")}
      >
        <div className={styles["modal-style"]}>
          <div className={styles["modal-inner"]}>
            <div className={styles["payment-wrapper"]}>
              <Title level={3}>{CONTENT.HEADING_MODAL}</Title>

              <div className={styles["inputs-row"]}>
                <div className={styles["input-item"]}>
                  <Text
                    className={cn(
                      styles["text-description"],
                      styles["default-text"]
                    )}
                  >
                    {CONTENT.TEXT_ACCOUNT_NUMBER}
                  </Text>
                  {options?.length && options?.length > 0 ? (
                    <Select
                      style={{ borderRadius: 0 }}
                      options={options}
                      defaultValue={defaultAccount}
                      className={"modal-select"}
                      placeholder={CONTENT.INPUT_AMOUNT_PLACEHOLDER}
                      onChange={(value) => setAccount(value)}
                    />
                  ) : (
                    <Button>{"Добавить счет"}</Button>
                  )}
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
                    {CONTENT.TEXT_PAYMENT_DIRECTION}
                  </Text>
                  <TextArea
                    style={{ borderRadius: 0 }}
                    value={reason}
                    onChange={handleReason}
                  />
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
                    {CONTENT.TEXT_AMOUNT}
                  </Text>
                  <Input
                    style={{ borderRadius: 0 }}
                    placeholder={CONTENT.INPUT_AMOUNT_PLACEHOLDER}
                    value={amountInput}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <Collapse
                items={collapseItems}
                defaultActiveKey={1}
                bordered={false}
                className="payment-collapse"
                ghost
                expandIconPosition="end"
              ></Collapse>
            </div>
            <div className={styles["footer-button"]}>
              <Button
                className={styles["pay-inner"]}
                disabled={isButtonDisabled}
                onClick={handlePayment}
              >
                {CONTENT.BUTTON_ADD_PAYMENT}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}
