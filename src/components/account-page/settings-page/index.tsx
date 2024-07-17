import { Button, Layout, Progress, Skeleton, Tooltip, Typography } from "antd"
import { CONTENT, TAX_SYSTEM } from "./constants"
import styles from "./styles.module.scss"
import cn from "classnames"
import { InfoCircleOutlined } from "@ant-design/icons"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../main-page/store"
import { clearData, fetchCurrentUser } from "../../authorization-page/slice"
import { convertReverseFormat } from "../actions-page/payment-modal/utils"
import { ArrowCounterIcon } from "../taxes-page/type-operation/icons/arrow-counter"
import { PencilIcon } from "../taxes-page/type-operation/icons/pencil"
import { EditIcon } from "../taxes-page/type-operation/icons/edit"
import { DocumentIcon } from "../taxes-page/type-operation/icons/document"
import { useAuth } from "../../../AuthContext"
import { useNavigate } from "react-router-dom"
import { FailedIcon } from "../taxes-page/type-operation/icons/failed"
import { OffDisableIcon } from "../taxes-page/type-operation/icons/off-disable"
import { ChangeModeModal } from "./change-mode-modal"
import { OffServiceModal } from "./off-service-modal"
import { useMediaQuery } from "@react-hook/media-query"
import { QuitModal } from "./quit-modal"
import { getRateReason } from "./utils"
import { TaxSystemType } from "../../../api/myApi"
import Link from "antd/es/typography/Link"
import { ButtonOne } from "../../../ui-kit/button"

export const SettingsPage = () => {
  const [isOpenEditMode, setIsOpenEditMode] = useState(false)
  const [isOffOpen, setIsOffOpen] = useState(false)
  const { isAuthenticated, login, setRole, logout } = useAuth()

  const navigate = useNavigate()
  const { Sider, Content } = Layout
  const { Title, Text } = Typography
  const {
    data: currentUser,
    loaded,
    loading,
  } = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch<AppDispatch>()
  useEffect(() => {
    if (!loaded && loading !== "succeeded" && loading !== "loading")
      dispatch(fetchCurrentUser())
  }, [dispatch, loaded, loading])

  const isMobile = useMediaQuery("(max-width: 767px)")

  const [isQuitOpen, setIsQuitOpen] = useState(false)
  return (
    <>
      <Content className={styles["content-wrapper"]}>
        <div className={styles["header-wrapper"]}>
          <Title
            level={2}
            className={styles["heading-text"]}
            style={{ margin: 0 }}
          >
            {CONTENT.SETTINGS_HEADING}
          </Title>
          <ButtonOne
            className={styles["remark-button"]}
            onClick={() => {
              setIsQuitOpen(true)
            }}
          >
            {CONTENT.BUTTON_OFF_PROFILE}
          </ButtonOne>
        </div>
        <div className={styles["settings-wrapper"]}>
          <div className={styles["info-user-inner"]}>
            <div className={styles["info-wrapper"]}>
              {currentUser.inn ? (
                <Title level={1} className={styles["heading-info-text"]}>
                  {currentUser.inn?.length === 12
                    ? "ИП " +
                      currentUser.lastname +
                      " " +
                      currentUser.firstname?.charAt(0) +
                      ". " +
                      currentUser.patronymic?.charAt(0) +
                      "."
                    : currentUser.full_name}
                </Title>
              ) : (
                <Skeleton.Input active />
              )}

              <div className={styles["info-user-row"]}>
                <div className={styles["info-user-row-item"]}>
                  <Text className={styles["text-title"]}>
                    {CONTENT.TEXT_INN}
                  </Text>
                  {currentUser.inn ? (
                    <Text className={styles["text-inner"]}>
                      {currentUser.inn}
                    </Text>
                  ) : (
                    <Skeleton.Input active />
                  )}
                </div>
                <div className={styles["info-user-row-item"]}>
                  <Text className={styles["text-title"]}>
                    {CONTENT.TEXT_DATE_REGISTRATION}
                  </Text>
                  {currentUser.fns_reg_date ? (
                    <Text className={styles["text-inner"]}>
                      {convertReverseFormat(currentUser.fns_reg_date || "")}
                    </Text>
                  ) : (
                    <Skeleton.Input active />
                  )}
                </div>
              </div>
            </div>
            <div className={styles["tax-system-inner"]}>
              <div className={styles["tax-system-heaing-inner"]}>
                <Title
                  className={styles["tax-system-heading"]}
                  style={{ margin: 0 }}
                >
                  {CONTENT.TAXMODE_HEADING}
                </Title>
                <div className={styles["button-heading"]}>
                  <Button
                    className={styles["edit-button"]}
                    onClick={() => setIsOpenEditMode(true)}
                  >
                    <EditIcon />
                    <Text className={styles["button-link"]}>
                      {CONTENT.BUTTON_EDIT}
                    </Text>
                  </Button>
                </div>
                {/*<div className={styles["button-heading"]}>
                  <DocumentIcon />
                  <Text className={styles["button-link"]}>
                    {CONTENT.BUTTON_CHANGES_HISTORY}
                  </Text>
                </div>*/}
              </div>
              {currentUser.tax_rate ? (
                <Text className={styles["text-inner-mode"]}>
                  {currentUser.tax_system && TAX_SYSTEM[currentUser.tax_system]}
                  <Text
                    style={{ fontWeight: 600 }}
                    className={styles["text-inner-mode"]}
                  >
                    {" " + currentUser.tax_rate + "%"}
                  </Text>{" "}
                  {(currentUser.rate_reason !== null ||
                    currentUser.rate_reason !== "") &&
                    currentUser.rate_reason &&
                    getRateReason(currentUser.rate_reason) !== undefined &&
                    !(
                      (currentUser.tax_system === TaxSystemType.UsnD &&
                        currentUser.tax_rate === 6) ||
                      (currentUser.tax_system === TaxSystemType.UsnDR &&
                        currentUser.tax_rate === 15)
                    ) && (
                      <Tooltip
                        title={
                          currentUser.rate_reason
                            ? getRateReason(currentUser.rate_reason)
                            : undefined
                        }
                      >
                        <InfoCircleOutlined
                          style={{ color: "#6159FF" }}
                          size={14}
                        />
                      </Tooltip>
                    )}
                </Text>
              ) : (
                <Skeleton.Input active />
              )}
            </div>
            <div className={styles["tax-system-inner"]}>
              <div className={styles["tax-system-heaing-inner"]}>
                <Title
                  className={styles["tax-system-heading"]}
                  style={{ margin: 0 }}
                >
                  {CONTENT.TAX_INSPECTION_HEADING}
                </Title>
                {/*<div className={styles["button-heading"]}>
                  <ArrowCounterIcon />
                  <Text className={styles["button-link"]}>
                    {CONTENT.BUTTON_REFRESH_INN}
                  </Text>
                </div>*/}
              </div>
              {currentUser.fns_code ? (
                <Text className={styles["text-inner-mode"]}>
                  {CONTENT.TEXT_CODE_IFNS}
                  <Text
                    style={{ fontWeight: 600 }}
                    className={styles["text-inner-mode"]}
                  >
                    {" " + currentUser.fns_code}
                  </Text>
                  {"- " + currentUser.fns_description}
                </Text>
              ) : (
                <Skeleton.Input active />
              )}
              {currentUser.oktmo ? (
                <Text className={styles["text-inner-mode"]}>
                  {CONTENT.TEXT_OKTMO}
                  <Text
                    style={{ fontWeight: 600 }}
                    className={styles["text-inner-mode"]}
                  >
                    {" " + currentUser.oktmo}
                  </Text>
                </Text>
              ) : (
                <Skeleton.Input active />
              )}
            </div>

            {/* <Button className={styles["button-password"]}>
              {CONTENT.BUTTON_CHANGE_PASSWORD}
                </Button>*/}
          </div>
          <div className={styles["right-info"]}>
            <div className={styles["contact-info-inner"]}>
              <div className={styles["contacts-heading-inner"]}>
                <Title level={4} style={{ margin: 0 }}>
                  {CONTENT.CONTACT_HEADING}
                </Title>
                {/* <div className={styles["button-heading"]}>
                  <EditIcon />
                  <Text className={styles["button-link"]}>
                    {CONTENT.BUTTON_EDIT}
                  </Text>
              </div>*/}
              </div>
              <div className={styles["info-user-row-item"]}>
                <Text className={styles["text-title"]}>
                  {CONTENT.TEXT_EMAIL}
                </Text>
                {currentUser.email ? (
                  <Text className={styles["text-inner"]}>
                    {currentUser.email || "-"}
                  </Text>
                ) : (
                  <Skeleton.Input active />
                )}
              </div>
              <div className={styles["info-user-row-item"]}>
                <Text className={styles["text-title"]}>
                  {CONTENT.TEXT_PHONE}
                </Text>
                <Text className={styles["text-inner"]}>
                  {currentUser.phone_number || "-"}
                </Text>
              </div>
            </div>
            {isMobile && <div className={styles["divider"]}></div>}
            <div className={styles["additional-info-inner"]}>
              <div className={styles["tax-system-heaing-inner"]}>
                <Title level={4} style={{ margin: 0 }}>
                  {CONTENT.TEXT_ADDITIONAL_INFO}
                </Title>
              </div>
              <div className={styles["info-user-row-item"]}>
                <Text className={styles["text-title"]}>
                  {CONTENT.TEXT_YEAR_BEGIN + " "}
                  <Tooltip title={CONTENT.TOOLPTIP_YEAR}>
                    <InfoCircleOutlined
                      style={{ color: "#6159FF" }}
                      size={14}
                    />
                  </Tooltip>
                </Text>
                {currentUser.tax_date_begin ? (
                  <Text className={styles["text-inner"]}>
                    {currentUser.tax_date_begin?.split("-")[0]}
                  </Text>
                ) : (
                  <Skeleton.Input active />
                )}
              </div>
              <div className={styles["info-user-row-item"]}>
                <Text className={styles["text-title"]}>
                  {CONTENT.TEXT_DOCUMENTS}
                </Text>
                <Link
                  className={styles["button-link"]}
                  target="_blink"
                  href="https://docs.google.com/document/d/1wyphbddHpr1hvZpQzwkQ29sUUiRZnRh7/"
                >
                  {CONTENT.LINK_OFERTA}
                </Link>
                <Link
                  className={styles["button-link"]}
                  target="_blink"
                  href="https://docs.google.com/document/d/1LgOipJN6Zg8FRWuCUbis7LwfF4y8znCP/"
                >
                  {CONTENT.LINK_APPLICATION}
                </Link>
              </div>
              <Button
                className={styles["off-button"]}
                onClick={() => setIsOffOpen(true)}
              >
                <OffDisableIcon />
                {CONTENT.BUTTON_OFF_SERVICE}
              </Button>
            </div>
          </div>
        </div>
      </Content>
      <ChangeModeModal isOpen={isOpenEditMode} setOpen={setIsOpenEditMode} />
      <OffServiceModal isOpen={isOffOpen} setOpen={setIsOffOpen} />
      <QuitModal isOpen={isQuitOpen} setOpen={setIsQuitOpen} />
    </>
  )
}
