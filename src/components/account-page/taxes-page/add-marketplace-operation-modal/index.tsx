import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  Tooltip,
  Typography,
  message,
} from "antd"
import { AddOperationModalProps } from "./types"
import styles from "./styles.module.scss"
import { useDispatch, useSelector } from "react-redux"
import { CONTENT } from "./constants"
import cn from "classnames"
import "./styles.scss"
import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import {
  MarketplaceKey as MarketplaceName,
  OperationCategory,
  api,
} from "../../../../api/myApi"
import ru_RU from "antd/lib/date-picker/locale/ru_RU"
import dayjs from "dayjs"
import "dayjs/locale/ru"
import {
  convertDateFormat,
  convertReverseFormat,
  numberWithSpaces,
} from "../../actions-page/payment-modal/utils"
import { compareDates, formatDateString } from "../../actions-page/utils"
import { InfoCircleOutlined } from "@ant-design/icons"
import { SelectOne } from "../../../../ui-kit/select"
import { InputOne } from "../../../../ui-kit/input"
import { ButtonOne } from "../../../../ui-kit/button"
import { useMediaQuery } from "@react-hook/media-query"
import { RootState } from "../../../main-page/store"
import { antdMonths } from "../../../../ui-kit/datepicker/localization"

export const AddMarketplaceOperationModal = ({
  isOpen,
  setOpen,
  setWasDeleted,
}: AddOperationModalProps) => {
  const { Title, Text, Link } = Typography
  const dispatch = useDispatch()
  const token = Cookies.get("token")
  const headers = {
    Authorization: `Bearer ${token}`,
  }
  const dateFormat = "MM.YYYY"

  dayjs.locale("ru")

  const locale = {
    ...ru_RU,
    lang: {
      ...ru_RU.lang,
      shortMonths: antdMonths.monthsShort,
      dateFormat: dateFormat,
    },
  }

  const [messageApi, contextHolder] = message.useMessage()
  const successProcess = () => {
    messageApi.open({
      type: "success",
      content: CONTENT.NOTIFICATION_PROCESSING_SUCCESS,
      style: { textAlign: "right" },
    })
  }

  const failedProcess = () => {
    messageApi.open({
      type: "error",
      content: CONTENT.NOTIFICATION_PROCESSING_FAILED,
      style: { textAlign: "right" },
    })
  }

  const [isButtonDisabled, setIsButtonDisabled] = useState(true)

  const [income, setIncome] = useState<number | null>(null)

  const [marketplace, setMarketplace] = useState<MarketplaceName | null>(null)

  const [counterparty, setCounterparty] = useState("")
  const [direct, setDirect] = useState("")

  const [amount, setAmount] = useState(0)
  const [amountInput, setAmountInput] = useState("")

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

  const { data: currentUser } = useSelector((state: RootState) => state.user)

  const [dateOperation, setDateOperation] = useState("")
  const [document, setDocument] = useState("")

  const options = [
    {
      label: (
        <Text className={styles["select-text"]}>
          {"Реализация на маркетплейсе"}
        </Text>
      ),
      value: 1,
    },
  ]

  const optionsMarketplaces = [
    {
      label: <Text className={styles["select-text"]}>{"Ozon"}</Text>,
      value: MarketplaceName.Ozon,
    },
    {
      label: <Text className={styles["select-text"]}>{"Wildberries"}</Text>,
      value: MarketplaceName.Wb,
    },
  ]

  useEffect(() => {
    if (income === 4) {
      setDirect(CONTENT.PURPOSE_TAX_DISABLED)
      setCounterparty(CONTENT.COUNTERPARTY_TAX_DISABLED)
    } else {
      setDirect("")
      setCounterparty("")
    }
  }, [income])

  useEffect(() => {
    if (
      income !== 0 &&
      marketplace !== null &&
      amount !== 0 &&
      dateOperation !== ""
    )
      setIsButtonDisabled(false)
    else setIsButtonDisabled(true)
  }, [income, amount, dateOperation, marketplace])
  const currentYear = new Date().getFullYear()

  const addOperation = async () => {
    if (income === 4) {
      try {
        const data = {
          tax_payments: [
            {
              amount: amount,
              date: convertDateFormat(dateOperation),
              doc_number: document !== "" ? document : null,
              tax_period: currentYear,
              tax_type: income,
            },
          ],
        }
        await api.operations.createOperationTaxPaymentOperationsTaxPaymentPost(
          data,
          {
            headers,
          }
        )
        successProcess()
        closeModal()
      } catch (error) {
        failedProcess()
        closeModal()
      }
    } else {
      try {
        await api.operations.createOperationOperationsByHandPost(
          {
            amount: amount,
            date: convertDateFormat(dateOperation),
            doc_number: document !== "" ? document : null,
            purpose: direct,
            counterparty_name: counterparty,
            category:
              income === 1 ? OperationCategory.Debet : OperationCategory.Credit,
            operation_type: income === 1 ? 1 : 3,
          },
          {
            headers,
          }
        )
        successProcess()
        setWasDeleted(true)
        closeModal()
      } catch (error) {
        failedProcess()
        closeModal()
      }
    }
  }

  const closeModal = () => {
    setOpen(false)
    setIncome(1)
    setCounterparty("")
    setDirect("")
    setAmount(0)
    setAmountInput("")
    setDateOperation("")
    setDocument("")

    setAmountError(false)
    setCounterpartyError(false)
    setPurposeError(false)
    setDateError(false)
  }

  const [counterpartyError, setCounterpartyError] = useState(false)
  const [purposeError, setPurposeError] = useState(false)
  const [amountError, setAmountError] = useState(false)

  const [dateError, setDateError] = useState(false)

  const isMobile = useMediaQuery("(max-width: 1023px)")

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
        onOk={closeModal}
        centered={isMobile}
        mask={true}
        onCancel={closeModal}
        footer={null}
        className={cn(styles["ant-modal"], "modal-payment")}
      >
        <div className={styles["modal-style"]}>
          <div className={styles["modal-inner"]}>
            <div className={styles["operation-inner"]}>
              <div className={styles["description-item"]}>
                <Text
                  style={{ marginBottom: "8px" }}
                  className={styles["title-font"]}
                >
                  {CONTENT.HEADING_MODAL}
                </Text>
                <Text className={styles["title-description"]}>
                  {CONTENT.OPERATION_DESCRIPTION_FIRST_LINE}
                </Text>
                <Text className={styles["title-description"]}>
                  {CONTENT.OPERATION_DESCRIPTION_SECOND_LINE}
                </Text>
              </div>
              <div className={styles["operation-type-inner"]}>
                <div
                  className={styles["input-item"]}
                  style={{ marginBottom: "24px" }}
                >
                  <Text
                    className={cn(
                      styles["text-description"],
                      styles["default-text"]
                    )}
                  >
                    {CONTENT.SELECT_INCOME_TITLE}{" "}
                    <Text className={styles["necessary"]}>
                      {CONTENT.NECESSARY}
                    </Text>
                  </Text>
                  <SelectOne
                    className={"modal-select"}
                    value={income}
                    options={options}
                    onChange={(value) => setIncome(value)}
                    placeholder={CONTENT.SELECT_INCOME_PLACEHOLDER}
                  />
                </div>
                <div
                  className={styles["input-item"]}
                  style={{ marginBottom: "24px" }}
                >
                  <Text
                    className={cn(
                      styles["text-description"],
                      styles["default-text"]
                    )}
                  >
                    {CONTENT.SELECT_MARKETPLACE_TITLE}{" "}
                    <Text className={styles["necessary"]}>
                      {CONTENT.NECESSARY}
                    </Text>
                  </Text>
                  <SelectOne
                    className={"modal-select"}
                    value={marketplace}
                    options={optionsMarketplaces}
                    onChange={(value) => setMarketplace(value)}
                    placeholder={CONTENT.SELECT_INCOME_PLACEHOLDER}
                  />
                </div>

                <div className={styles["inputs-row"]}>
                  <div className={styles["input-item"]}>
                    <Text
                      className={cn(
                        styles["text-description"],
                        styles["default-text"]
                      )}
                    >
                      {CONTENT.INPUT_AMOUNT_TITLE}
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
                              {amountInput === "0"
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
                        placeholder={CONTENT.INPUT_PLACEHOLDER}
                        value={amountInput}
                        onChange={handleChange}
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
                      {CONTENT.DATEPICKER_TITLE}{" "}
                      <Text className={styles["necessary"]}>
                        {CONTENT.NECESSARY}
                      </Text>
                    </Text>
                    <Form.Item
                      className={styles["form-inn"]}
                      validateStatus={dateError ? "error" : ""} // Устанавливаем статус ошибки в 'error' при наличии ошибки
                      help={
                        dateError ? (
                          <div>
                            <Text className={styles["error-text"]}>
                              {dateOperation !== ""
                                ? CONTENT.INPUT_FAULT_HINT
                                : CONTENT.INPUT_ERROR_HINT}
                            </Text>
                          </div>
                        ) : (
                          ""
                        )
                      }
                    >
                      <DatePicker
                        placeholder={CONTENT.DATEPICKER_PLACEHOLDER}
                        style={{ borderRadius: "4px", height: "34px" }}
                        className={cn(
                          "picker-operation",
                          styles["datepicker-style"]
                        )}
                        locale={locale}
                        minDate={
                          currentUser.tax_date_begin
                            ? dayjs(
                                convertReverseFormat(
                                  currentUser.tax_date_begin
                                ),
                                dateFormat
                              )
                            : undefined
                        }
                        maxDate={dayjs(formatDateString(), dateFormat)}
                        format={dateFormat}
                        picker="month"
                        value={
                          dateOperation
                            ? dayjs(dateOperation, dateFormat)
                            : null
                        }
                        onChange={(value, dateString) => {
                          typeof dateString === "string" &&
                            setDateOperation(dateString)
                          if (dateString === "") setDateError(true)
                          else setDateError(false)
                          if (
                            currentUser.tax_date_begin &&
                            typeof dateString === "string" &&
                            compareDates(dateString, currentUser.tax_date_begin)
                          )
                            setDateError(true)
                          else setDateError(false)
                        }}
                      />
                    </Form.Item>
                  </div>
                </div>
                <div className={styles["input-item"]}>
                  <Text
                    className={cn(
                      styles["text-description"],
                      styles["default-text"]
                    )}
                  >
                    {CONTENT.INPUT_DOCUMENT_TITLE}
                  </Text>
                  <Form.Item className={styles["form-inner"]}>
                    <InputOne
                      placeholder={CONTENT.INPUT_PLACEHOLDER}
                      value={document}
                      maxLength={20}
                      onChange={(event) => {
                        const inputValue = event.target.value
                        const regex = /^[a-zA-Zа-яА-Я0-9/.-]*$/
                        if (regex.test(inputValue) && inputValue.length <= 20) {
                          setDocument(inputValue)
                        }
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
                    {CONTENT.INPUT_REPORT_REALIZATION_TITLE}
                  </Text>
                  <Form.Item className={styles["form-inner"]}>
                    <InputOne
                      placeholder={CONTENT.INPUT_PLACEHOLDER}
                      value={document}
                      maxLength={20}
                      onChange={(event) => {
                        const inputValue = event.target.value
                        const regex = /^[a-zA-Zа-яА-Я0-9/.-]*$/
                        if (regex.test(inputValue) && inputValue.length <= 20) {
                          setDocument(inputValue)
                        }
                      }}
                    />
                  </Form.Item>
                </div>
              </div>
            </div>
            <div className={styles["footer-button"]}>
              <ButtonOne
                className={styles["pay-inner"]}
                onClick={addOperation}
                //disabled={isButtonDisabled}
              >
                {CONTENT.BUTTON_ADD}
              </ButtonOne>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}
