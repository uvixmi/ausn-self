import { Button, Modal, Typography, message } from "antd"
import { AddSourceModalProps } from "./types"
import styles from "./styles.module.scss"
import "./styles.scss"
import { CreateAccountResponse, api } from "../../../../api/myApi"
import Cookies from "js-cookie"
import { CONTENT } from "./constants"
import { BankBalanceIcon } from "../type-operation/icons/bank_balance"
import { OnlineCashierIcon } from "../type-operation/icons/online-cashier"
import { MarketplaceIcon } from "../type-operation/icons/marketplace"
import { useState } from "react"
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
import { useDispatch } from "react-redux"
import { AppDispatch } from "../../../main-page/store"
import { fetchSourcesInfo } from "../../client/sources/thunks"

export const AddSourceModal = ({ isOpen, setOpen }: AddSourceModalProps) => {
  const { Title, Text } = Typography
  const token = Cookies.get("token")
  const headers = {
    Authorization: `Bearer ${token}`,
  }

  const dispatch = useDispatch<AppDispatch>()
  const [fileIsLoading, setFileIsLoading] = useState("")
  const [fileName, setFileName] = useState("")

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
      content: CONTENT.NOTIFICATION_PROCESSING_FAILED,
      style: { textAlign: "right" },
    })
  }

  const [buttonMode, setButtonMode] = useState("default")
  const [errorText, setErrorText] = useState("")

  const [accountFromFile, setAccountFromFile] =
    useState<CreateAccountResponse | null>(null)

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
      message.success("Файл успешно загружен!")
      dispatch(fetchSourcesInfo())
    } catch (error) {
      if (isErrorResponse(error)) {
        setErrorText(error.error.detail.message)
        console.log(error.error.detail.message)
        setFileIsLoading("error")
      }
      console.error("Ошибка загрузки файла:", error)
      message.error("Ошибка загрузки файла. Пожалуйста, повторите попытку.")
    }
  }

  const closeModal = () => {
    setOpen(false)
    setAccountFromFile(null)
    setButtonMode("default")
    setFileIsLoading("")
    setFileName("")
  }

  const closeAddSource = () => {
    if (fileIsLoading === "loading") setIsCloseSave(true)
    else closeModal()
  }

  const [isCloseSave, setIsCloseSave] = useState(false)
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
                    ? CONTENT.TEXT_UPLOAD_BANK_INTEGRATION
                    : buttonMode === "online_cashier"
                    ? CONTENT.TEXT_UPLOAD_ONLINE_CASHIER
                    : CONTENT.TEXT_UPLOAD_MARKETPLACE_INTEGRATION}
                </Text>
              ) : (
                buttonMode === "bank_statement" && (
                  <div className={styles["account-data"]}>
                    <Text className={styles["text-title"]}>
                      {CONTENT.DATA_ACCOUNT +
                        accountFromFile?.account_info_from_file?.account_number}
                    </Text>
                    <Text className={styles["text-title"]}>
                      {CONTENT.DATA_BANKNAME +
                        accountFromFile?.account_info_from_file?.bank_name}
                    </Text>
                    <Text className={styles["text-title"]}>
                      {CONTENT.DATA_STATEMENT_BEGIN +
                        formatDateString(
                          accountFromFile?.account_info_from_file?.start_date
                        )}
                    </Text>
                    <Text className={styles["text-title"]}>
                      {CONTENT.DATA_STATEMENT_END +
                        formatDateString(
                          accountFromFile?.account_info_from_file?.end_date
                        )}
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
                        style={{ color: "#141414" }}
                      >
                        {CONTENT.TEXT_UPLOAD_TITLE}
                      </Text>
                      <Text className={styles["text-description"]}>
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
                        style={{ color: "#6159FF" }}
                      >
                        {CONTENT.TEXT_LOADING_TITLE}
                      </Text>
                      <Text className={styles["text-description"]}>
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
                      <Text className={styles["text-description"]}>
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
                      <Text className={styles["text-description"]}>
                        {CONTENT.TEXT_LOADED_DESCRIPTION}
                      </Text>
                    </div>
                  </div>
                )}
              </Dragger>
            ) : buttonMode === "bank_integration" ? (
              <div className={styles["bank-integration-wrapper"]}>
                <div className={styles["bank-row"]}>
                  <Button className={styles["bank-item"]}>
                    <div
                      className={styles["bank-logo"]}
                      style={{ backgroundImage: `url(${alpha})` }}
                    ></div>
                    <Text className={styles["bank-title"]}>
                      {CONTENT.BANK_ALPHA}
                    </Text>
                  </Button>
                  <Button className={styles["bank-item"]}>
                    <div
                      className={styles["bank-logo"]}
                      style={{ backgroundImage: `url(${modul})` }}
                    ></div>
                    <Text className={styles["bank-title"]}>
                      {CONTENT.BANK_MODUL}
                    </Text>
                  </Button>
                </div>
                <div className={styles["bank-row"]}>
                  <Button className={styles["bank-item"]}>
                    <div
                      className={styles["bank-logo"]}
                      style={{ backgroundImage: `url(${tinkoff})` }}
                    ></div>
                    <Text className={styles["bank-title"]}>
                      {CONTENT.BANK_TINKOFF}
                    </Text>
                  </Button>
                  <Button className={styles["bank-item"]}>
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
            ) : buttonMode === "online_cashier" ? (
              <div className={styles["bank-integration-wrapper"]}>
                <div className={styles["bank-row"]}>
                  <Button className={styles["cashier-item"]}>
                    <div
                      className={styles["bank-logo"]}
                      style={{ backgroundImage: `url(${ofdru})` }}
                    ></div>
                    <Text className={styles["bank-title"]}>
                      {CONTENT.CASHIER_OFD}
                    </Text>
                  </Button>
                  <Button className={styles["cashier-item"]}>
                    <div
                      className={styles["bank-logo"]}
                      style={{ backgroundImage: `url(${firstofd})` }}
                    ></div>
                    <Text className={styles["bank-title"]}>
                      {CONTENT.CASHIER_FIRST}
                    </Text>
                  </Button>
                  <Button className={styles["cashier-item"]}>
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
                  <Button className={styles["cashier-item"]}>
                    <div
                      className={styles["bank-logo"]}
                      style={{ backgroundImage: `url(${yaofd})` }}
                    ></div>
                    <Text className={styles["bank-title"]}>
                      {CONTENT.CASHIER_YANDEX}
                    </Text>
                  </Button>
                  <Button className={styles["cashier-item"]}>
                    <div
                      className={styles["bank-logo"]}
                      style={{ backgroundImage: `url(${sbis})` }}
                    ></div>
                    <Text className={styles["bank-title"]}>
                      {CONTENT.CASHIES_SBIS}
                    </Text>
                  </Button>
                  <Button className={styles["cashier-item"]}>
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
                  <Button className={styles["cashier-item"]}>
                    <div
                      className={styles["bank-logo"]}
                      style={{ backgroundImage: `url(${kontur})` }}
                    ></div>
                    <Text className={styles["bank-title"]}>
                      {CONTENT.CASHIER_KONTUR}
                    </Text>
                  </Button>
                  <Button className={styles["cashier-item"]}>
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
                  <Button className={styles["bank-item"]}>
                    <div
                      className={styles["bank-logo"]}
                      style={{ backgroundImage: `url(${ozon})` }}
                    ></div>
                    <Text className={styles["bank-title"]}>
                      {CONTENT.MARKETPLACE_OZON}
                    </Text>
                  </Button>
                  <Button className={styles["bank-item"]}>
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
                  <Button className={styles["bank-item"]}>
                    <div
                      className={styles["bank-logo"]}
                      style={{ backgroundImage: `url(${yamarket})` }}
                    ></div>
                    <Text className={styles["bank-title"]}>
                      {CONTENT.MARKETPLACE_YANDEX}
                    </Text>
                  </Button>
                  <Button className={styles["bank-item"]}>
                    <MarketplaceIcon className={styles["bank-logo"]} />
                    <Text className={styles["bank-title"]}>
                      {CONTENT.MARKETPLACE_OTHER}
                    </Text>
                  </Button>
                </div>
              </div>
            )}

            <Button onClick={() => setButtonMode("default")}>
              <ArrowLeftOutlined className={styles["arrow-left-icon"]} />
              <Text className={styles["button-back-text"]}>
                {CONTENT.BUTTON_BACK}
              </Text>
            </Button>
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