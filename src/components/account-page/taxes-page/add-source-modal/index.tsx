import {
  Button,
  DatePicker,
  Form,
  Input,
  InputRef,
  Modal,
  Typography,
  message,
} from "antd"
import { AddSourceModalProps } from "./types"
import styles from "./styles.module.scss"
import "./styles.scss"
import {
  CreateAccountResponse,
  CreateSourceResponse,
  LeadReason,
  MarketplaceKey as MarketplaceName,
  OFDSource,
  api,
} from "../../../../api/myApi"
import Cookies from "js-cookie"
import { CONTENT } from "./constants"
import { BankBalanceIcon } from "../type-operation/icons/bank_balance"
import { OnlineCashierIcon } from "../type-operation/icons/online-cashier"
import { MarketplaceIcon } from "../type-operation/icons/marketplace"
import { RefObject, useEffect, useRef, useState } from "react"
import Dragger from "antd/es/upload/Dragger"
import { DownloadOutlined, ArrowLeftOutlined } from "@ant-design/icons"
import alpha from "./bank-logos/alpha.png"
import tinkoff from "./bank-logos/tinkoff.png"
import tochka from "./bank-logos/tochka.jpeg"
import hais from "./bank-logos/hais.png"
import modul from "./bank-logos/modul.png"
import firstofd from "./bank-logos/firstofd.png"
import kontur from "./bank-logos/kontur.png"
import ofdru from "./bank-logos/ofdru.png"
import ozon from "./bank-logos/ozon.png"
import platform from "./bank-logos/platform.png"
import sbis from "./bank-logos/sbis.png"
import taxcom from "./bank-logos/taxcom.png"
import wb from "./bank-logos/wb.png"
import yamarket from "./bank-logos/yamarket.png"
import yaofd from "./bank-logos/yaofd.png"
import { RcFile } from "antd/lib/upload"
import { FileLoadingIcon } from "../images/file-loading"
import { FileLoadedIcon } from "../images/file-loaded"
import cn from "classnames"
import { formatDateString } from "../../actions-page/utils"
import { CloseSaveModal } from "./close-save-modal"
import { isErrorResponse } from "./utils"
import { FileErrorIcon } from "../images/file-error"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../../main-page/store"
import { fetchSourcesInfo } from "../../client/sources/thunks"
import Link from "antd/es/typography/Link"
import { useMediaQuery } from "@react-hook/media-query"
import { PencilIcon } from "../type-operation/icons/pencil"
import { PencilBigIcon } from "../type-operation/icons/pencil-big"
import { ButtonOne } from "../../../../ui-kit/button"
import { InputOne } from "../../../../ui-kit/input"
import ru_RU from "antd/lib/date-picker/locale/ru_RU"
import dayjs from "dayjs"
import "dayjs/locale/ru"
import {
  convertDateFormat,
  convertReverseFormat,
  numberWithSpaces,
} from "../../actions-page/payment-modal/utils"
import { antdMonths } from "../../../../ui-kit/datepicker/localization"
import { LoadFileIcon } from "../type-operation/icons/load-file"
import { LoadApiIcon } from "../type-operation/icons/load-api"
import { LoadManualIcon } from "../type-operation/icons/load-manual"

export const AddSourceModal = ({
  isOpen,
  setOpen,
  setAddOperation,
  completedSource,
  setCompletedSource,
  failedBankBik,
  failedSubName,
  setMarketplaceOperation,
  fetchSourcesHand,
}: AddSourceModalProps) => {
  const { Title, Text } = Typography
  const token = Cookies.get("token")
  const headers = {
    Authorization: `Bearer ${token}`,
  }

  const dateFormat = "DD.MM.YYYY"

  dayjs.locale("ru")

  const locale = {
    ...ru_RU,
    lang: {
      ...ru_RU.lang,
      shortMonths: antdMonths.monthsShort,
      dateFormat: dateFormat,
    },
  }

  const dispatch = useDispatch<AppDispatch>()
  const [fileIsLoading, setFileIsLoading] = useState("")
  const [fileName, setFileName] = useState("")

  const [messageApi, contextHolder] = message.useMessage()
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

  const [buttonMode, setButtonMode] = useState("default")
  const [errorText, setErrorText] = useState("")

  const [accountFromFile, setAccountFromFile] = useState<
    CreateAccountResponse | CreateSourceResponse | null
  >(null)

  const handleFileUpload = async (file: RcFile) => {
    try {
      const data = {
        account_file: file,
      }

      const response =
        await api.operations.createOperationsFromFileOperationsFilePost(data, {
          headers,
        })
      setAccountFromFile(response.data)
      setFileIsLoading("loaded")
      successProcess("Файл успешно загружен!")
      await fetchSourcesHand()
    } catch (error) {
      if (isErrorResponse(error)) {
        setErrorText(error.error.detail.message)
        console.log(error.error.detail.message)
        setFileIsLoading("error")
      }
      console.error("Ошибка загрузки файла:", error)
      errorProcess("Ошибка загрузки файла. Пожалуйста, повторите попытку.")
    }
  }

  const [isCloseSave, setIsCloseSave] = useState(false)

  const [bankToIntegrate, setBankToIntegrate] = useState("")

  const handleAlpha = () => {
    setBankToIntegrate("alpha")
  }

  const handleOtherBank = () => {
    setBankToIntegrate("other")
  }

  const sendAlphaSource = async () => {
    const data = {
      integration_type: 2,
    }
    try {
      await api.sources.createUserAccountIntegrationSourcesAccountIntegrationPost(
        data,
        { headers }
      )
      await fetchSourcesHand()
    } catch (error) {
      errorProcess(CONTENT.NOTIFICATION_INTEGRATE_ALPHA_FAILED)
    } finally {
      setOpen(false)
    }
  }

  const { data: currentUser } = useSelector((state: RootState) => state.user)

  const [integrateLogin, setIntegrateLogin] = useState("")
  const [integratePassword, setIntegratePassword] = useState("")
  const [integrateBik, setIntegrateBik] = useState("")
  const [integrateAccount, setIntegrateAccount] = useState("")
  const [isIntegrateButtonDisabled, setIsIntegrateButtonDisabled] =
    useState(true)

  const closeModal = () => {
    setOpen(false)
    setAccountFromFile(null)
    setButtonMode("default")
    setFileIsLoading("")
    setFileName("")
    setErrorText("")
    setBankToIntegrate("")
    setIntegrateAccount("")
    setIntegrateBik("")
    setIntegrateLogin("")
    setIntegratePassword("")
    setMarketplaceMode("")
    setOfdMode("")
    setOtherMarketplace("")
    setOtherOfd("")
    setCompletedSource(null)
    setIntegrateBikError(false)
    setIntegrateAccountError(false)
    setIntegrateAccount("")
    setIntegratePasswordError(false)
    setIntegrateLoginError(false)
    setMarketplaceLoadWindow("")
    setMarketplaceKey("")
    setMarketplaceId("")
    setMarketplaceIdError(false)
    setMarketplaceKeyError(false)
    setDateMarketPlace("")
    setDateMarketplaceError(false)
    setSaldo(0)
    setSaldoInput("")
    setSaldoError(false)
  }

  const closeAddSource = () => {
    if (fileIsLoading === "loading") setIsCloseSave(true)
    else closeModal()
  }

  const sendOtherSource = async () => {
    const data = {
      integration_type: 1,
      account_credentials: {
        login: integrateLogin,
        password: integratePassword,
      },
      account_details: {
        bank_bik: integrateBik,
        account_number: integrateAccount,
      },
    }
    try {
      await api.sources.createUserAccountIntegrationSourcesAccountIntegrationPost(
        data,
        { headers }
      )
      await fetchSourcesHand()
      successProcess(CONTENT.NOTIFICATION_PROCESSING_SUCCESS)
    } catch (error) {
      errorProcess(CONTENT.NOTIFICATION_INTEGRATE_OTHER_FAILED)
    } finally {
      closeModal()
    }
  }

  const [marketplaceLogin, setMarketplaceLogin] = useState("login")
  const [marketplacePassword, setMarketplacePassword] = useState("password")

  const sendMarketplaceXls = async (file: RcFile) => {
    const data = {
      sync_type: 1,
      source_name:
        marketplaceMode === "3"
          ? MarketplaceName.Ozon
          : marketplaceMode === "2"
          ? MarketplaceName.Wb
          : MarketplaceName.YaMarket,

      marketplace_file: file,
    }
    try {
      await api.sources.createClientMarketplaceSourcesMarketplacePost(
        data,

        {
          headers,
        }
      )
      await fetchSourcesHand()
      successProcess(CONTENT.NOTIFICATION_PROCESSING_SUCCESS)
    } catch (error) {
      errorProcess(CONTENT.NOTIFICATION_YANDEX_LINK_FAILED)
    } finally {
      closeModal()
    }
  }

  const sendYandexMarketplaceSource = async () => {
    const data = {
      shop_id: marketplaceId,
      sync_type: 3,
      source_name: MarketplaceName.YaMarket,
      date_begin: convertDateFormat(dateMarketPlace),
    }
    try {
      await api.sources.createClientMarketplaceSourcesMarketplacePost(
        data,

        {
          headers,
        }
      )
      await fetchSourcesHand()
      successProcess(CONTENT.NOTIFICATION_PROCESSING_SUCCESS)
    } catch (error) {
      errorProcess(CONTENT.NOTIFICATION_YANDEX_LINK_FAILED)
    } finally {
      closeModal()
    }
  }
  const sendOtherMarketplaceSource = async (type: number) => {
    const data =
      saldo !== 0
        ? marketplaceMode === "2"
          ? {
              date_begin: convertDateFormat(dateMarketPlace),
              sync_type: type,
              saldo: saldo,
              password: marketplaceKey,
              source_name: MarketplaceName.Wb,
            }
          : {
              date_begin: convertDateFormat(dateMarketPlace),
              sync_type: type,
              saldo: saldo,
              password: marketplaceKey,
              source_name:
                marketplaceMode === "3"
                  ? MarketplaceName.Ozon
                  : marketplaceMode === "2"
                  ? MarketplaceName.Wb
                  : MarketplaceName.YaMarket,
              shop_id:
                marketplaceMode === "3"
                  ? marketplaceId
                  : marketplaceMode === "2"
                  ? undefined
                  : marketplaceId,
            }
        : marketplaceMode === "2"
        ? {
            date_begin: convertDateFormat(dateMarketPlace),
            sync_type: type,

            password: marketplaceKey,
            source_name: MarketplaceName.Wb,
          }
        : {
            date_begin: convertDateFormat(dateMarketPlace),
            sync_type: type,

            password: marketplaceKey,
            source_name:
              marketplaceMode === "3"
                ? MarketplaceName.Ozon
                : marketplaceMode === "2"
                ? MarketplaceName.Wb
                : MarketplaceName.YaMarket,
            shop_id:
              marketplaceMode === "3"
                ? marketplaceId
                : marketplaceMode === "2"
                ? undefined
                : marketplaceId,
          }

    try {
      await api.sources.createClientMarketplaceSourcesMarketplacePost(
        data,

        {
          headers,
        }
      )
      await fetchSourcesHand()
      successProcess(CONTENT.NOTIFICATION_PROCESSING_SUCCESS)
    } catch (error) {
      errorProcess(CONTENT.NOTIFICATION_INTEGRATE_OTHER_FAILED)
    } finally {
      closeModal()
    }
  }

  const sendOFDSource = async (file: RcFile, ofd_source: OFDSource) => {
    try {
      const response = await api.sources.createClientOfdSourcesOfdPost(
        { ofd_file: file, ofd_type: 1, ofd_source },
        undefined,
        {
          headers,
        }
      )
      setAccountFromFile(response.data)
      setFileIsLoading("loaded")
      successProcess("Файл успешно загружен!")
      await fetchSourcesHand()
    } catch (error) {
      if (isErrorResponse(error)) {
        setErrorText(error.error.detail.message)
        console.log(error.error.detail.message)
        setFileIsLoading("error")
      }
      console.error("Ошибка загрузки файла:", error)
      errorProcess("Ошибка загрузки файла. Пожалуйста, повторите попытку.")
    }
  }

  const [ofdLogin, setOfdLogin] = useState("")
  const [ofdPassword, setOfdPassword] = useState("")
  const [ofdLoginError, setOfdLoginError] = useState(false)
  const [ofdPasswordError, setOfdPasswordError] = useState(false)
  const isMobile = useMediaQuery("(max-width: 1023px)")

  const sendApiOFDSource = async (ofd_source: OFDSource) => {
    try {
      await api.sources.createClientOfdSourcesOfdPost(
        { ofd_type: 2, ofd_source },
        {
          login: ofdLogin,
          password: ofdPassword,
          date_begin: convertDateFormat(dateSource),
        },
        {
          headers,
        }
      )
      dispatch(fetchSourcesInfo())
      successProcess(CONTENT.NOTIFICATION_PROCESSING_SUCCESS)
    } catch (error) {
      errorProcess(CONTENT.NOTIFICATION_INTEGRATE_OTHER_FAILED)
    } finally {
      closeModal()
    }
  }

  const [ofdMode, setOfdMode] = useState<OFDSource | "" | "other">("")
  const [otherOfd, setOtherOfd] = useState("")

  const [marketplaceMode, setMarketplaceMode] = useState("")
  const [marketplaceId, setMarketplaceId] = useState("")
  const [marketplaceKey, setMarketplaceKey] = useState("")

  const [marketplaceIdError, setMarketplaceIdError] = useState(false)
  const [marketplaceKeyError, setMarketplaceKeyError] = useState(false)

  const [otherMarketplace, setOtherMarketplace] = useState("")

  const [integrateLoginError, setIntegrateLoginError] = useState(false)
  const [integratePasswordError, setIntegratePasswordError] = useState(false)
  const [integrateBikError, setIntegrateBikError] = useState(false)
  const [integrateAccountError, setIntegrateAccountError] = useState(false)

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

  const [isButtonMarketplaceDisabled, setIsButtonMarketplaceDisabled] =
    useState(true)

  const [isOfdButtonDisabled, setIsOfdButtonDisabled] = useState(true)

  useEffect(() => {
    if (completedSource !== null) {
      if (completedSource === 1) setButtonMode("bank_statement")
    }
    if (completedSource === 2) {
      setButtonMode("online_cashier")
    }
    if (completedSource === 3) {
      setButtonMode("bank_integration")
    }
    if (completedSource === 4) {
      setButtonMode("online_cashier")
    }
    if (completedSource === 5) {
      setButtonMode("marketplace_integration")
    }
  }, [completedSource])

  const [bankName, setBankName] = useState("")

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
      } catch (error) {}
    }
    if (integrateBik.length === 9) getBankName()
    else setBankName("")
  }, [integrateBik])

  const [marketplaceLoadWindow, setMarketplaceLoadWindow] = useState("")

  const [dateSource, setDateSource] = useState("")
  const [dateError, setDateError] = useState(false)

  const [dateMarketPlace, setDateMarketPlace] = useState("")
  const [dateMarketPlaceError, setDateMarketplaceError] = useState(false)

  const nextInput = useRef<InputRef>(null)

  const [saldo, setSaldo] = useState(0)
  const [saldoInput, setSaldoInput] = useState("")
  const [saldoError, setSaldoError] = useState(false)
  const handleChangeSaldo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = e.target
    const amount = inputValue.replace(/\s/g, "")
    const reg = /^-?\d+(\.\d{0,2})?$/

    if (reg.test(amount) || amount === "-" || amount === "") {
      setSaldoInput(numberWithSpaces(amount))
      if (amount[amount.length - 1] !== ".") setSaldo(parseFloat(amount))

      if (amount === "") setSaldo(0)
    }
    if (parseFloat(amount) > 0 && inputValue !== "") setSaldoError(false)
    else setSaldoError(true)
  }

  useEffect(() => {
    if (ofdLogin !== "" && ofdPassword !== "" && dateSource !== "")
      setIsOfdButtonDisabled(false)
    else setIsOfdButtonDisabled(true)
  }, [ofdLogin, ofdPassword, dateSource])

  useEffect(() => {
    if (marketplaceMode === "3")
      if (
        marketplaceId !== "" &&
        marketplaceKey !== "" &&
        dateMarketPlace !== ""
      )
        setIsButtonMarketplaceDisabled(false)
      else setIsButtonMarketplaceDisabled(true)
    else if (marketplaceMode === "2")
      if (marketplaceKey !== "" && dateMarketPlace !== "")
        setIsButtonMarketplaceDisabled(false)
      else setIsButtonMarketplaceDisabled(true)
  }, [marketplaceId, marketplaceKey, marketplaceMode, dateMarketPlace])

  useEffect(() => {
    if (
      integrateLogin !== "" &&
      integratePassword !== "" &&
      integrateBik.length == 9 &&
      integrateAccount.length == 20 &&
      !integrateAccountError
    )
      setIsIntegrateButtonDisabled(false)
    else setIsIntegrateButtonDisabled(true)
  }, [
    integrateLogin,
    integratePassword,
    integrateBik,
    integrateAccount,
    integrateAccountError,
  ])

  const sendNewMarketplace = async () => {
    try {
      await api.users.saveUserLeadUsersLeadPut(
        {
          description: otherMarketplace,
          reason: LeadReason.Marketplace,
        },
        { headers }
      )
      dispatch(fetchSourcesInfo())
      successProcess(CONTENT.NOTIFICATION_PROCESSING_SUCCESS)
    } catch (error) {
      errorProcess(CONTENT.NOTIFICATION_INTEGRATE_OTHER_FAILED)
    } finally {
      closeModal()
    }
  }

  const sendNewOfd = async () => {
    try {
      await api.users.saveUserLeadUsersLeadPut(
        {
          description: otherOfd,
          reason: LeadReason.Ofd,
        },
        { headers }
      )
      dispatch(fetchSourcesInfo())
      successProcess(CONTENT.NOTIFICATION_PROCESSING_SUCCESS)
    } catch (error) {
      errorProcess(CONTENT.NOTIFICATION_INTEGRATE_OTHER_FAILED)
    } finally {
      closeModal()
    }
  }

  return (
    <>
      {contextHolder}
      <Modal
        style={
          isMobile
            ? {
                top: 0,
                marginTop: "20px",
              }
            : undefined
        }
        open={isOpen}
        onOk={closeAddSource}
        onCancel={closeAddSource}
        footer={null}
        className="modal-source"
      >
        {buttonMode === "default" ? (
          <div className={styles["list-wrapper"]}>
            <Text
              className={styles["text-heading-add-data"]}
              style={{ marginTop: "0", marginBottom: "24px" }}
            >
              {CONTENT.TITLE_ADD_SOURCE}
            </Text>
            <div className={styles["main-buttons-wrapper"]}>
              <Button
                onClick={() => {
                  setAddOperation(true)
                  setOpen(false)
                }}
                className={styles["button-source-item"]}
              >
                <PencilBigIcon />
                <div className={styles["button-source-inner"]}>
                  <Text className={styles["bank-title"]}>
                    {CONTENT.TITLE_MANUAL_LOAD}
                  </Text>
                  <Text className={styles["text-description-button"]}>
                    {CONTENT.DESCRIPTION_MANUAL_LOAD}
                  </Text>
                </div>
              </Button>
              <Button
                onClick={() => {
                  setButtonMode("bank_statement")
                }}
                className={styles["button-source-item"]}
              >
                <BankBalanceIcon />
                <div className={styles["button-source-inner"]}>
                  <Text className={styles["bank-title"]}>
                    {CONTENT.TITLE_BANK_STATEMENT}
                  </Text>
                  <Text className={styles["text-description-button"]}>
                    {CONTENT.DESCRIPTION_BANK_STATEMENT}
                  </Text>
                </div>
              </Button>
              <Button
                onClick={() => {
                  setButtonMode("bank_integration")
                }}
                className={styles["button-source-item"]}
              >
                <BankBalanceIcon />
                <div className={styles["button-source-inner"]}>
                  <Text className={styles["bank-title"]}>
                    {CONTENT.TITLE_BANK_INTEGRATION}
                  </Text>
                  <Text className={styles["text-description-button"]}>
                    {CONTENT.DESCRIPTION_BANK_INTEGRATION}
                  </Text>
                </div>
              </Button>
              <Button
                onClick={() => {
                  setButtonMode("online_cashier")
                }}
                className={styles["button-source-item"]}
              >
                <OnlineCashierIcon />
                <div className={styles["button-source-inner"]}>
                  <Text className={styles["bank-title"]}>
                    {CONTENT.TITLE_ONLINE_CASHIER}
                  </Text>
                  <Text className={styles["text-description-button"]}>
                    {CONTENT.DESCRIPTION_ONLINE_CASHIER}
                  </Text>
                </div>
              </Button>
              <Button
                onClick={() => {
                  setButtonMode("marketplace_integration")
                }}
                className={styles["button-source-item"]}
              >
                <MarketplaceIcon />
                <div className={styles["button-source-inner"]}>
                  <Text className={styles["bank-title"]}>
                    {CONTENT.TITLE_MARKETPLACE_INTEGRATION}
                  </Text>
                  <Text className={styles["text-description-button"]}>
                    {CONTENT.DESCRIPTION_MARKETPLACE_INTEGRATION}
                  </Text>
                </div>
              </Button>
            </div>
          </div>
        ) : (
          <div className={styles["upload-wrapper"]}>
            <div className={styles["upload-title-wrapper"]}>
              <Text className={styles["title-modal"]}>
                {CONTENT.TITLE_ADD_SOURCE}
              </Text>
              {fileIsLoading !== "loaded" ? (
                <Text className={styles["text-title"]}>
                  {buttonMode === "bank_statement"
                    ? CONTENT.TEXT_UPLOAD_BANK_STATEMENT
                    : buttonMode === "bank_integration"
                    ? bankToIntegrate === ""
                      ? CONTENT.TEXT_UPLOAD_BANK_INTEGRATION
                      : bankToIntegrate === "alpha"
                      ? CONTENT.TEXT_ALPHA_INTEGRATE
                      : CONTENT.TEXT_OTHER_INTEGRATE
                    : buttonMode === "online_cashier"
                    ? ofdMode === ""
                      ? CONTENT.TEXT_UPLOAD_ONLINE_CASHIER
                      : ofdMode === OFDSource.ValueПервыйОФД ||
                        ofdMode === OFDSource.ValueОФДРу
                      ? CONTENT.TEXT_OFD_DESCRIPTION
                      : ofdMode === OFDSource.ValueПлатформаОФД ||
                        ofdMode === OFDSource.ValueЯндексОФД ||
                        ofdMode === OFDSource.ValueСБИСОФД ||
                        ofdMode === OFDSource.ValueТакскомОФД ||
                        ofdMode === OFDSource.ValueКонтурОФД
                      ? CONTENT.TEXT_OFD_DIFFERENT_DESCRIPTION
                      : ""
                    : marketplaceMode !== ""
                    ? marketplaceMode !== "4"
                      ? marketplaceMode === "1"
                        ? CONTENT.TILTE_YANDEX_INTEGRATE
                        : marketplaceLoadWindow === ""
                        ? CONTENT.TITLE_MARKETPLACE_PICK
                        : marketplaceLoadWindow === "1"
                        ? CONTENT.TITLE_MARKETPLACE_XLS
                        : CONTENT.TEXT_OTHER_INTEGRATE
                      : null
                    : CONTENT.TEXT_UPLOAD_MARKETPLACE_INTEGRATION}
                </Text>
              ) : (
                buttonMode === "bank_statement" && (
                  <div className={styles["account-data"]}>
                    <Text className={styles["text-title"]}>
                      {accountFromFile &&
                        "account_number" in accountFromFile &&
                        CONTENT.DATA_ACCOUNT +
                          (accountFromFile.account_number
                            ? accountFromFile.account_number
                            : "")}
                    </Text>
                    <Text className={styles["text-title"]}>
                      {accountFromFile &&
                        "account_number" in accountFromFile &&
                        CONTENT.DATA_BANKNAME +
                          (accountFromFile.bank_name
                            ? accountFromFile.bank_name
                            : "")}
                    </Text>
                    <Text className={styles["text-title"]}>
                      {accountFromFile &&
                        "start_date" in accountFromFile &&
                        CONTENT.DATA_STATEMENT_BEGIN +
                          formatDateString(accountFromFile?.start_date)}
                    </Text>
                    <Text className={styles["text-title"]}>
                      {accountFromFile &&
                        "end_date" in accountFromFile &&
                        CONTENT.DATA_STATEMENT_END +
                          formatDateString(accountFromFile?.end_date)}
                    </Text>
                  </div>
                )
              )}
            </div>
            {buttonMode === "bank_statement" ? (
              <Dragger
                style={{
                  backgroundColor: "white",
                }}
                accept=".txt"
                showUploadList={false}
                maxCount={1}
                disabled={fileIsLoading === "loaded"}
                className={cn({
                  ["dragger-loading"]: fileIsLoading === "loading",
                  ["dragger-loaded"]: fileIsLoading === "loaded",
                  ["dragger-error"]: fileIsLoading === "error",
                })}
                customRequest={async ({ file, onSuccess, onError }) => {
                  try {
                    if (file instanceof Blob && file.type !== "text/plain") {
                      errorProcess(CONTENT.ERROR_TXT_FORMAT)
                      throw new Error("Разрешены только файлы .txt!")
                    }
                    const uploadFile = file as RcFile
                    setFileName(uploadFile.name)
                    setFileIsLoading("loading")
                    // Выполните загрузку файла
                    await handleFileUpload(uploadFile)

                    if (onSuccess) {
                      onSuccess({}, {} as XMLHttpRequest)
                    }
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  } catch (error: any) {
                    console.error("Ошибка загрузки файла:", error)

                    if (onError) {
                      onError(error as ProgressEvent<EventTarget>)
                    }
                  }
                }}
              >
                {fileIsLoading === "" ? (
                  <div className={styles["dragger-inner"]}>
                    <DownloadOutlined className={styles["upload-icon"]} />
                    <div className={styles["dragger-text"]}>
                      <Text
                        className={styles["text-title"]}
                        style={{ color: "#141414", textAlign: "center" }}
                      >
                        {isMobile
                          ? CONTENT.TEXT_UPLOAD_TITLE_MOBILE
                          : CONTENT.TEXT_UPLOAD_TITLE}
                      </Text>
                      <Text className={styles["text-description-dragger"]}>
                        {CONTENT.TEXT_UPLOAD_DESCRIPTION}
                      </Text>
                    </div>
                  </div>
                ) : fileIsLoading === "loading" ? (
                  <div className={styles["dragger-inner-loading"]}>
                    <FileLoadingIcon className={styles["loading-icon"]} />
                    <div className={styles["dragger-text"]}>
                      <Text
                        className={styles["text-title"]}
                        style={{ color: "#6159FF", textAlign: "center" }}
                      >
                        {CONTENT.TEXT_LOADING_TITLE}
                      </Text>
                      <Text className={styles["text-description-dragger"]}>
                        {fileName}
                      </Text>
                    </div>
                  </div>
                ) : fileIsLoading === "error" ? (
                  <div className={styles["dragger-inner"]}>
                    <FileErrorIcon />
                    <div className={styles["dragger-text"]}>
                      <Text
                        className={styles["text-title"]}
                        style={{ color: "#141414", textAlign: "center" }}
                      >
                        {CONTENT.TEXT_ERROR_TITLE}
                      </Text>
                      <Text className={styles["text-description-dragger"]}>
                        {errorText}
                      </Text>
                    </div>
                  </div>
                ) : (
                  <div className={styles["dragger-inner"]}>
                    <FileLoadedIcon />
                    <div className={styles["dragger-text"]}>
                      <Text
                        className={styles["text-title"]}
                        style={{ color: "#141414", textAlign: "center" }}
                      >
                        {CONTENT.TEXT_LOADED_TITLE}
                      </Text>
                      <Text className={styles["text-description-dragger"]}>
                        {CONTENT.TEXT_LOADED_DESCRIPTION}
                      </Text>
                    </div>
                  </div>
                )}
              </Dragger>
            ) : buttonMode === "bank_integration" ? (
              bankToIntegrate === "" ? (
                <div className={styles["bank-integration-wrapper"]}>
                  <div className={styles["bank-row"]}>
                    {/*<Button
                      className={styles["bank-item"]}
                      onClick={handleAlpha}
                    >
                      <div
                        className={styles["bank-logo"]}
                        style={{ backgroundImage: `url(${alpha})` }}
                      ></div>
                      <Text className={styles["bank-title"]}>
                        {CONTENT.BANK_ALPHA}
                      </Text>
              </Button>*/}
                    <Button
                      className={styles["bank-item"]}
                      onClick={handleOtherBank}
                    >
                      <div
                        className={styles["bank-logo"]}
                        style={{ backgroundImage: `url(${modul})` }}
                      ></div>
                      <Text className={styles["bank-title"]}>
                        {CONTENT.BANK_MODUL}
                      </Text>
                    </Button>

                    <Button
                      className={styles["bank-item"]}
                      onClick={handleOtherBank}
                    >
                      <div
                        className={styles["bank-logo"]}
                        style={{ backgroundImage: `url(${tinkoff})` }}
                      ></div>
                      <Text className={styles["bank-title"]}>
                        {CONTENT.BANK_TINKOFF}
                      </Text>
                    </Button>
                  </div>
                  <div
                    className={styles["bank-row"]}
                    //style={{ justifyContent: "flex-start" }}
                  >
                    <Button
                      className={styles["bank-item"]}
                      onClick={handleOtherBank}
                    >
                      <div
                        className={styles["bank-logo"]}
                        style={{ backgroundImage: `url(${tochka})` }}
                      ></div>
                      <Text className={styles["bank-title"]}>
                        {CONTENT.BANK_TOCHKA}
                      </Text>
                    </Button>
                    <Button
                      className={styles["bank-item"]}
                      onClick={handleOtherBank}
                    >
                      <div
                        className={styles["bank-logo"]}
                        style={{ backgroundImage: `url(${hais})` }}
                      ></div>
                      <Text className={styles["bank-title"]}>
                        {CONTENT.BANK_HAIS}
                      </Text>
                    </Button>
                  </div>
                </div>
              ) : bankToIntegrate === "alpha" ? (
                <div>
                  <Text className={styles["text-title"]}>
                    {CONTENT.ALPHA_INTEGRATE_DESCRIPTION}
                  </Text>
                  <div className={styles["buttons-generate"]}>
                    <ButtonOne
                      onClick={() => setBankToIntegrate("")}
                      className={styles["generate-back"]}
                      type="secondary"
                    >
                      <ArrowLeftOutlined
                        className={styles["arrow-left-icon"]}
                      />
                      <Text className={styles["button-back-text"]}>
                        {CONTENT.BUTTON_BACK}
                      </Text>
                    </ButtonOne>
                    <ButtonOne
                      onClick={sendAlphaSource}
                      className={styles["generate-button"]}
                    >
                      {CONTENT.BUTTON_GENERATE_LINK}
                    </ButtonOne>
                  </div>
                </div>
              ) : (
                <div className={styles["otherbanks-wrapper"]}>
                  <div className={styles["input-item"]}>
                    <Text
                      className={cn(
                        styles["text-description"],
                        styles["default-text"]
                      )}
                    >
                      {CONTENT.TEXT_LOGIN}
                      <Text className={styles["necessary"]}>
                        {CONTENT.NECESSARY}
                      </Text>
                    </Text>
                    <Form.Item
                      className={styles["form-inn"]}
                      validateStatus={integrateLoginError ? "error" : ""} // Устанавливаем статус ошибки в 'error' при наличии ошибки
                      help={
                        integrateLoginError ? (
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
                      <InputOne
                        value={integrateLogin}
                        placeholder={CONTENT.INPUT_PLACEHOLDER}
                        maxLength={225}
                        onChange={(event) => {
                          setIntegrateLogin(event.target.value)
                          if (event.target.value !== "")
                            setIntegrateLoginError(false)
                          else setIntegrateLoginError(true)
                        }}
                        id="integrateLogin"
                        autoComplete="off"
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
                      {CONTENT.TEXT_PASSWORD}
                      <Text className={styles["necessary"]}>
                        {CONTENT.NECESSARY}
                      </Text>
                    </Text>
                    <Form.Item
                      className={styles["form-inn"]}
                      validateStatus={integratePasswordError ? "error" : ""} // Устанавливаем статус ошибки в 'error' при наличии ошибки
                      help={
                        integratePasswordError ? (
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
                      <Input.Password
                        value={integratePassword}
                        maxLength={225}
                        placeholder={CONTENT.INPUT_PLACEHOLDER}
                        onChange={(event) => {
                          setIntegratePassword(event.target.value)
                          if (event.target.value !== "")
                            setIntegratePasswordError(false)
                          else setIntegratePasswordError(true)
                        }}
                        autoComplete="new-password"
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
                      {CONTENT.TEXT_BANK_BIK}
                      <Text className={styles["necessary"]}>
                        {CONTENT.NECESSARY}
                      </Text>
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
                      <InputOne
                        value={integrateBik}
                        placeholder={CONTENT.INPUT_PLACEHOLDER}
                        showCount
                        maxLength={9}
                        onChange={(event) => {
                          const numericValue = event.target.value.replace(
                            /\D/g,
                            ""
                          )
                          setIntegrateBik(numericValue)
                          if (event.target.value !== "")
                            setIntegrateBikError(false)
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
                      <Text className={styles["necessary"]}>
                        {CONTENT.NECESSARY}
                      </Text>
                    </Text>
                    <Form.Item
                      className={styles["form-inn"]}
                      validateStatus={integrateAccountError ? "error" : ""} // Устанавливаем статус ошибки в 'error' при наличии ошибки
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
                        ref={nextInput}
                        onChange={(event) => {
                          const numericValue = event.target.value.replace(
                            /\D/g,
                            ""
                          )
                          setIntegrateAccount(numericValue)
                          if (event.target.value === "")
                            setIntegrateAccountError(true)
                        }}
                      />
                    </Form.Item>
                  </div>
                  <div>
                    <Text
                      className={styles["text-title"]}
                      style={{ marginTop: "8px" }}
                    >
                      {CONTENT.TEXT_OTHER_INTEGRATE_DESCRIPTION}
                      {isMobile && (
                        <Link
                          className={styles["instructions"]}
                          style={{ color: "#6159ff" }}
                          target="_blink"
                          href="https://www.google.com/url?q=https://drive.google.com/drive/u/1/folders/1yFkiwQuDDGUrHxINyXWVs8x3wtf_aLw_&sa=D&source=docs&ust=1709622100158746&usg=AOvVaw10cI6RyE9EYj20GIbB9DCu"
                        >
                          {CONTENT.LINK_INSTRUCTIONS}
                        </Link>
                      )}
                    </Text>
                    {!isMobile && (
                      <Link
                        className={styles["instructions"]}
                        style={{ color: "#6159ff" }}
                        target="_blink"
                        href="https://www.google.com/url?q=https://drive.google.com/drive/u/1/folders/1yFkiwQuDDGUrHxINyXWVs8x3wtf_aLw_&sa=D&source=docs&ust=1709622100158746&usg=AOvVaw10cI6RyE9EYj20GIbB9DCu"
                      >
                        {CONTENT.LINK_INSTRUCTIONS}
                      </Link>
                    )}
                  </div>
                  <div className={styles["buttons-generate-inner"]}>
                    <ButtonOne
                      onClick={() => {
                        setBankToIntegrate("")
                        setIntegrateBikError(false)
                        setIntegrateBik("")
                        setIntegrateAccountError(false)
                        setIntegrateAccount("")
                        setIntegratePassword("")
                        setIntegratePasswordError(false)
                        setIntegrateLogin("")
                        setIntegrateLoginError(false)
                      }}
                      className={styles["generate-back"]}
                      type="secondary"
                    >
                      <ArrowLeftOutlined
                        className={styles["arrow-left-icon"]}
                      />
                      <Text className={styles["button-back-text"]}>
                        {CONTENT.BUTTON_BACK}
                      </Text>
                    </ButtonOne>
                    <ButtonOne
                      onClick={sendOtherSource}
                      className={styles["generate-button"]}
                      disabled={isIntegrateButtonDisabled}
                    >
                      {CONTENT.BUTTON_INTEGRATE_BANK}
                    </ButtonOne>
                  </div>
                </div>
              )
            ) : buttonMode === "online_cashier" ? (
              ofdMode === "" ? (
                !isMobile ? (
                  <div className={styles["bank-integration-wrapper"]}>
                    <div className={styles["bank-row"]}>
                      <Button
                        className={styles["cashier-item"]}
                        onClick={() => setOfdMode(OFDSource.ValueОФДРу)}
                      >
                        <div
                          className={styles["bank-logo"]}
                          style={{ backgroundImage: `url(${ofdru})` }}
                        ></div>
                        <Text className={styles["bank-title"]}>
                          {CONTENT.CASHIER_OFD}
                        </Text>
                      </Button>
                      <Button
                        className={styles["cashier-item"]}
                        onClick={() => setOfdMode(OFDSource.ValueПервыйОФД)}
                      >
                        <div
                          className={styles["bank-logo"]}
                          style={{ backgroundImage: `url(${firstofd})` }}
                        ></div>
                        <Text className={styles["bank-title"]}>
                          {CONTENT.CASHIER_FIRST}
                        </Text>
                      </Button>
                      <Button
                        className={styles["cashier-item"]}
                        onClick={() => setOfdMode(OFDSource.ValueПлатформаОФД)}
                      >
                        <div
                          className={styles["bank-logo"]}
                          style={{ backgroundImage: `url(${platform})` }}
                        ></div>
                        <Text className={styles["bank-title"]}>
                          {CONTENT.CASHIER_PLATFORM}
                        </Text>
                      </Button>
                    </div>
                    <div className={styles["bank-row"]}>
                      <Button
                        className={styles["cashier-item"]}
                        onClick={() => setOfdMode(OFDSource.ValueЯндексОФД)}
                      >
                        <div
                          className={styles["bank-logo"]}
                          style={{ backgroundImage: `url(${yaofd})` }}
                        ></div>
                        <Text className={styles["bank-title"]}>
                          {CONTENT.CASHIER_YANDEX}
                        </Text>
                      </Button>
                      <Button
                        className={styles["cashier-item"]}
                        onClick={() => setOfdMode(OFDSource.ValueСБИСОФД)}
                      >
                        <div
                          className={styles["bank-logo"]}
                          style={{ backgroundImage: `url(${sbis})` }}
                        ></div>
                        <Text className={styles["bank-title"]}>
                          {CONTENT.CASHIES_SBIS}
                        </Text>
                      </Button>
                      <Button
                        className={styles["cashier-item"]}
                        onClick={() => setOfdMode(OFDSource.ValueТакскомОФД)}
                      >
                        <div
                          className={styles["bank-logo"]}
                          style={{ backgroundImage: `url(${taxcom})` }}
                        ></div>
                        <Text className={styles["bank-title"]}>
                          {CONTENT.CASHIER_TAXCOM}
                        </Text>
                      </Button>
                    </div>
                    <div className={styles["bank-row"]}>
                      <Button
                        className={styles["cashier-item"]}
                        onClick={() => setOfdMode(OFDSource.ValueКонтурОФД)}
                      >
                        <div
                          className={styles["bank-logo"]}
                          style={{ backgroundImage: `url(${kontur})` }}
                        ></div>
                        <Text className={styles["bank-title"]}>
                          {CONTENT.CASHIER_KONTUR}
                        </Text>
                      </Button>
                      <Button
                        className={styles["cashier-item"]}
                        onClick={() => setOfdMode("other")}
                      >
                        <OnlineCashierIcon className={styles["bank-logo"]} />
                        <Text className={styles["bank-title"]}>
                          {CONTENT.CASHIER_OTHER}
                        </Text>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className={styles["bank-integration-wrapper"]}>
                    <div className={styles["bank-row"]}>
                      <Button
                        className={styles["cashier-item"]}
                        onClick={() => setOfdMode(OFDSource.ValueОФДРу)}
                      >
                        <div
                          className={styles["bank-logo"]}
                          style={{ backgroundImage: `url(${ofdru})` }}
                        ></div>
                        <Text className={styles["bank-title"]}>
                          {CONTENT.CASHIER_OFD}
                        </Text>
                      </Button>
                      <Button
                        className={styles["cashier-item"]}
                        onClick={() => setOfdMode(OFDSource.ValueПервыйОФД)}
                      >
                        <div
                          className={styles["bank-logo"]}
                          style={{ backgroundImage: `url(${firstofd})` }}
                        ></div>
                        <Text className={styles["bank-title"]}>
                          {CONTENT.CASHIER_FIRST}
                        </Text>
                      </Button>
                    </div>
                    <div className={styles["bank-row"]}>
                      <Button
                        className={styles["cashier-item"]}
                        onClick={() => setOfdMode(OFDSource.ValueПлатформаОФД)}
                      >
                        <div
                          className={styles["bank-logo"]}
                          style={{ backgroundImage: `url(${platform})` }}
                        ></div>
                        <Text className={styles["bank-title"]}>
                          {CONTENT.CASHIER_PLATFORM}
                        </Text>
                      </Button>
                      <Button
                        className={styles["cashier-item"]}
                        onClick={() => setOfdMode(OFDSource.ValueЯндексОФД)}
                      >
                        <div
                          className={styles["bank-logo"]}
                          style={{ backgroundImage: `url(${yaofd})` }}
                        ></div>
                        <Text className={styles["bank-title"]}>
                          {CONTENT.CASHIER_YANDEX}
                        </Text>
                      </Button>
                    </div>
                    <div className={styles["bank-row"]}>
                      <Button
                        className={styles["cashier-item"]}
                        onClick={() => setOfdMode(OFDSource.ValueСБИСОФД)}
                      >
                        <div
                          className={styles["bank-logo"]}
                          style={{ backgroundImage: `url(${sbis})` }}
                        ></div>
                        <Text className={styles["bank-title"]}>
                          {CONTENT.CASHIES_SBIS}
                        </Text>
                      </Button>
                      <Button
                        className={styles["cashier-item"]}
                        onClick={() => setOfdMode(OFDSource.ValueТакскомОФД)}
                      >
                        <div
                          className={styles["bank-logo"]}
                          style={{ backgroundImage: `url(${taxcom})` }}
                        ></div>
                        <Text className={styles["bank-title"]}>
                          {CONTENT.CASHIER_TAXCOM}
                        </Text>
                      </Button>
                    </div>

                    <div className={styles["bank-row"]}>
                      <Button
                        className={styles["cashier-item"]}
                        onClick={() => setOfdMode(OFDSource.ValueКонтурОФД)}
                      >
                        <div
                          className={styles["bank-logo"]}
                          style={{ backgroundImage: `url(${kontur})` }}
                        ></div>
                        <Text className={styles["bank-title"]}>
                          {CONTENT.CASHIER_KONTUR}
                        </Text>
                      </Button>
                      <Button
                        className={styles["cashier-item"]}
                        onClick={() => setOfdMode("other")}
                      >
                        <OnlineCashierIcon className={styles["bank-logo"]} />
                        <Text className={styles["bank-title"]}>
                          {CONTENT.CASHIER_OTHER}
                        </Text>
                      </Button>
                    </div>
                  </div>
                )
              ) : ofdMode === OFDSource.ValueОФДРу ||
                ofdMode === OFDSource.ValueПервыйОФД ? (
                <div className={styles["bank-integration-wrapper"]}>
                  <div className={styles["otherbanks-wrapper"]}>
                    <div className={styles["input-item"]}>
                      <Text
                        className={cn(
                          styles["text-description"],
                          styles["default-text"]
                        )}
                      >
                        {CONTENT.TEXT_OFD_LOGIN}{" "}
                        <Text className={styles["necessary"]}>
                          {CONTENT.NECESSARY}
                        </Text>
                      </Text>
                      <Form.Item
                        className={styles["form-inn"]}
                        validateStatus={ofdLoginError ? "error" : ""} // Устанавливаем статус ошибки в 'error' при наличии ошибки
                        help={
                          ofdLoginError ? (
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
                        <InputOne
                          value={ofdLogin}
                          id="ofdLogin"
                          onChange={(event) => {
                            setOfdLogin(event.target.value)
                            if (event.target.value !== "")
                              setOfdLoginError(false)
                            else setOfdLoginError(true)
                          }}
                          autoComplete="off"
                          placeholder={CONTENT.INPUT_PLACEHOLDER}
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
                        {CONTENT.TEXT_PASSWORD}{" "}
                        <Text className={styles["necessary"]}>
                          {CONTENT.NECESSARY}
                        </Text>
                      </Text>
                      <Form.Item
                        className={styles["form-inn"]}
                        validateStatus={ofdPasswordError ? "error" : ""} // Устанавливаем статус ошибки в 'error' при наличии ошибки
                        help={
                          ofdPasswordError ? (
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
                        <Input.Password
                          value={ofdPassword}
                          maxLength={225}
                          type="password"
                          onChange={(event) => {
                            setOfdPassword(event.target.value)
                            if (event.target.value !== "")
                              setOfdPasswordError(false)
                            else setOfdPasswordError(true)
                          }}
                          autoComplete="new-password"
                          placeholder={CONTENT.INPUT_PLACEHOLDER}
                          className="custom-password-input"
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
                                {CONTENT.INPUT_ERROR_HINT}
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
                            "picker-source",
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
                          value={
                            dateSource ? dayjs(dateSource, dateFormat) : null
                          }
                          onChange={(value, dateString) => {
                            typeof dateString === "string" &&
                              setDateSource(dateString)
                            if (dateString === "") setDateError(true)
                            else setDateError(false)
                          }}
                        />
                      </Form.Item>
                    </div>
                  </div>
                  <div>
                    <Text className={styles["text-title"]}>
                      {CONTENT.TEXT_OFD_SOURCE_DESCRIPTION}
                    </Text>
                    <Link
                      className={styles["instructions"]}
                      style={{ color: "#6159ff" }}
                      target="_blink"
                      href="https://www.google.com/url?q=https://drive.google.com/drive/u/1/folders/1yFkiwQuDDGUrHxINyXWVs8x3wtf_aLw_&sa=D&source=docs&ust=1709622100158746&usg=AOvVaw10cI6RyE9EYj20GIbB9DCu"
                    >
                      {CONTENT.LINK_INSTRUCTIONS}
                    </Link>
                  </div>
                  <div className={styles["buttons-generate"]}>
                    <ButtonOne
                      onClick={() => {
                        setOfdMode("")
                        setOfdPassword("")
                        setOfdLogin("")
                        setOfdLoginError(false)
                        setOfdPasswordError(false)
                        setDateError(false)
                        setDateSource("")
                      }}
                      className={styles["generate-back"]}
                      type="secondary"
                    >
                      <ArrowLeftOutlined
                        className={styles["arrow-left-icon"]}
                      />
                      <Text className={styles["button-back-text"]}>
                        {CONTENT.BUTTON_BACK}
                      </Text>
                    </ButtonOne>
                    <ButtonOne
                      onClick={() => sendApiOFDSource(ofdMode)}
                      className={styles["generate-button"]}
                      disabled={isOfdButtonDisabled}
                    >
                      {CONTENT.BUTTON_INTEGRATE_BANK}
                    </ButtonOne>
                  </div>
                </div>
              ) : ofdMode === OFDSource.ValueПлатформаОФД ||
                ofdMode === OFDSource.ValueЯндексОФД ||
                ofdMode === OFDSource.ValueСБИСОФД ||
                ofdMode === OFDSource.ValueТакскомОФД ||
                ofdMode === OFDSource.ValueКонтурОФД ? (
                <div>
                  <Dragger
                    style={{
                      backgroundColor: "white",
                    }}
                    accept=".xls, .xlsx"
                    showUploadList={false}
                    maxCount={1}
                    disabled={fileIsLoading === "loaded"}
                    className={cn({
                      ["dragger-loading"]: fileIsLoading === "loading",
                      ["dragger-loaded"]: fileIsLoading === "loaded",
                      ["dragger-error"]: fileIsLoading === "error",
                    })}
                    customRequest={async ({ file, onSuccess, onError }) => {
                      try {
                        if (!(file instanceof Blob)) {
                          throw new Error(
                            "Разрешены только файлы .xls и .xlsx!"
                          )
                        }
                        const uploadFile = file as unknown as RcFile
                        setFileName(uploadFile.name)

                        setFileIsLoading("loading")

                        await sendOFDSource(uploadFile, ofdMode)

                        if (onSuccess) {
                          onSuccess({}, {} as XMLHttpRequest)
                        }
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      } catch (error: any) {
                        console.error("Ошибка загрузки файла:", error)

                        if (onError) {
                          onError(error as ProgressEvent<EventTarget>)
                        }
                      }
                    }}
                  >
                    {fileIsLoading === "" ? (
                      <div className={styles["dragger-inner"]}>
                        <DownloadOutlined className={styles["upload-icon"]} />
                        <div className={styles["dragger-text"]}>
                          <Text
                            className={styles["text-title"]}
                            style={{ color: "#141414", textAlign: "center" }}
                          >
                            {isMobile
                              ? CONTENT.TEXT_UPLOAD_TITLE_MOBILE
                              : CONTENT.TEXT_UPLOAD_TITLE}
                          </Text>
                          <Text className={styles["text-description-dragger"]}>
                            {CONTENT.TEXT_UPLOAD_DESCRIPTION_OFD_XLSX}
                          </Text>
                        </div>
                      </div>
                    ) : fileIsLoading === "loading" ? (
                      <div className={styles["dragger-inner-loading"]}>
                        <FileLoadingIcon className={styles["loading-icon"]} />
                        <div className={styles["dragger-text"]}>
                          <Text
                            className={styles["text-title"]}
                            style={{ color: "#6159FF" }}
                          >
                            {CONTENT.TEXT_LOADING_TITLE}
                          </Text>
                          <Text className={styles["text-description-dragger"]}>
                            {fileName}
                          </Text>
                        </div>
                      </div>
                    ) : fileIsLoading === "error" ? (
                      <div className={styles["dragger-inner"]}>
                        <FileErrorIcon />
                        <div className={styles["dragger-text"]}>
                          <Text
                            className={styles["text-title"]}
                            style={{ color: "#141414" }}
                          >
                            {CONTENT.TEXT_ERROR_TITLE}
                          </Text>
                          <Text className={styles["text-description-dragger"]}>
                            {errorText}
                          </Text>
                        </div>
                      </div>
                    ) : (
                      <div className={styles["dragger-inner"]}>
                        <FileLoadedIcon />
                        <div className={styles["dragger-text"]}>
                          <Text
                            className={styles["text-title"]}
                            style={{ color: "#141414" }}
                          >
                            {CONTENT.TEXT_LOADED_TITLE}
                          </Text>
                          <Text className={styles["text-description-dragger"]}>
                            {CONTENT.TEXT_LOADED_DESCRIPTION}
                          </Text>
                        </div>
                      </div>
                    )}
                  </Dragger>
                  <div className={styles["buttons-generate"]}>
                    <ButtonOne
                      onClick={() => {
                        setOfdMode("")
                        setFileIsLoading("")
                        setFileName("")
                        setErrorText("")
                      }}
                      className={styles["generate-back"]}
                      type="secondary"
                    >
                      <ArrowLeftOutlined
                        className={styles["arrow-left-icon"]}
                      />
                      <Text className={styles["button-back-text"]}>
                        {CONTENT.BUTTON_BACK}
                      </Text>
                    </ButtonOne>
                  </div>
                </div>
              ) : (
                <div className={styles["ofd-wrapper"]}>
                  <Text className={styles["text-title-ofd"]}>
                    {CONTENT.TEXT_OFD_OTHER}
                  </Text>
                  <div className={styles["input-item"]}>
                    <Text
                      className={cn(
                        styles["text-description"],
                        styles["default-text"]
                      )}
                    >
                      {CONTENT.TEXT_OFD_OTHER_INPUT}
                    </Text>
                    <div className={styles["bank-row"]}>
                      <InputOne
                        placeholder={CONTENT.INPUT_PLACEHOLDER}
                        value={otherOfd}
                        maxLength={225}
                        onChange={(event) => setOtherOfd(event.target.value)}
                      />
                      <ButtonOne
                        type="secondary"
                        onClick={sendNewOfd}
                        disabled={otherOfd.length === 0}
                      >
                        <Text className={styles["button-back-text"]}>
                          {CONTENT.BUTTON_OFD_OTHER_SEND}
                        </Text>
                      </ButtonOne>
                    </div>
                  </div>
                  <div className={styles["divider"]}></div>
                  <Text className={styles["text-title-ofd"]}>
                    {CONTENT.TEXT_OFD_OTHER_DESCRIPTION}
                  </Text>
                  <div className={styles["buttons-generate"]}>
                    <ButtonOne
                      onClick={() => setOfdMode("")}
                      className={styles["generate-back"]}
                      type="secondary"
                    >
                      <ArrowLeftOutlined
                        className={styles["arrow-left-icon"]}
                      />
                      <Text className={styles["button-back-text"]}>
                        {CONTENT.BUTTON_BACK}
                      </Text>
                    </ButtonOne>
                    <ButtonOne
                      className={styles["generate-button"]}
                      onClick={() => {
                        closeModal()
                        setAddOperation(true)
                      }}
                    >
                      {CONTENT.BUTTON_OFD_OTHER_ADD}
                    </ButtonOne>
                  </div>
                </div>
              )
            ) : marketplaceMode === "" ? (
              <div className={styles["bank-integration-wrapper"]}>
                <div className={styles["bank-row"]}>
                  <Button
                    className={styles["bank-item"]}
                    onClick={() => setMarketplaceMode("3")}
                  >
                    <div
                      className={styles["bank-logo"]}
                      style={{ backgroundImage: `url(${ozon})` }}
                    ></div>
                    <Text className={styles["bank-title"]}>
                      {CONTENT.MARKETPLACE_OZON}
                    </Text>
                  </Button>
                  <Button
                    className={styles["bank-item"]}
                    onClick={() => setMarketplaceMode("2")}
                  >
                    <div
                      className={styles["bank-logo"]}
                      style={{ backgroundImage: `url(${wb})` }}
                    ></div>
                    <Text className={styles["bank-title"]}>
                      {CONTENT.MARKETPLACE_WB}
                    </Text>
                  </Button>
                </div>
                <div className={styles["bank-row"]}>
                  <Button
                    className={cn(styles["bank-item"], styles["yandex-button"])}
                    onClick={() => setMarketplaceMode("1")}
                  >
                    <div
                      className={styles["bank-logo"]}
                      style={{ backgroundImage: `url(${yamarket})` }}
                    ></div>
                    <Text className={styles["bank-title"]}>
                      {CONTENT.MARKETPLACE_YANDEX}
                    </Text>
                  </Button>
                  <Button
                    className={styles["bank-item"]}
                    onClick={() => setMarketplaceMode("4")}
                  >
                    <MarketplaceIcon className={styles["bank-logo"]} />
                    <Text className={styles["bank-title"]}>
                      {isMobile
                        ? CONTENT.MARKETPLACE_OTHER_SHORT
                        : CONTENT.MARKETPLACE_OTHER}
                    </Text>
                  </Button>
                </div>
              </div>
            ) : marketplaceMode === "3" ? (
              marketplaceLoadWindow === "" ? (
                <div className={styles["bank-integration-wrapper"]}>
                  <div className={styles["bank-row"]}>
                    <Button
                      className={styles["bank-item"]}
                      onClick={() => setMarketplaceLoadWindow("1")}
                    >
                      <LoadFileIcon />
                      <Text className={styles["bank-title"]}>
                        {CONTENT.LOAD_REPORT_XLS}
                      </Text>
                    </Button>
                    <Button
                      className={styles["bank-item"]}
                      onClick={() => setMarketplaceLoadWindow("2")}
                    >
                      <LoadApiIcon />
                      <Text className={styles["bank-title"]}>
                        {CONTENT.LOAD_API}
                      </Text>
                    </Button>
                  </div>
                  <div
                    className={styles["bank-row"]}
                    style={{ justifyContent: "flex-start" }}
                  >
                    {/*<Button
                      className={styles["bank-item"]}
                      onClick={() => {
                        setMarketplaceOperation(true)

                        setMarketplaceLoadWindow("")

                        setMarketplaceMode("")
                        setDateMarketPlace("")

                        closeModal()
                      }}
                    >
                      <LoadManualIcon />
                      <Text className={styles["bank-title"]}>
                        {CONTENT.LOAD_MANUAL}
                      </Text>
                    </Button>*/}
                  </div>
                  <div className={styles["buttons-generate"]}>
                    <ButtonOne
                      onClick={() => setMarketplaceMode("")}
                      className={cn(
                        styles["generate-back"],
                        styles["mobile-api-back"]
                      )}
                      type="secondary"
                    >
                      <ArrowLeftOutlined
                        className={styles["arrow-left-icon"]}
                      />
                      <Text className={styles["button-back-text"]}>
                        {CONTENT.BUTTON_BACK}
                      </Text>
                    </ButtonOne>
                  </div>
                </div>
              ) : marketplaceLoadWindow === "2" ? (
                <div className={styles["wrapper-marketplace"]}>
                  <div className={styles["input-item"]}>
                    <Text
                      className={cn(
                        styles["text-description"],
                        styles["default-text"]
                      )}
                    >
                      {CONTENT.TEXT_MARKETPLACE_ID_INPUT}
                      <Text className={styles["necessary"]}>
                        {CONTENT.NECESSARY}
                      </Text>
                    </Text>
                    <Form.Item
                      className={styles["form-inn"]}
                      validateStatus={marketplaceIdError ? "error" : ""} // Устанавливаем статус ошибки в 'error' при наличии ошибки
                      help={
                        marketplaceIdError ? (
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
                      <InputOne
                        value={marketplaceId}
                        placeholder={CONTENT.INPUT_PLACEHOLDER}
                        onChange={(event) => {
                          setMarketplaceId(event.target.value)
                          if (event.target.value !== "")
                            setMarketplaceIdError(false)
                          else setMarketplaceIdError(true)
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
                      {CONTENT.TEXT_MARKETPLACE_KEY_INPUT}
                      <Text className={styles["necessary"]}>
                        {CONTENT.NECESSARY}
                      </Text>
                    </Text>
                    <Form.Item
                      className={styles["form-inn"]}
                      validateStatus={marketplaceKeyError ? "error" : ""} // Устанавливаем статус ошибки в 'error' при наличии ошибки
                      help={
                        marketplaceKeyError ? (
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
                      <InputOne
                        value={marketplaceKey}
                        placeholder={CONTENT.INPUT_PLACEHOLDER}
                        onChange={(event) => {
                          setMarketplaceKey(event.target.value)
                          if (event.target.value !== "")
                            setMarketplaceKeyError(false)
                          else setMarketplaceKeyError(true)
                        }}
                      />
                    </Form.Item>
                  </div>
                  <div className={styles["input-item"]}>
                    <Text
                      className={cn(
                        styles["text-description"],
                        styles["default-text"],
                        styles["title-wrap"]
                      )}
                    >
                      {CONTENT.DATEPICKER_MARKETPLACE_TITLE}{" "}
                      <Text className={styles["necessary"]}>
                        {CONTENT.NECESSARY}
                      </Text>
                    </Text>
                    <Form.Item
                      className={styles["form-inn"]}
                      validateStatus={dateMarketPlaceError ? "error" : ""} // Устанавливаем статус ошибки в 'error' при наличии ошибки
                      help={
                        dateMarketPlaceError ? (
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
                      <DatePicker
                        placeholder={CONTENT.DATEPICKER_PLACEHOLDER}
                        style={{ borderRadius: "4px", height: "34px" }}
                        className={cn(
                          "picker-source",
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
                        value={
                          dateMarketPlace
                            ? dayjs(dateMarketPlace, dateFormat)
                            : null
                        }
                        onChange={(value, dateString) => {
                          typeof dateString === "string" &&
                            setDateMarketPlace(dateString)
                          if (dateString === "") setDateMarketplaceError(true)
                          else setDateMarketplaceError(false)
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
                      {CONTENT.INPUT_SALDO_TITLE}
                    </Text>
                    <Form.Item className={styles["form-inn"]}>
                      <InputOne
                        placeholder={CONTENT.INPUT_PLACEHOLDER}
                        value={saldoInput}
                        onChange={handleChangeSaldo}
                      />
                    </Form.Item>
                  </div>
                  <Text className={styles["text-title"]}>
                    {CONTENT.TEXT_MARKETPLACE_OZON_DESCRIPTION}
                    <Link
                      className={styles["instructions"]}
                      style={{ color: "#6159ff" }}
                      target="_blink"
                      href="https://www.google.com/url?q=https://drive.google.com/drive/u/1/folders/1yFkiwQuDDGUrHxINyXWVs8x3wtf_aLw_&sa=D&source=docs&ust=1709622100158746&usg=AOvVaw10cI6RyE9EYj20GIbB9DCu"
                    >
                      {CONTENT.LINK_INSTRUCTIONS}
                    </Link>
                  </Text>
                  <div className={styles["buttons-generate-inner"]}>
                    <ButtonOne
                      onClick={() => {
                        setMarketplaceKey("")
                        setMarketplaceId("")
                        setMarketplaceLoadWindow("")
                        setMarketplaceIdError(false)
                        setMarketplaceKeyError(false)
                        setDateMarketPlace("")
                        setDateMarketplaceError(false)
                        setSaldoInput("")
                        setSaldoError(false)
                        setSaldo(0)
                      }}
                      className={styles["generate-back"]}
                      type="secondary"
                    >
                      <ArrowLeftOutlined
                        className={styles["arrow-left-icon"]}
                      />
                      <Text className={styles["button-back-text"]}>
                        {CONTENT.BUTTON_BACK}
                      </Text>
                    </ButtonOne>
                    <ButtonOne
                      className={styles["generate-button"]}
                      onClick={() => sendOtherMarketplaceSource(2)}
                      disabled={isButtonMarketplaceDisabled}
                    >
                      {CONTENT.BUTTON_INTEGRATE_BANK}
                    </ButtonOne>
                  </div>
                </div>
              ) : marketplaceLoadWindow === "1" ? (
                <div className={styles["wrapper-marketplace"]}>
                  <Dragger
                    style={{
                      backgroundColor: "white",
                    }}
                    accept=".xls, .xlsx"
                    showUploadList={false}
                    maxCount={1}
                    disabled={fileIsLoading === "loaded"}
                    className={cn({
                      ["dragger-loading"]: fileIsLoading === "loading",
                      ["dragger-loaded"]: fileIsLoading === "loaded",
                      ["dragger-error"]: fileIsLoading === "error",
                    })}
                    customRequest={async ({ file, onSuccess, onError }) => {
                      try {
                        if (!(file instanceof Blob)) {
                          throw new Error(
                            "Разрешены только файлы .xls и .xlsx!"
                          )
                        }
                        const uploadFile = file as unknown as RcFile
                        setFileName(uploadFile.name)

                        setFileIsLoading("loading")

                        await sendMarketplaceXls(uploadFile)

                        if (onSuccess) {
                          onSuccess({}, {} as XMLHttpRequest)
                        }
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      } catch (error: any) {
                        console.error("Ошибка загрузки файла:", error)

                        if (onError) {
                          onError(error as ProgressEvent<EventTarget>)
                        }
                      }
                    }}
                  >
                    {fileIsLoading === "" ? (
                      <div className={styles["dragger-inner"]}>
                        <DownloadOutlined className={styles["upload-icon"]} />
                        <div className={styles["dragger-text"]}>
                          <Text
                            className={styles["text-title"]}
                            style={{ color: "#141414", textAlign: "center" }}
                          >
                            {isMobile
                              ? CONTENT.TEXT_UPLOAD_TITLE_MOBILE
                              : CONTENT.TEXT_UPLOAD_TITLE}
                          </Text>
                          <Text className={styles["text-description-dragger"]}>
                            {CONTENT.LOAD_MARKETPLACE_XLS}
                          </Text>
                        </div>
                      </div>
                    ) : fileIsLoading === "loading" ? (
                      <div className={styles["dragger-inner-loading"]}>
                        <FileLoadingIcon className={styles["loading-icon"]} />
                        <div className={styles["dragger-text"]}>
                          <Text
                            className={styles["text-title"]}
                            style={{ color: "#6159FF", textAlign: "center" }}
                          >
                            {CONTENT.TEXT_LOADING_TITLE}
                          </Text>
                          <Text className={styles["text-description-dragger"]}>
                            {fileName}
                          </Text>
                        </div>
                      </div>
                    ) : fileIsLoading === "error" ? (
                      <div className={styles["dragger-inner"]}>
                        <FileErrorIcon />
                        <div className={styles["dragger-text"]}>
                          <Text
                            className={styles["text-title"]}
                            style={{ color: "#141414", textAlign: "center" }}
                          >
                            {CONTENT.TEXT_ERROR_TITLE}
                          </Text>
                          <Text className={styles["text-description-dragger"]}>
                            {errorText}
                          </Text>
                        </div>
                      </div>
                    ) : (
                      <div className={styles["dragger-inner"]}>
                        <FileLoadedIcon />
                        <div className={styles["dragger-text"]}>
                          <Text
                            className={styles["text-title"]}
                            style={{ color: "#141414", textAlign: "center" }}
                          >
                            {CONTENT.TEXT_LOADED_TITLE}
                          </Text>
                          <Text className={styles["text-description-dragger"]}>
                            {CONTENT.TEXT_LOADED_DESCRIPTION}
                          </Text>
                        </div>
                      </div>
                    )}
                  </Dragger>
                  <div className={styles["buttons-generate"]}>
                    <ButtonOne
                      onClick={() => {
                        setMarketplaceLoadWindow("")
                        setFileIsLoading("")
                        setFileName("")
                        setErrorText("")
                      }}
                      className={styles["generate-back"]}
                      type="secondary"
                    >
                      <ArrowLeftOutlined
                        className={styles["arrow-left-icon"]}
                      />
                      <Text className={styles["button-back-text"]}>
                        {CONTENT.BUTTON_BACK}
                      </Text>
                    </ButtonOne>
                  </div>
                </div>
              ) : (
                <></>
              )
            ) : marketplaceMode === "2" ? (
              marketplaceLoadWindow === "" ? (
                <div className={styles["bank-integration-wrapper"]}>
                  <div className={styles["bank-row"]}>
                    <Button
                      className={styles["bank-item"]}
                      onClick={() => setMarketplaceLoadWindow("1")}
                    >
                      <LoadFileIcon />
                      <Text className={styles["bank-title"]}>
                        {CONTENT.LOAD_REPORT_XLS}
                      </Text>
                    </Button>
                    <Button
                      className={styles["bank-item"]}
                      onClick={() => setMarketplaceLoadWindow("2")}
                    >
                      <LoadApiIcon />
                      <Text className={styles["bank-title"]}>
                        {CONTENT.LOAD_API}
                      </Text>
                    </Button>
                  </div>
                  <div
                    className={styles["bank-row"]}
                    style={{ justifyContent: "flex-start" }}
                  >
                    {/*<Button
                      className={styles["bank-item"]}
                      onClick={() => {
                        setMarketplaceOperation(true)
                        setMarketplaceLoadWindow("")
                        setMarketplaceMode("")
                        setDateMarketPlace("")
                        closeModal()
                      }}
                    >
                      <LoadManualIcon />
                      <Text className={styles["bank-title"]}>
                        {CONTENT.LOAD_MANUAL}
                      </Text>
                    </Button>*/}
                  </div>
                  <div className={styles["buttons-generate"]}>
                    <ButtonOne
                      onClick={() => setMarketplaceMode("")}
                      className={cn(
                        styles["generate-back"],
                        styles["mobile-api-back"]
                      )}
                      type="secondary"
                    >
                      <ArrowLeftOutlined
                        className={styles["arrow-left-icon"]}
                      />
                      <Text className={styles["button-back-text"]}>
                        {CONTENT.BUTTON_BACK}
                      </Text>
                    </ButtonOne>
                  </div>
                </div>
              ) : marketplaceLoadWindow === "1" ? (
                <div className={styles["wrapper-marketplace"]}>
                  <Dragger
                    style={{
                      backgroundColor: "white",
                    }}
                    accept=".xls, .xlsx"
                    showUploadList={false}
                    maxCount={1}
                    disabled={fileIsLoading === "loaded"}
                    className={cn({
                      ["dragger-loading"]: fileIsLoading === "loading",
                      ["dragger-loaded"]: fileIsLoading === "loaded",
                      ["dragger-error"]: fileIsLoading === "error",
                    })}
                    customRequest={async ({ file, onSuccess, onError }) => {
                      try {
                        if (!(file instanceof Blob)) {
                          throw new Error(
                            "Разрешены только файлы .xls и .xlsx!"
                          )
                        }
                        const uploadFile = file as unknown as RcFile
                        setFileName(uploadFile.name)

                        setFileIsLoading("loading")

                        await sendMarketplaceXls(uploadFile)

                        if (onSuccess) {
                          onSuccess({}, {} as XMLHttpRequest)
                        }
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      } catch (error: any) {
                        console.error("Ошибка загрузки файла:", error)

                        if (onError) {
                          onError(error as ProgressEvent<EventTarget>)
                        }
                      }
                    }}
                  >
                    {fileIsLoading === "" ? (
                      <div className={styles["dragger-inner"]}>
                        <DownloadOutlined className={styles["upload-icon"]} />
                        <div className={styles["dragger-text"]}>
                          <Text
                            className={styles["text-title"]}
                            style={{ color: "#141414", textAlign: "center" }}
                          >
                            {isMobile
                              ? CONTENT.TEXT_UPLOAD_TITLE_MOBILE
                              : CONTENT.TEXT_UPLOAD_TITLE}
                          </Text>
                          <Text className={styles["text-description-dragger"]}>
                            {CONTENT.LOAD_MARKETPLACE_XLS}
                          </Text>
                        </div>
                      </div>
                    ) : fileIsLoading === "loading" ? (
                      <div className={styles["dragger-inner-loading"]}>
                        <FileLoadingIcon className={styles["loading-icon"]} />
                        <div className={styles["dragger-text"]}>
                          <Text
                            className={styles["text-title"]}
                            style={{ color: "#6159FF", textAlign: "center" }}
                          >
                            {CONTENT.TEXT_LOADING_TITLE}
                          </Text>
                          <Text className={styles["text-description-dragger"]}>
                            {fileName}
                          </Text>
                        </div>
                      </div>
                    ) : fileIsLoading === "error" ? (
                      <div className={styles["dragger-inner"]}>
                        <FileErrorIcon />
                        <div className={styles["dragger-text"]}>
                          <Text
                            className={styles["text-title"]}
                            style={{ color: "#141414", textAlign: "center" }}
                          >
                            {CONTENT.TEXT_ERROR_TITLE}
                          </Text>
                          <Text className={styles["text-description-dragger"]}>
                            {errorText}
                          </Text>
                        </div>
                      </div>
                    ) : (
                      <div className={styles["dragger-inner"]}>
                        <FileLoadedIcon />
                        <div className={styles["dragger-text"]}>
                          <Text
                            className={styles["text-title"]}
                            style={{ color: "#141414", textAlign: "center" }}
                          >
                            {CONTENT.TEXT_LOADED_TITLE}
                          </Text>
                          <Text className={styles["text-description-dragger"]}>
                            {CONTENT.TEXT_LOADED_DESCRIPTION}
                          </Text>
                        </div>
                      </div>
                    )}
                  </Dragger>
                  <div className={styles["buttons-generate"]}>
                    <ButtonOne
                      onClick={() => {
                        setMarketplaceLoadWindow("")

                        setFileIsLoading("")
                        setFileName("")
                        setErrorText("")
                      }}
                      className={cn(styles["generate-back"])}
                      type="secondary"
                    >
                      <ArrowLeftOutlined
                        className={styles["arrow-left-icon"]}
                      />
                      <Text className={styles["button-back-text"]}>
                        {CONTENT.BUTTON_BACK}
                      </Text>
                    </ButtonOne>
                  </div>
                </div>
              ) : marketplaceLoadWindow === "2" ? (
                <div className={styles["wrapper-marketplace"]}>
                  <div className={styles["input-item"]}>
                    <Text
                      className={cn(
                        styles["text-description"],
                        styles["default-text"]
                      )}
                    >
                      {CONTENT.TEXT_MARKETPLACE_KEY_INPUT}
                      <Text className={styles["necessary"]}>
                        {CONTENT.NECESSARY}
                      </Text>
                    </Text>
                    <Form.Item
                      className={styles["form-inn"]}
                      validateStatus={marketplaceKeyError ? "error" : ""} // Устанавливаем статус ошибки в 'error' при наличии ошибки
                      help={
                        marketplaceKeyError ? (
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
                      <InputOne
                        value={marketplaceKey}
                        placeholder={CONTENT.INPUT_PLACEHOLDER}
                        onChange={(event) => {
                          setMarketplaceKey(event.target.value)
                          if (event.target.value !== "")
                            setMarketplaceKeyError(false)
                          else setMarketplaceKeyError(true)
                        }}
                      />
                    </Form.Item>
                  </div>
                  <div className={styles["input-item"]}>
                    <Text
                      className={cn(
                        styles["text-description"],
                        styles["default-text"],
                        styles["title-wrap"]
                      )}
                    >
                      {CONTENT.DATEPICKER_MARKETPLACE_TITLE}{" "}
                      <Text className={styles["necessary"]}>
                        {CONTENT.NECESSARY}
                      </Text>
                    </Text>
                    <Form.Item
                      className={styles["form-inn"]}
                      validateStatus={dateMarketPlaceError ? "error" : ""} // Устанавливаем статус ошибки в 'error' при наличии ошибки
                      help={
                        dateMarketPlaceError ? (
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
                      <DatePicker
                        placeholder={CONTENT.DATEPICKER_PLACEHOLDER}
                        style={{ borderRadius: "4px", height: "34px" }}
                        className={cn(
                          "picker-source",
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
                        value={
                          dateMarketPlace
                            ? dayjs(dateMarketPlace, dateFormat)
                            : null
                        }
                        onChange={(value, dateString) => {
                          typeof dateString === "string" &&
                            setDateMarketPlace(dateString)
                          if (dateString === "") setDateMarketplaceError(true)
                          else setDateMarketplaceError(false)
                        }}
                      />
                    </Form.Item>
                    <div className={styles["input-item"]}>
                      <Text
                        className={cn(
                          styles["text-description"],
                          styles["default-text"]
                        )}
                      >
                        {CONTENT.INPUT_SALDO_TITLE}
                      </Text>
                      <Form.Item className={styles["form-inn"]}>
                        <InputOne
                          placeholder={CONTENT.INPUT_PLACEHOLDER}
                          value={saldoInput}
                          onChange={handleChangeSaldo}
                        />
                      </Form.Item>
                    </div>
                  </div>
                  <Text className={styles["text-title"]}>
                    {CONTENT.TEXT_MARKETPLACE_WB_DESCRIPTION}
                    <Link
                      className={styles["instructions"]}
                      style={{ color: "#6159ff" }}
                      target="_blink"
                      href="https://www.google.com/url?q=https://drive.google.com/drive/u/1/folders/1yFkiwQuDDGUrHxINyXWVs8x3wtf_aLw_&sa=D&source=docs&ust=1709622100158746&usg=AOvVaw10cI6RyE9EYj20GIbB9DCu"
                    >
                      {CONTENT.LINK_INSTRUCTIONS}
                    </Link>
                  </Text>
                  <div className={styles["buttons-generate"]}>
                    <ButtonOne
                      onClick={() => {
                        setMarketplaceLoadWindow("")

                        setMarketplaceKey("")
                        setMarketplaceKeyError(false)
                        setDateMarketPlace("")
                        setDateMarketplaceError(false)
                        setSaldo(0)
                        setSaldoInput("")
                        setSaldoError(false)
                      }}
                      className={styles["generate-back"]}
                      type="secondary"
                    >
                      <ArrowLeftOutlined
                        className={styles["arrow-left-icon"]}
                      />
                      <Text className={styles["button-back-text"]}>
                        {CONTENT.BUTTON_BACK}
                      </Text>
                    </ButtonOne>
                    <ButtonOne
                      className={styles["generate-button"]}
                      onClick={() => sendOtherMarketplaceSource(2)}
                      disabled={isButtonMarketplaceDisabled}
                    >
                      {CONTENT.BUTTON_INTEGRATE_BANK}
                    </ButtonOne>
                  </div>
                </div>
              ) : (
                <></>
              )
            ) : marketplaceMode === "1" ? (
              <div className={styles["wrapper-marketplace"]}>
                <div className={styles["input-item"]}>
                  <Text
                    className={cn(
                      styles["text-description"],
                      styles["default-text"]
                    )}
                  >
                    {CONTENT.TEXT_MARKETPLACE_YA_ID_INPUT}
                    <Text className={styles["necessary"]}>
                      {CONTENT.NECESSARY}
                    </Text>
                  </Text>
                  <Form.Item
                    className={styles["form-inn"]}
                    validateStatus={marketplaceIdError ? "error" : ""} // Устанавливаем статус ошибки в 'error' при наличии ошибки
                    help={
                      marketplaceIdError ? (
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
                    <InputOne
                      value={marketplaceId}
                      placeholder={CONTENT.INPUT_PLACEHOLDER}
                      onChange={(event) => {
                        setMarketplaceId(event.target.value)
                        if (event.target.value !== "")
                          setMarketplaceIdError(false)
                        else setMarketplaceIdError(true)
                      }}
                    />
                  </Form.Item>
                </div>
                <div className={styles["input-item"]}>
                  <Text
                    className={cn(
                      styles["text-description"],
                      styles["default-text"],
                      styles["title-wrap"]
                    )}
                  >
                    {CONTENT.LOAD_YANDEX_DATE}{" "}
                    <Text className={styles["necessary"]}>
                      {CONTENT.NECESSARY}
                    </Text>
                  </Text>
                  <Form.Item
                    className={styles["form-inn"]}
                    validateStatus={dateMarketPlaceError ? "error" : ""} // Устанавливаем статус ошибки в 'error' при наличии ошибки
                    help={
                      dateMarketPlaceError ? (
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
                    <DatePicker
                      style={{ borderRadius: "4px", height: "34px" }}
                      className={cn(
                        "picker-source",
                        styles["datepicker-style"]
                      )}
                      placeholder={CONTENT.DATEPICKER_PLACEHOLDER}
                      locale={locale}
                      minDate={
                        currentUser.tax_date_begin
                          ? dayjs(
                              convertReverseFormat(currentUser.tax_date_begin),
                              dateFormat
                            )
                          : undefined
                      }
                      maxDate={dayjs(formatDateString(), dateFormat)}
                      format={dateFormat}
                      value={
                        dateMarketPlace
                          ? dayjs(dateMarketPlace, dateFormat)
                          : null
                      }
                      onChange={(value, dateString) => {
                        typeof dateString === "string" &&
                          setDateMarketPlace(dateString)
                        if (dateString === "") setDateMarketplaceError(true)
                        else setDateMarketplaceError(false)
                      }}
                    />
                  </Form.Item>
                </div>
                <Text className={styles["text-title"]}>
                  {CONTENT.TEXT_MARKETPLACE_YANDEX_ONE}
                  <Text className={styles["bank-title"]}>
                    {CONTENT.TEXT_MARKETPLACE_YANDEX_TWO}
                  </Text>
                  {CONTENT.TEXT_MARKETPLACE_YANDEX_THREE}
                </Text>
                <Text
                  className={styles["text-title"]}
                  style={{ marginTop: "32px" }}
                >
                  {CONTENT.TEXT_MARKETPLACE_YANDEX_DESCRIPTION_ONE}
                  <Text className={styles["bank-title"]}>
                    {CONTENT.TEXT_MARKETPLACE_YANDEX_DESCRIPTION_TWO}
                  </Text>
                </Text>
                <div className={styles["buttons-generate"]}>
                  <ButtonOne
                    onClick={() => {
                      setMarketplaceMode("")
                      setMarketplaceLoadWindow("")
                      setDateMarketPlace("")
                      setMarketplaceId("")
                      setMarketplaceIdError(false)
                      setDateMarketplaceError(false)
                    }}
                    className={styles["generate-back"]}
                    type="secondary"
                  >
                    <ArrowLeftOutlined className={styles["arrow-left-icon"]} />
                    <Text className={styles["button-back-text"]}>
                      {CONTENT.BUTTON_BACK}
                    </Text>
                  </ButtonOne>
                  <ButtonOne
                    className={styles["generate-button"]}
                    onClick={sendYandexMarketplaceSource}
                    disabled={!(dateMarketPlace !== "" && marketplaceId !== "")}
                  >
                    {CONTENT.BUTTON_GENERATE_LINK}
                  </ButtonOne>
                </div>
              </div>
            ) : (
              <div className={styles["ofd-wrapper"]}>
                <Text className={styles["text-title-ofd"]}>
                  {CONTENT.TEXT_MARKETPLACE_OTHER}
                </Text>

                <div className={styles["input-item"]}>
                  <Text
                    className={cn(
                      styles["text-description"],
                      styles["default-text"]
                    )}
                  >
                    {CONTENT.TEXT_MARKETPLACE_OTHER_INPUT}
                  </Text>
                  <div className={styles["bank-row"]}>
                    <InputOne
                      value={otherMarketplace}
                      placeholder={CONTENT.INPUT_PLACEHOLDER}
                      onChange={(event) =>
                        setOtherMarketplace(event.target.value)
                      }
                    />
                    <ButtonOne
                      type="secondary"
                      onClick={sendNewMarketplace}
                      disabled={otherMarketplace.length === 0}
                    >
                      <Text className={styles["button-back-text"]}>
                        {CONTENT.BUTTON_OFD_OTHER_SEND}
                      </Text>
                    </ButtonOne>
                  </div>
                </div>
                <div className={styles["divider"]}></div>
                <Text className={styles["text-title-ofd"]}>
                  {CONTENT.TEXT_MARKETPLACE_OTHER_DESCRIPTION}
                </Text>
                <div className={styles["buttons-generate"]}>
                  <ButtonOne
                    onClick={() => setMarketplaceMode("")}
                    className={styles["generate-back"]}
                    type="secondary"
                  >
                    <ArrowLeftOutlined className={styles["arrow-left-icon"]} />
                    <Text className={styles["button-back-text"]}>
                      {CONTENT.BUTTON_BACK}
                    </Text>
                  </ButtonOne>
                  <ButtonOne
                    className={styles["generate-back"]}
                    onClick={() => {
                      closeModal()
                      setAddOperation(true)
                    }}
                  >
                    {CONTENT.BUTTON_OFD_OTHER_ADD}
                  </ButtonOne>
                </div>
              </div>
            )}

            {bankToIntegrate === "" &&
              ofdMode === "" &&
              marketplaceMode === "" && (
                <ButtonOne
                  onClick={() => {
                    setButtonMode("default")
                    setFileIsLoading("")
                    setFileName("")
                    setErrorText("")
                  }}
                  className={cn(
                    styles["generate-back"],

                    {
                      [styles["mobile-back"]]:
                        buttonMode === "bank_integration" ||
                        buttonMode === "marketplace_integration",

                      [styles["mobile-cashier-back"]]:
                        buttonMode === "online_cashier",
                    }
                  )}
                  type="secondary"
                >
                  <ArrowLeftOutlined className={styles["arrow-left-icon"]} />
                  <Text className={styles["button-back-text"]}>
                    {CONTENT.BUTTON_BACK}
                  </Text>
                </ButtonOne>
              )}
          </div>
        )}
      </Modal>
      <CloseSaveModal
        isOpen={isCloseSave}
        setOpen={setIsCloseSave}
        close={closeModal}
      />
    </>
  )
}
