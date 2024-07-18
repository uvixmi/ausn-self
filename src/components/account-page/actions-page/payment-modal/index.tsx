import {
  Button,
  ConfigProvider,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  Typography,
  message,
} from "antd"
import {
  PlusOutlined,
  CloseOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons"
import { ConfirmModalProps } from "./types"
import styles from "./styles.module.scss"
import locale from "antd/lib/date-picker/locale/ru_RU"
import { useDispatch, useSelector } from "react-redux"
import { CONTENT } from "./constants"
import cn from "classnames"
import "./styles.scss"
import dayjs from "dayjs"
import ru_RU from "antd/lib/date-picker/locale/ru_RU"
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
import { AppDispatch, RootState } from "../../../main-page/store"
import { api } from "../../../../api/myApi"
import Cookies from "js-cookie"
import {
  convertDateFormat,
  convertReverseFormat,
  isValidDate,
  numberWithSpaces,
} from "./utils"
import { compareDates, formatDateString } from "../utils"
import Link from "antd/es/typography/Link"
import { ButtonOne } from "../../../../ui-kit/button"
import { InputOne } from "../../../../ui-kit/input"
import { TrashNewIcon } from "../../taxes-page/type-operation/icons/trash-new-icon"
import { TrashWarningIcon } from "../../taxes-page/type-operation/icons/trash-warning-icon"
import { useMediaQuery } from "@react-hook/media-query"
import { antdMonths } from "../../../../ui-kit/datepicker/localization"
import { fetchCurrentUser } from "../../../authorization-page/slice"

export const PaymentModal = ({
  isOpen,
  setOpen,
  payAmount,
  fetchTasks,
  taskYear,
  openAnalysis,
}: ConfirmModalProps) => {
  const { Title, Text } = Typography
  dayjs.locale("ru")
  const dispatch = useDispatch<AppDispatch>()
  const [messageApi, contextHolder] = message.useMessage()
  const successProcess = () => {
    messageApi.open({
      type: "success",
      content: CONTENT.NOTIFICATION_PROCESSING_SUCCESS,
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

  dayjs.locale("ru")

  const dateFormat = "DD.MM.YYYY"

  const locale = {
    ...ru_RU,
    lang: {
      ...ru_RU.lang,
      shortMonths: antdMonths.monthsShort,
      dateFormat: dateFormat,
    },
  }

  const { payments } = useSelector((state: RootState) => state.payments)

  const [amountInputs, setAmountInputs] = useState([{ amountrrr: "" }])
  const [amountErrors, setAmountErrors] = useState([{ error: false }])
  const [datesErrors, setDatesErrors] = useState([{ error: false }])

  const handleAmount = (amountIn: string, index: number) => {
    const amount = amountIn.replace(/\s/g, "")
    const reg = /^-?\d+(\.\d{0,2})?$/
    if (reg.test(amount) || amount === "-" || amount === "") {
      setAmountInputs((prevAmountInputs) => {
        const updatedAmountInputs = [...prevAmountInputs]
        updatedAmountInputs[index] = {
          amountrrr: numberWithSpaces(amount),
        }

        return updatedAmountInputs
      })

      if (amount[amount.length - 1] !== ".") {
        dispatch(setAmount({ amount: amount, index }))
      }

      if (amount === "") dispatch(setAmount({ amount: "", index }))

      if (
        parseFloat(amount) > 0 &&
        parseFloat(amount) <= 9999999999999.99 &&
        amountIn !== ""
      )
        setAmountErrors((prevAmountErrors) => {
          const updatedAmountInputs = [...prevAmountErrors]
          updatedAmountInputs[index] = {
            error: false,
          }

          return updatedAmountInputs
        })
      else
        setAmountErrors((prevAmountErrors) => {
          const updatedAmountInputs = [...prevAmountErrors]
          updatedAmountInputs[index] = {
            error: true,
          }

          return updatedAmountInputs
        })
    }
  }

  const handleYear = (index: number) => {
    dispatch(setYear({ tax_period: taskYear, index }))
  }

  const handleDate = (date: string, index: number) => {
    dispatch(setDate({ date, index }))
    handleYear(index)
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

  const closeModal = () => {
    setOpen(false)
    setAmountInputs([{ amountrrr: "" }])
    setAmountErrors([{ error: false }])
    setDatesErrors([{ error: false }])
    dispatch(clear())
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
      closeModal()
      successProcess()
      dispatch(clear())
      fetchTasks()
    } catch (error) {
      errorProcess()
      closeModal()
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

  const {
    data: currentUser,
    loaded,
    loading,
  } = useSelector((state: RootState) => state.user)

  useEffect(() => {
    if (!loaded && loading !== "succeeded" && loading !== "loading")
      dispatch(fetchCurrentUser())
  }, [dispatch, loaded, loading])

  useEffect(() => {
    setAmountInputs([
      { amountrrr: numberWithSpaces(payAmount?.toString() || "") },
    ])
    setAmountErrors([{ error: false }])
    setDatesErrors([{ error: false }])
  }, [isOpen])

  useEffect(() => {
    const amountsPayments = payments.every((item) => item.amount !== 0)
    const datesPayments = payments.every(
      (item) =>
        item.date !== "" &&
        currentUser.tax_date_begin &&
        !compareDates(item.date, currentUser.tax_date_begin)
    )
    const amountsError = amountErrors.every((item) => item.error === false)
    if (amountsPayments && datesPayments && amountsError)
      setIsButtonDisabled(false)
    else setIsButtonDisabled(true)
  }, [amountErrors, currentUser.tax_date_begin, payments])

  const isMobile = useMediaQuery("(max-width: 1023px)")

  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            DatePicker: {
              cellActiveWithRangeBg: "#f0f0ff;",
              cellHoverWithRangeBg: "#6159FF",
              hoverBorderColor: "#8c8c8c",
              activeBorderColor: "#6159FF",
              colorTextDisabled: "#d1d1d1",
              fontFamily: "Inter",
              fontSize: 14,
            },
          },
        }}
      >
        {contextHolder}
        <Modal
          open={isOpen}
          centered={isMobile}
          style={{
            top: 0,
            marginRight: 0,
            borderRadius: "0",
          }}
          onOk={() => {
            closeModal()
          }}
          onCancel={() => {
            closeModal()
          }}
          footer={null}
          className={cn(styles["ant-modal"], "modal-payment-actions")}
        >
          <div className={styles["modal-style"]}>
            <div className={styles["modal-inner"]}>
              <div className={styles["payment-wrapper"]}>
                <div className={styles["title-description-header"]}>
                  <Text className={styles["title-text"]}>
                    {CONTENT.HEADING_MODAL}
                  </Text>
                  <Text className={styles["text-description-new"]}>
                    {CONTENT.DESCRIPTION_MODAL}
                  </Text>
                </div>
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
                {payments.map((item, index) => (
                  <div className={styles["payment-inner"]} key={index}>
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
                            setAmountErrors((prevAmountInputs) =>
                              prevAmountInputs.filter((_, i) => i !== index)
                            )
                            setDatesErrors((prevDatesInputs) =>
                              prevDatesInputs.filter((_, i) => i !== index)
                            )
                          }}
                        >
                          <TrashWarningIcon />
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
                          <Text className={styles["necessary"]}>
                            {CONTENT.NECESSARY}
                          </Text>
                        </Text>
                        <Form.Item
                          className={styles["form-inn"]}
                          validateStatus={
                            amountErrors[index]?.error ? "error" : ""
                          }
                          help={
                            amountErrors[index]?.error ? (
                              <div>
                                <Text className={styles["error-text"]}>
                                  {amountInputs[index]?.amountrrr === "0" ||
                                  amountInputs[index]?.amountrrr[0] === "-"
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
                            value={amountInputs[index]?.amountrrr}
                            placeholder={CONTENT.INPUT_PLACEHOLDER}
                            onChange={(event) =>
                              handleAmount(event.target.value, index)
                            }
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
                          {CONTENT.TEXT_DATE}
                          <Text className={styles["necessary"]}>
                            {CONTENT.NECESSARY}
                          </Text>
                        </Text>
                        <div className="picker-check">
                          <Form.Item
                            className={styles["form-inn"]}
                            validateStatus={
                              datesErrors[index]?.error ? "error" : ""
                            }
                            help={
                              datesErrors[index]?.error ? (
                                <div>
                                  <Text className={styles["error-text"]}>
                                    {item.date !== ""
                                      ? CONTENT.INPUT_FAULT_HINT
                                      : CONTENT.INPUT_ERROR_HINT}
                                  </Text>
                                </div>
                              ) : null
                            }
                          >
                            <DatePicker
                              style={{ borderRadius: "4px", height: "34px" }}
                              className={cn(styles["datepicker-style"])}
                              locale={locale}
                              format={dateFormat}
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
                              placeholder={CONTENT.DATEPICKER_PLACEHOLDER}
                              value={
                                item.date ? dayjs(item.date, dateFormat) : null
                              }
                              onChange={(value, dateString) => {
                                typeof dateString === "string" &&
                                  handleDate(dateString, index)
                                if (dateString === "") {
                                  setDatesErrors((prevAmountErrors) => {
                                    const updatedAmountInputs = [
                                      ...prevAmountErrors,
                                    ]
                                    updatedAmountInputs[index] = {
                                      error: true,
                                    }

                                    return updatedAmountInputs
                                  })
                                } else {
                                  setDatesErrors((prevAmountErrors) => {
                                    const updatedAmountInputs = [
                                      ...prevAmountErrors,
                                    ]
                                    updatedAmountInputs[index] = {
                                      error: false,
                                    }

                                    return updatedAmountInputs
                                  })
                                }

                                if (
                                  currentUser.tax_date_begin &&
                                  typeof dateString === "string" &&
                                  !compareDates(
                                    dateString,
                                    currentUser.tax_date_begin
                                  )
                                ) {
                                  setDatesErrors((prevAmountErrors) => {
                                    const updatedAmountInputs = [
                                      ...prevAmountErrors,
                                    ]
                                    updatedAmountInputs[index] = {
                                      error: false,
                                    }

                                    return updatedAmountInputs
                                  })
                                } else {
                                  setDatesErrors((prevAmountErrors) => {
                                    const updatedErrorInputs = [
                                      ...prevAmountErrors,
                                    ]
                                    updatedErrorInputs[index] = {
                                      error: true,
                                    }

                                    return updatedErrorInputs
                                  })
                                }
                              }}
                            />
                          </Form.Item>
                        </div>
                      </div>
                    </div>
                    {/*
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
                </div>*/}
                    <div className={styles["select-item"]}>
                      <Text
                        className={cn(
                          styles["text-description"],
                          styles["default-text"]
                        )}
                      >
                        {CONTENT.TEXT_PAYMENT_NUMBER}
                      </Text>
                      <InputOne
                        placeholder={CONTENT.INPUT_PLACEHOLDER}
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
                <ButtonOne
                  type="secondary"
                  className={styles["button-add-payment"]}
                  onClick={() => {
                    setAmountInputs([...amountInputs, { amountrrr: "" }])
                    setAmountErrors([...amountErrors, { error: false }])
                    setDatesErrors([...datesErrors, { error: false }])
                    dispatch(addPayment())
                  }}
                >
                  <PlusOutlined
                    className={styles["plus-icon"]}
                    style={{ marginInlineStart: "4px" }}
                  />
                  {CONTENT.BUTTON_ADD_PAYMENT}
                </ButtonOne>
              </div>
              <div className={styles["footer-button"]}>
                <ButtonOne onClick={handlePay} disabled={isButtonDisabled}>
                  {CONTENT.BUTTON_PAY_MORE}
                </ButtonOne>
                {/* <Text className={styles["remark-text"]}>
                  {CONTENT.TEXT_REMARK}
                </Text>*/}
              </div>
            </div>
          </div>
        </Modal>
      </ConfigProvider>
    </>
  )
}
