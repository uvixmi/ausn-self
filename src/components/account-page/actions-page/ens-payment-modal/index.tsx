import {
  Button,
  Collapse,
  Divider,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Typography,
  message,
} from "antd"
import { ConfirmModalProps } from "./types"
import styles from "./styles.module.scss"
import { useLocation, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { CONTENT } from "./constants"
import cn from "classnames"
import "./styles.scss"
import { useEffect, useState } from "react"
import TextArea from "antd/es/input/TextArea"
import Cookies from "js-cookie"
import { ENSInfo, SourcesInfo, api } from "../../../../api/myApi"
import * as iconv from "iconv-lite"
import { numberWithSpaces } from "../payment-modal/utils"
import { formatDateString } from "../utils"
import { RootState } from "../../../main-page/store"
import { AddAccountModal } from "./add-account-modal"
import { InfoCircleOutlined, PlusOutlined } from "@ant-design/icons"
import { InputOne } from "../../../../ui-kit/input"
import { ButtonOne } from "../../../../ui-kit/button"
import { SelectOne } from "../../../../ui-kit/select"
import { useMediaQuery } from "@react-hook/media-query"

export const EnsPaymentModal = ({
  isOpen,
  setOpen,
  setDueAmount,
  payAmount,
  defaultAccount,
  openAnalysis,
}: ConfirmModalProps) => {
  const { Title, Text, Link } = Typography
  const token = Cookies.get("token")

  const [ensRequsites, setEnsRequsites] = useState<ENSInfo | undefined>(
    undefined
  )

  const [amount, setAmount] = useState(0)
  const [amountInput, setAmountInput] = useState("")
  const [amountError, setAmountError] = useState(false)

  const headers = {
    Authorization: `Bearer ${token}`,
  }
  const [reasonError, setReasonError] = useState(false)
  const [reason, setReason] = useState<string>("")

  const handleReason = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReason(event.target.value)

    if (event.target.value.length > 0) setReasonError(false)
    else setReasonError(true)
  }

  const [isButtonDisabled, setIsButtonDisabled] = useState(true)

  const clear = () => {
    setReason("")
    setAmount(0)
    setAmountInput("")
    setAmountError(false)
    setReasonError(false)
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

  const sources = useSelector(
    (state: RootState) => state.sources.sourcesInfo?.sources
  )
  const optionsAddSources = [
    {
      label: (
        <Button
          className={styles["select-add-button"]}
          onClick={() => {
            setAddAccountOpen(true)
          }}
        >
          {"Добавить новый счет"}
        </Button>
      ),
      value: null,
    },
  ]
  const options =
    sources &&
    sources
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
          label: (
            <>
              <Text className={styles["options-accounts-text"]}>
                {item.name}{" "}
              </Text>

              <Text className={styles["options-accounts-digits-text"]}>
                {" *" + item.sub_name?.slice(-4)}
              </Text>
            </>
          ),
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

    if (
      parseFloat(amount) > 0 &&
      parseFloat(amount) <= 9999999999999.99 &&
      inputValue !== ""
    )
      setAmountError(false)
    else setAmountError(true)
  }

  const [handler, setHandler] = useState(false)

  useEffect(() => {
    if (handler === true) {
      setTimeout(() => {
        setAddAccountOpen(true)
        setHandler(false)
      }, 500)
    }
  }, [handler])

  const collapseItems = [
    {
      key: 1,
      label: (
        <Text className={cn(styles["requisites-title"])}>
          {CONTENT.TITLE_REQUISITES}
        </Text>
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

  const [addAccountOpen, setAddAccountOpen] = useState(false)
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
        downloadLink.setAttribute(
          "download",
          `Платежное поручение ЕНС ${formatDateString()}.txt`
        )
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

  const isMobile = useMediaQuery("(max-width: 1023px)")
  const [selectOpened, setSelectOpend] = useState(false)

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
        centered={isMobile}
        onOk={() => {
          setOpen(false)
          clear()
        }}
        onCancel={() => {
          setOpen(false)
          clear()
        }}
        footer={null}
        className={cn(styles["ant-modal"], "modal-payment-ens")}
      >
        <div className={styles["modal-style"]}>
          <div className={styles["modal-inner"]}>
            <div className={styles["payment-wrapper"]}>
              <Text className={styles["title-text"]}>
                {CONTENT.HEADING_MODAL}
              </Text>
              <div className={styles["update-wrapper"]}>
                <div className={styles["update-inner"]}>
                  <InfoCircleOutlined
                    className={styles["info-icon"]}
                    size={20}
                  />
                  <Text className={styles["banner-title"]}>
                    {CONTENT.UPDATE_TITLE}
                  </Text>
                  <Text className={styles["banner-description"]}>
                    {CONTENT.UDPATE_DESCRIPTION}
                  </Text>
                  <Link
                    className={styles["banner-link"]}
                    onClick={() => {
                      openAnalysis()
                    }}
                  >
                    {CONTENT.UDPATE_LINK}
                  </Link>
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
                    {CONTENT.TEXT_ACCOUNT_NUMBER}
                    <Text className={styles["necessary"]}>
                      {CONTENT.NECESSARY}
                    </Text>
                  </Text>

                  <SelectOne
                    options={options}
                    defaultValue={defaultAccount}
                    className={"modal-select-ens"}
                    placeholder={CONTENT.SELECT_ACCOUNT_PLACEHOLDER}
                    onChange={(value) => setAccount(value)}
                    open={selectOpened}
                    onDropdownVisibleChange={(visible) =>
                      setSelectOpend(visible)
                    }
                    notFoundContent={
                      <>
                        <Space
                          style={{
                            padding: "0 0px 4px",
                          }}
                        >
                          <Button
                            type="text"
                            className={styles["add-select-button-inner"]}
                            onClick={(e) => {
                              e.preventDefault()
                              e.currentTarget.blur()
                              setSelectOpend(false)
                              setHandler(true)
                            }}
                          >
                            {"Добавить новый счет"}
                          </Button>
                        </Space>
                      </>
                    }
                    dropdownRender={(menu) => (
                      <>
                        {menu}
                        {options?.length && options?.length > 0 ? (
                          <>
                            <Divider
                              style={{
                                margin: "2px 0",
                              }}
                            />
                            <Space
                              style={{
                                padding: "0 8px 4px",
                              }}
                            >
                              <Button
                                type="text"
                                icon={<PlusOutlined />}
                                className={styles["add-select-button-inner"]}
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.currentTarget.blur()
                                  setSelectOpend(false)
                                  setHandler(true)
                                }}
                              >
                                {"Добавить новый счет"}
                              </Button>
                            </Space>
                          </>
                        ) : null}
                      </>
                    )}
                  />
                  {/*(
                    <ButtonOne
                      onClick={() => {
                        setAddAccountOpen(true)
                      }}
                    >
                      {"Добавить счет"}
                    </ButtonOne>
                  )*/}
                </div>
              </div>
              <div className={styles["inputs-form"]}>
                <div className={styles["inputs-row"]}>
                  <div className={styles["input-item"]}>
                    <Text
                      className={cn(
                        styles["text-description"],
                        styles["default-text"]
                      )}
                    >
                      {CONTENT.TEXT_PAYMENT_DIRECTION}
                      <Text className={styles["necessary"]}>
                        {CONTENT.NECESSARY}
                      </Text>
                    </Text>
                    <Form.Item
                      className={styles["form-inn"]}
                      validateStatus={reasonError ? "error" : ""} // Устанавливаем статус ошибки в 'error' при наличии ошибки
                      help={
                        reasonError ? (
                          <div>
                            <Text className={styles["error-text"]}>
                              {reason.length === 0
                                ? CONTENT.INPUT_ERROR_HINT
                                : null}
                            </Text>
                          </div>
                        ) : (
                          ""
                        )
                      }
                    >
                      <InputOne
                        value={reason}
                        onChange={handleReason}
                        className={styles["text-area-style"]}
                        placeholder={CONTENT.INPUT_PLACEHOLDER}
                      />
                    </Form.Item>
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
                      <Text className={styles["necessary"]}>
                        {CONTENT.NECESSARY}
                      </Text>
                    </Text>
                    <Form.Item
                      className={styles["form-inn"]}
                      validateStatus={amountError ? "error" : ""} // Устанавливаем статус ошибки в 'error' при наличии ошибки
                      help={
                        amountError ? (
                          <div>
                            <Text className={styles["error-text"]}>
                              {amountInput === "0" || amountInput[0] === "-"
                                ? CONTENT.INPUT_FAULT_HINT
                                : CONTENT.INPUT_ERROR_HINT}
                            </Text>
                          </div>
                        ) : (
                          ""
                        )
                      }
                    >
                      <InputOne
                        placeholder={CONTENT.INPUT_AMOUNT_PLACEHOLDER}
                        value={amountInput}
                        onChange={handleChange}
                      />
                    </Form.Item>
                  </div>
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
              <ButtonOne
                className={styles["pay-inner"]}
                disabled={isButtonDisabled}
                onClick={handlePayment}
              >
                {CONTENT.BUTTON_ADD_PAYMENT}
              </ButtonOne>
            </div>
          </div>
        </div>
      </Modal>
      <AddAccountModal isOpen={addAccountOpen} setOpen={setAddAccountOpen} />
    </>
  )
}
