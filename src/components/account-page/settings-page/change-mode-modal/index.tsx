import { Button, Form, Input, Modal, Select, Typography, message } from "antd"
import { ChangeModeModalProps } from "./types"
import styles from "./styles.module.scss"
import { useDispatch, useSelector } from "react-redux"
import { CONTENT } from "./constants"
import cn from "classnames"
import "./styles.scss"
import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import {
  OperationCategory,
  RateReasonType,
  TaxSystemType,
  api,
} from "../../../../api/myApi"
import dayjs from "dayjs"
import "dayjs/locale/ru"
import { TAX_SYSTEM } from "../constants"
import { RootState } from "../../../main-page/store"

export const ChangeModeModal = ({ isOpen, setOpen }: ChangeModeModalProps) => {
  const { Title, Text, Link } = Typography
  const dispatch = useDispatch()
  const token = Cookies.get("token")
  const headers = {
    Authorization: `Bearer ${token}`,
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

  const [income, setIncome] = useState(1)

  const [counterparty, setCounterparty] = useState("")
  const [direct, setDirect] = useState("")

  const [amount, setAmount] = useState(0)
  const [amountInput, setAmountInput] = useState("")

  const [dateOperation, setDateOperation] = useState("")
  const [document, setDocument] = useState("")

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

  useEffect(() => {
    if (dateOperation !== "") setDateError(false)
    else setDateError(true)
  }, [dateOperation])

  const user = useSelector((state: RootState) => state.user)
  const year = new Date().getFullYear()

  const yearsOptions = [
    {
      value: user.data.tax_date_begin?.split("-")[0],
      label: user.data.tax_date_begin?.split("-")[0],
    },
    { value: year, label: year },
  ].filter((option, index, self) => {
    const isUnique =
      self.findIndex(
        (o) => o.value == option.value && o.label == option.label
      ) === index

    return isUnique
  })

  const systemOptions = [
    { label: "УСН Доходы", value: TaxSystemType.UsnD },
    { label: "УСН Доходы - Расходы", value: TaxSystemType.UsnDR },
    { label: "Патент", value: TaxSystemType.Patent },
    { label: "ЕСХН", value: TaxSystemType.Eshn },
    { label: "Общая система НО", value: TaxSystemType.Osn },
  ]

  const [rateOptions, setRateOptions] = useState(
    Array.from({ length: 7 }, (_, index) => ({
      label: `${index}%`,
      value: index,
    }))
  )

  const justificationOptions = [
    { label: "Предприниматель Крыма и Севастополя", value: "crimea" },
    { label: "Налоговые каникулы", value: "holidays" },
    { label: "Другое", value: "nothing" },
  ]

  const [selectedYear, setSelectedYear] = useState(year)
  const [selectedTaxSystem, setSelectedTaxSystem] =
    useState<TaxSystemType | null>(
      (user.data.tax_system as TaxSystemType) || null
    )
  const [selectedTaxRate, setSelectedTaxRate] = useState<number | null>(
    user.data.tax_rate ? user.data.tax_rate : null
  )
  const [selectedReason, setSelectedReason] = useState<string | null>(null)
  const [selectedReasonType, setSelectedReasonType] =
    useState<RateReasonType | null>(
      user.data.rate_reason == "3462010" || user.data.rate_reason == "3462020"
        ? RateReasonType.Nothing
        : user.data.rate_reason == "3462030"
        ? RateReasonType.Crimea
        : user.data.rate_reason == "3462040"
        ? RateReasonType.TaxHolidays
        : null
    )

  const [selectedArticle, setSelectedArticle] = useState("")
  const [selectedParagraph, setSelectedParagraph] = useState("")
  const [selectedSubparagraph, setSelectedSubparagraph] = useState("")

  useEffect(() => {
    if (selectedArticle !== "")
      setSelectedReason(
        selectedArticle + selectedParagraph + selectedSubparagraph
      )
    else setSelectedReason(null)
  }, [selectedArticle, selectedParagraph, selectedSubparagraph])

  useEffect(() => {
    if (selectedTaxSystem === TaxSystemType.UsnD)
      setRateOptions(
        Array.from({ length: 7 }, (_, index) => ({
          label: `${index}%`,
          value: index,
        }))
      )
    if (selectedTaxSystem === TaxSystemType.UsnDR)
      setRateOptions(
        Array.from({ length: 16 }, (_, index) => ({
          label: `${index}%`,
          value: index,
        }))
      )
  }, [selectedTaxSystem])

  const onSave = async () => {
    try {
      await api.users.changeTaxUsersChangeTaxPut(
        {
          year: selectedYear,
          tax_system: selectedTaxSystem
            ? selectedTaxSystem
            : TaxSystemType.UsnD,
          tax_rate: selectedTaxRate,
          reason_type: selectedReasonType,
          rate_reason: selectedReason,
        },
        { headers }
      )
      successProcess()
    } catch (error) {
      failedProcess()
    } finally {
      closeModal()
    }
  }

  const [isButtonDisabled, setIsButtonDisabled] = useState(true)

  useEffect(() => {
    if (
      ((selectedTaxSystem === TaxSystemType.UsnD ||
        selectedTaxSystem === TaxSystemType.UsnDR) &&
        selectedTaxRate !== null &&
        selectedReason !== null &&
        selectedReasonType !== null &&
        selectedYear !== 0) ||
      ((selectedTaxSystem === TaxSystemType.Eshn ||
        selectedTaxSystem === TaxSystemType.Osn ||
        selectedTaxSystem === TaxSystemType.Patent) &&
        selectedYear !== 0)
    )
      setIsButtonDisabled(false)
    else setIsButtonDisabled(true)
  }, [
    selectedYear,
    selectedTaxSystem,
    selectedTaxRate,
    selectedReason,
    selectedReasonType,
  ])

  return (
    <>
      {contextHolder}
      <Modal
        open={isOpen}
        style={{
          borderRadius: "0",
        }}
        onOk={() => {
          setOpen(false)
        }}
        mask={false}
        onCancel={() => {
          setOpen(false)
        }}
        footer={null}
        className={cn(styles["ant-modal"], "modal-payment")}
      >
        <div className={styles["modal-style"]}>
          <div className={styles["modal-inner"]}>
            <div className={styles["operation-inner"]}>
              <Title level={2}>{CONTENT.HEADING_MODAL}</Title>
              <div className={styles["input-item"]}>
                <Text
                  className={cn(
                    styles["text-description"],
                    styles["default-text"]
                  )}
                >
                  {CONTENT.SELECT_PERIOD_TITLE}
                  <Text className={styles["necessary"]}>
                    {" " + CONTENT.NECESSARY}
                  </Text>
                </Text>
                <Form.Item
                  className={styles["form-inn"]}
                  validateStatus={counterpartyError ? "error" : ""} // Устанавливаем статус ошибки в 'error' при наличии ошибки
                  help={
                    counterpartyError ? (
                      <div>
                        <Text className={styles["error-text"]}>
                          {CONTENT.SELECT_PERIOD_TITLE}
                        </Text>
                      </div>
                    ) : (
                      ""
                    )
                  }
                >
                  <Select
                    style={{ borderRadius: "4px" }}
                    value={selectedYear}
                    options={yearsOptions}
                    onChange={(value) => setSelectedYear(value)}
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
                  {CONTENT.SELECT_SYSTEM_TITLE}
                  <Text className={styles["necessary"]}>
                    {" " + CONTENT.NECESSARY}
                  </Text>
                </Text>
                <Form.Item
                  className={styles["form-inn"]}
                  validateStatus={counterpartyError ? "error" : ""} // Устанавливаем статус ошибки в 'error' при наличии ошибки
                  help={
                    counterpartyError ? (
                      <div>
                        <Text className={styles["error-text"]}>
                          {CONTENT.SELECT_SYSTEM_TITLE}
                        </Text>
                      </div>
                    ) : (
                      ""
                    )
                  }
                >
                  <Select
                    style={{ borderRadius: "4px" }}
                    value={selectedTaxSystem}
                    options={systemOptions}
                    onChange={(value) => setSelectedTaxSystem(value)}
                  />
                </Form.Item>
              </div>
              {(selectedTaxSystem === TaxSystemType.UsnD ||
                selectedTaxSystem === TaxSystemType.UsnDR) && (
                <div className={styles["input-item"]}>
                  <Text
                    className={cn(
                      styles["text-description"],
                      styles["default-text"]
                    )}
                  >
                    {CONTENT.SELECT_TAX_RATE_TITLE}
                    <Text className={styles["necessary"]}>
                      {" " + CONTENT.NECESSARY}
                    </Text>
                  </Text>
                  <Form.Item
                    className={styles["form-inn"]}
                    validateStatus={counterpartyError ? "error" : ""} // Устанавливаем статус ошибки в 'error' при наличии ошибки
                    help={
                      counterpartyError ? (
                        <div>
                          <Text className={styles["error-text"]}>
                            {CONTENT.SELECT_TAX_RATE_TITLE}
                          </Text>
                        </div>
                      ) : (
                        ""
                      )
                    }
                  >
                    <Select
                      style={{ borderRadius: "4px" }}
                      value={selectedTaxRate}
                      options={rateOptions}
                      onChange={(value) => setSelectedTaxRate(value)}
                    />
                  </Form.Item>
                </div>
              )}
              {((selectedTaxSystem === TaxSystemType.UsnD &&
                selectedTaxRate !== null &&
                selectedTaxRate < 6) ||
                (selectedTaxSystem === TaxSystemType.UsnDR &&
                  selectedTaxRate !== null &&
                  selectedTaxRate < 14)) && (
                <>
                  <Title level={4} className={styles["justify-heading"]}>
                    {CONTENT.JUSTIFICATION_TITLE}
                  </Title>
                  <div className={styles["description-inner"]}>
                    <Text
                      className={cn(
                        styles["text-description"],
                        styles["default-text"]
                      )}
                    >
                      {CONTENT.FIRST_JUSTIFICATION_DESCRIPTION}
                    </Text>
                    <Text
                      className={cn(
                        styles["text-description"],
                        styles["default-text"]
                      )}
                    >
                      {CONTENT.SECOND_JUSTIFICATION_DESCRIPTION}
                    </Text>
                  </div>
                  <div className={styles["input-item"]}>
                    <Text
                      className={cn(
                        styles["text-description"],
                        styles["default-text"]
                      )}
                    >
                      {CONTENT.SELECT_JUSTIFICATION_TITLE}
                      <Text className={styles["necessary"]}>
                        {" " + CONTENT.NECESSARY}
                      </Text>
                    </Text>
                    <Form.Item
                      className={styles["form-inn"]}
                      validateStatus={counterpartyError ? "error" : ""} // Устанавливаем статус ошибки в 'error' при наличии ошибки
                      help={
                        counterpartyError ? (
                          <div>
                            <Text className={styles["error-text"]}>
                              {CONTENT.SELECT_TAX_RATE_TITLE}
                            </Text>
                          </div>
                        ) : (
                          ""
                        )
                      }
                    >
                      <Select
                        style={{ borderRadius: "4px" }}
                        value={selectedReasonType}
                        options={justificationOptions}
                        onChange={(value) => {
                          setSelectedReasonType(value)
                        }}
                      />
                    </Form.Item>
                  </div>

                  <div className={styles["inputs-row"]}>
                    <div className={styles["input-item"]}>
                      <Text
                        className={cn(
                          styles["text-description"],
                          styles["default-text"]
                        )}
                      >
                        {CONTENT.INPUT_ARTICLE_TITLE}
                        <Text className={styles["necessary"]}>
                          {" " + CONTENT.NECESSARY}
                        </Text>
                      </Text>
                      <Form.Item
                        className={styles["form-inn"]}
                        validateStatus={counterpartyError ? "error" : ""} // Устанавливаем статус ошибки в 'error' при наличии ошибки
                        help={
                          counterpartyError ? (
                            <div>
                              <Text className={styles["error-text"]}>
                                {CONTENT.INPUT_ARTICLE_TITLE}
                              </Text>
                            </div>
                          ) : (
                            ""
                          )
                        }
                      >
                        <Input
                          placeholder={CONTENT.INPUT_PLACEHOLDER}
                          style={{ borderRadius: "4px" }}
                          value={selectedArticle}
                          onChange={(event) => {
                            const inputValue = event.target.value.replace(
                              /[^\d./-]/g,
                              ""
                            )
                            setSelectedArticle(inputValue)
                          }}
                          maxLength={4}
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
                        {CONTENT.INPUT_PARAGRAPH_TITLE}
                      </Text>
                      <Form.Item
                        className={styles["form-inn"]}
                        validateStatus={counterpartyError ? "error" : ""} // Устанавливаем статус ошибки в 'error' при наличии ошибки
                        help={
                          counterpartyError ? (
                            <div>
                              <Text className={styles["error-text"]}>
                                {CONTENT.INPUT_PARAGRAPH_TITLE}
                              </Text>
                            </div>
                          ) : (
                            ""
                          )
                        }
                      >
                        <Input
                          placeholder={CONTENT.INPUT_PLACEHOLDER}
                          style={{ borderRadius: "4px" }}
                          value={selectedParagraph}
                          onChange={(event) => {
                            const inputValue = event.target.value.replace(
                              /[^\d./-]/g,
                              ""
                            )
                            setSelectedParagraph(inputValue)
                          }}
                          maxLength={4}
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
                        {CONTENT.INPUT_SUBPARAGRAPH_TITLE}
                      </Text>
                      <Form.Item
                        className={styles["form-inn"]}
                        validateStatus={counterpartyError ? "error" : ""} // Устанавливаем статус ошибки в 'error' при наличии ошибки
                        help={
                          counterpartyError ? (
                            <div>
                              <Text className={styles["error-text"]}>
                                {CONTENT.INPUT_SUBPARAGRAPH_TITLE}
                              </Text>
                            </div>
                          ) : (
                            ""
                          )
                        }
                      >
                        <Input
                          placeholder={CONTENT.INPUT_PLACEHOLDER}
                          style={{ borderRadius: "4px" }}
                          value={selectedSubparagraph}
                          onChange={(event) => {
                            const inputValue = event.target.value.replace(
                              /[^\d./-]/g,
                              ""
                            )
                            setSelectedSubparagraph(inputValue)
                          }}
                          maxLength={4}
                        />
                      </Form.Item>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className={styles["footer-button"]}>
              <Button className={styles["cancel-button"]} onClick={closeModal}>
                {CONTENT.BUTTON_CANCEL}
              </Button>
              <Button
                className={styles["save-button"]}
                disabled={isButtonDisabled}
                onClick={onSave}
              >
                {CONTENT.BUTTON_SAVE}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}
