import { Button, Form, Input, Modal, Typography, message } from "antd"
import { AddSourceModalProps } from "./types"
import styles from "./styles.module.scss"
import "./styles.scss"
import {
  CreateAccountResponse,
  CreateSourceResponse,
  OFDSource,
  api,
} from "../../../../api/myApi"
import Cookies from "js-cookie"
import { CONTENT } from "./constants"
import { BankBalanceIcon } from "../type-operation/icons/bank_balance"
import { OnlineCashierIcon } from "../type-operation/icons/online-cashier"
import { MarketplaceIcon } from "../type-operation/icons/marketplace"
import { useEffect, useState } from "react"
import Dragger from "antd/es/upload/Dragger"
import { DownloadOutlined, ArrowLeftOutlined } from "@ant-design/icons"
import alpha from "./bank-logos/alpha.png"
import tinkoff from "./bank-logos/tinkoff.png"
import tochka from "./bank-logos/tochka.jpeg"
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

export const AddSourceModal = ({
  isOpen,
  setOpen,
  setAddOperation,
  completedSource,
  setCompletedSource,
  fetchSourcesHand,
}: AddSourceModalProps) => {
  const { Title, Text } = Typography
  const token = Cookies.get("token")
  const headers = {
    Authorization: `Bearer ${token}`,
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

  const closeModal = () => {
    setOpen(false)
    setAccountFromFile(null)
    setButtonMode("default")
    setFileIsLoading("")
    setFileName("")
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
  }

  const closeAddSource = () => {
    if (fileIsLoading === "loading") setIsCloseSave(true)
    else closeModal()
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

  useEffect(() => {
    if (
      integrateLogin !== "" &&
      integratePassword !== "" &&
      integrateBik.length == 9 &&
      integrateAccount.length == 20
    )
      setIsIntegrateButtonDisabled(false)
    else setIsIntegrateButtonDisabled(true)
  }, [integrateLogin, integratePassword, integrateBik, integrateAccount])

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
  const sendYandexMarketplaceSource = async () => {
    const data = {
      marketplace_type: 1,
    }
    try {
      await api.sources.createClientMarketplaceSourcesMarketplacePost(data, {
        headers,
      })
      await fetchSourcesHand()
      successProcess(CONTENT.NOTIFICATION_PROCESSING_SUCCESS)
    } catch (error) {
      errorProcess(CONTENT.NOTIFICATION_INTEGRATE_OTHER_FAILED)
    } finally {
      closeModal()
    }
  }
  const sendOtherMarketplaceSource = async (type: number) => {
    const data = {
      marketplace_type: type,
      marketplace_credentials: {
        login: marketplaceId,
        password: marketplaceKey,
      },
    }
    try {
      await api.sources.createClientMarketplaceSourcesMarketplacePost(data, {
        headers,
      })
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
  const isMobile = useMediaQuery("(max-width: 767px)")

  const sendApiOFDSource = async (ofd_source: OFDSource) => {
    try {
      await api.sources.createClientOfdSourcesOfdPost(
        { ofd_type: 2, ofd_source },
        {
          login: ofdLogin,
          password: ofdPassword,
          date_begin: currentUser.tax_date_begin,
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

  useEffect(() => {
    if (marketplaceMode === "3")
      if (marketplaceId !== "" && marketplaceKey !== "")
        setIsButtonMarketplaceDisabled(false)
      else setIsButtonMarketplaceDisabled(true)
    else if (marketplaceMode === "2")
      if (marketplaceKey !== "") setIsButtonMarketplaceDisabled(false)
      else setIsButtonMarketplaceDisabled(true)
  }, [marketplaceId, marketplaceKey, marketplaceMode])

  const [isOfdButtonDisabled, setIsOfdButtonDisabled] = useState(true)

  useEffect(() => {
    if (ofdLogin !== "" && ofdPassword !== "") setIsOfdButtonDisabled(false)
    else setIsOfdButtonDisabled(true)
  }, [ofdLogin, ofdPassword])

  useEffect(() => {
    if (completedSource !== null) {
      if (completedSource === 1) setButtonMode("bank_statement")
    }
    if (completedSource === 2) {
      setButtonMode("online_cashier")
    }
  }, [completedSource])

  return (
    <>
      {contextHolder}
      <Modal
        open={isOpen}
        onOk={closeAddSource}
        onCancel={closeAddSource}
        footer={null}
      >
        {buttonMode === "default" ? (
          <div className={styles["list-wrapper"]}>
            <Title level={3} style={{ marginTop: "0", marginBottom: "24px" }}>
              {CONTENT.TITLE_ADD_SOURCE}
            </Title>
            <Button
              onClick={() => {
                setButtonMode("bank_statement")
              }}
              className={styles["button-source-item"]}
            >
              <BankBalanceIcon />
              <div className={styles["button-source-inner"]}>
                <Title level={5} style={{ marginTop: "0", marginBottom: "0" }}>
                  {CONTENT.TITLE_BANK_STATEMENT}
                </Title>
                <Text className={styles["text-description"]}>
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
                <Title level={5} style={{ marginTop: "0", marginBottom: "0" }}>
                  {CONTENT.TITLE_BANK_INTEGRATION}
                </Title>
                <Text className={styles["text-description"]}>
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
                <Title level={5} style={{ marginTop: "0", marginBottom: "0" }}>
                  {CONTENT.TITLE_ONLINE_CASHIER}
                </Title>
                <Text className={styles["text-description"]}>
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
                <Title level={5} style={{ marginTop: "0", marginBottom: "0" }}>
                  {CONTENT.TITLE_MARKETPLACE_INTEGRATION}
                </Title>
                <Text className={styles["text-description"]}>
                  {CONTENT.DESCRIPTION_MARKETPLACE_INTEGRATION}
                </Text>
              </div>
            </Button>
          </div>
        ) : (
          <div className={styles["upload-wrapper"]}>
            <div className={styles["upload-title-wrapper"]}>
              <Title level={3} style={{ marginTop: "0", marginBottom: "0" }}>
                {CONTENT.TITLE_ADD_SOURCE}
              </Title>
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
                    ? CONTENT.TEXT_OTHER_INTEGRATE
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

                    // Убедитесь, что onError определен, прежде чем вызывать его
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
                        {CONTENT.TEXT_UPLOAD_TITLE}
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
                    style={{ justifyContent: "flex-start" }}
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
                  </div>
                </div>
              ) : bankToIntegrate === "alpha" ? (
                <div>
                  <Text className={styles["text-title"]}>
                    {CONTENT.ALPHA_INTEGRATE_DESCRIPTION}
                  </Text>
                  <div className={styles["buttons-generate"]}>
                    <Button
                      onClick={() => setBankToIntegrate("")}
                      className={styles["generate-back"]}
                    >
                      <ArrowLeftOutlined
                        className={styles["arrow-left-icon"]}
                      />
                      <Text className={styles["button-back-text"]}>
                        {CONTENT.BUTTON_BACK}
                      </Text>
                    </Button>
                    <Button
                      onClick={sendAlphaSource}
                      className={styles["generate-button"]}
                    >
                      {CONTENT.BUTTON_GENERATE_LINK}
                    </Button>
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
                      <Input
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
                      <Input
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
                      <Input
                        value={integrateAccount}
                        placeholder={CONTENT.INPUT_PLACEHOLDER}
                        maxLength={20}
                        showCount
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
                    <Text className={styles["text-title"]}>
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
                    <Button
                      onClick={() => setBankToIntegrate("")}
                      className={styles["generate-back"]}
                    >
                      <ArrowLeftOutlined
                        className={styles["arrow-left-icon"]}
                      />
                      <Text className={styles["button-back-text"]}>
                        {CONTENT.BUTTON_BACK}
                      </Text>
                    </Button>
                    <Button
                      onClick={sendOtherSource}
                      className={styles["generate-button"]}
                      disabled={isIntegrateButtonDisabled}
                    >
                      {CONTENT.BUTTON_INTEGRATE_BANK}
                    </Button>
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
                      <Input
                        value={ofdLogin}
                        id="ofdLogin"
                        onChange={(event) => setOfdLogin(event.target.value)}
                        autoComplete="off"
                      />
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
                      <Input
                        value={ofdPassword}
                        type="password"
                        onChange={(event) => setOfdPassword(event.target.value)}
                        autoComplete="new-password"
                      />
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
                    <Button
                      onClick={() => {
                        setOfdMode("")
                        setOfdPassword("")
                        setOfdLogin("")
                      }}
                      className={styles["generate-back"]}
                    >
                      <ArrowLeftOutlined
                        className={styles["arrow-left-icon"]}
                      />
                      <Text className={styles["button-back-text"]}>
                        {CONTENT.BUTTON_BACK}
                      </Text>
                    </Button>
                    <Button
                      onClick={() => sendApiOFDSource(ofdMode)}
                      className={styles["generate-button"]}
                      disabled={isOfdButtonDisabled}
                    >
                      {CONTENT.BUTTON_INTEGRATE_BANK}
                    </Button>
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
                            {CONTENT.TEXT_UPLOAD_TITLE}
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
                    <Button
                      onClick={() => setOfdMode("")}
                      className={styles["generate-back"]}
                    >
                      <ArrowLeftOutlined
                        className={styles["arrow-left-icon"]}
                      />
                      <Text className={styles["button-back-text"]}>
                        {CONTENT.BUTTON_BACK}
                      </Text>
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <Text className={styles["text-title"]}>
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
                      <Input
                        value={otherOfd}
                        onChange={(event) => setOtherOfd(event.target.value)}
                      />
                      <Button
                        className={styles["send-button"]}
                        onClick={closeModal}
                      >
                        <Text className={styles["button-back-text"]}>
                          {CONTENT.BUTTON_OFD_OTHER_SEND}
                        </Text>
                      </Button>
                    </div>
                  </div>
                  <Text className={styles["text-title"]}>
                    {CONTENT.TEXT_OFD_OTHER_DESCRIPTION}
                  </Text>
                  <div className={styles["buttons-generate"]}>
                    <Button
                      onClick={() => setOfdMode("")}
                      className={styles["generate-back"]}
                    >
                      <ArrowLeftOutlined
                        className={styles["arrow-left-icon"]}
                      />
                      <Text className={styles["button-back-text"]}>
                        {CONTENT.BUTTON_BACK}
                      </Text>
                    </Button>
                    <Button
                      className={styles["generate-button"]}
                      onClick={() => {
                        closeModal()
                        setAddOperation(true)
                      }}
                    >
                      {CONTENT.BUTTON_OFD_OTHER_ADD}
                    </Button>
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
                <div
                  className={styles["bank-row"]}
                  style={{ justifyContent: "flex-start" }}
                >
                  {/*<Button
                    className={styles["bank-item"]}
                    onClick={() => setMarketplaceMode("1")}
                  >
                    <div
                      className={styles["bank-logo"]}
                      style={{ backgroundImage: `url(${yamarket})` }}
                    ></div>
                    <Text className={styles["bank-title"]}>
                      {CONTENT.MARKETPLACE_YANDEX}
                    </Text>
            </Button>*/}
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
                  <Input
                    value={marketplaceId}
                    onChange={(event) => setMarketplaceId(event.target.value)}
                  />
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
                  <Input
                    value={marketplaceKey}
                    onChange={(event) => setMarketplaceKey(event.target.value)}
                  />
                </div>
                <Text className={styles["text-title"]}>
                  {CONTENT.TEXT_MARKETPLACE_OZON_DESCRIPTION}
                </Text>
                <div className={styles["buttons-generate-inner"]}>
                  <Button
                    onClick={() => {
                      setMarketplaceMode("")
                      setMarketplaceKey("")
                      setMarketplaceId("")
                    }}
                    className={styles["generate-back"]}
                  >
                    <ArrowLeftOutlined className={styles["arrow-left-icon"]} />
                    <Text className={styles["button-back-text"]}>
                      {CONTENT.BUTTON_BACK}
                    </Text>
                  </Button>
                  <Button
                    className={styles["generate-button"]}
                    onClick={() => sendOtherMarketplaceSource(3)}
                    disabled={isButtonMarketplaceDisabled}
                  >
                    {CONTENT.BUTTON_INTEGRATE_BANK}
                  </Button>
                </div>
              </div>
            ) : marketplaceMode === "2" ? (
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
                  <Input
                    value={marketplaceKey}
                    onChange={(event) => setMarketplaceKey(event.target.value)}
                  />
                </div>
                <Text className={styles["text-title"]}>
                  {CONTENT.TEXT_MARKETPLACE_WB_DESCRIPTION}
                </Text>
                <div className={styles["buttons-generate"]}>
                  <Button
                    onClick={() => {
                      setMarketplaceMode("")
                      setMarketplaceKey("")
                    }}
                    className={styles["generate-back"]}
                  >
                    <ArrowLeftOutlined className={styles["arrow-left-icon"]} />
                    <Text className={styles["button-back-text"]}>
                      {CONTENT.BUTTON_BACK}
                    </Text>
                  </Button>
                  <Button
                    className={styles["generate-button"]}
                    onClick={() => sendOtherMarketplaceSource(2)}
                    disabled={isButtonMarketplaceDisabled}
                  >
                    {CONTENT.BUTTON_INTEGRATE_BANK}
                  </Button>
                </div>
              </div>
            ) : marketplaceMode === "1" ? (
              <div className={styles["wrapper-marketplace"]}>
                <Text className={styles["text-title"]}>
                  {CONTENT.TEXT_MARKETPLACE_YANDEX}
                </Text>
                <Text className={styles["text-title"]}>
                  {CONTENT.TEXT_MARKETPLACE_YANDEX_DESCRIPTION}
                </Text>
                <div className={styles["buttons-generate"]}>
                  <Button
                    onClick={() => setMarketplaceMode("")}
                    className={styles["generate-back"]}
                  >
                    <ArrowLeftOutlined className={styles["arrow-left-icon"]} />
                    <Text className={styles["button-back-text"]}>
                      {CONTENT.BUTTON_BACK}
                    </Text>
                  </Button>
                  <Button
                    className={styles["generate-button"]}
                    onClick={sendYandexMarketplaceSource}
                  >
                    {CONTENT.BUTTON_GENERATE_LINK}
                  </Button>
                </div>
              </div>
            ) : (
              <div className={styles["wrapper-other"]}>
                <Text className={styles["text-title"]}>
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
                    <Input
                      value={otherMarketplace}
                      onChange={(event) =>
                        setOtherMarketplace(event.target.value)
                      }
                    />
                    <Button
                      className={styles["send-button"]}
                      //  onClick={closeModal}
                    >
                      <Text className={styles["button-back-text"]}>
                        {CONTENT.BUTTON_OFD_OTHER_SEND}
                      </Text>
                    </Button>
                  </div>
                </div>
                <Text className={styles["text-title"]}>
                  {CONTENT.TEXT_MARKETPLACE_OTHER_DESCRIPTION}
                </Text>
                <div className={styles["buttons-generate"]}>
                  <Button
                    onClick={() => setMarketplaceMode("")}
                    className={styles["generate-back"]}
                  >
                    <ArrowLeftOutlined className={styles["arrow-left-icon"]} />
                    <Text className={styles["button-back-text"]}>
                      {CONTENT.BUTTON_BACK}
                    </Text>
                  </Button>
                  <Button
                    className={styles["generate-button"]}
                    onClick={() => {
                      closeModal()
                      setAddOperation(true)
                    }}
                  >
                    {CONTENT.BUTTON_OFD_OTHER_ADD}
                  </Button>
                </div>
              </div>
            )}

            {bankToIntegrate === "" &&
              ofdMode === "" &&
              marketplaceMode === "" && (
                <Button onClick={() => setButtonMode("default")}>
                  <ArrowLeftOutlined className={styles["arrow-left-icon"]} />
                  <Text className={styles["button-back-text"]}>
                    {CONTENT.BUTTON_BACK}
                  </Text>
                </Button>
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
