import { Button, Layout, Progress, Typography } from "antd"
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

export const SettingsPage = () => {
  const [isOpen, setOpen] = useState(false)
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
    if (!loaded && !loading) dispatch(fetchCurrentUser())
  }, [dispatch, loaded, loading])

  const data = [
    {
      date: "09 Января 2024",
      late: true,
      needToPay: 45842,
      paid: 10,
      title: "Фиксированные взносы за 2023 год",
      description:
        "Уплата страхового взноса за ИП в совокупном фиксированном размере",
    },
    {
      date: "25 Апреля 2024",
      late: false,
      needToPay: 0,
      paid: 0,
      title: "Декларация УСН за 2023 год",
      description:
        "Сдача налоговой декларации по упрощенной системе налогообложения",
    },
    {
      date: "25 Апреля 2024",
      late: false,
      needToPay: 45842,
      paid: 10,
      title: "Уведомление по УСН за I кв 2024 года",
      description:
        "Сдача уведомления об исчисленных авансовых платежах по налогу",
    },
    {
      date: "25 Апреля 2024",
      late: false,
      needToPay: 35542,
      paid: 17042,
      title: "Налог УСН за 2023 год",
      description: "Уплата налога по упрощенной системе налогообложения",
    },
    {
      date: "01 Июля 2024",
      late: false,
      needToPay: 42500,
      paid: 32500,
      title: "1% с дохода за 2023 год",
      description: "Уплата страхового взноса с дохода свыше 300 000 ₽",
    },
  ]
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
          <Button
            className={styles["remark-button"]}
            onClick={() => {
              logout(), dispatch(clearData()), navigate("/login")
            }}
          >
            {CONTENT.BUTTON_OFF_PROFILE}
          </Button>
        </div>
        <div className={styles["settings-wrapper"]}>
          <div className={styles["info-user-inner"]}>
            <div className={styles["info-wrapper"]}>
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

              <div className={styles["info-user-row"]}>
                <div className={styles["info-user-row-item"]}>
                  <Text className={styles["text-title"]}>
                    {CONTENT.TEXT_INN}
                  </Text>
                  <Text className={styles["text-inner"]}>
                    {currentUser.inn}
                  </Text>
                </div>
                <div className={styles["info-user-row-item"]}>
                  <Text className={styles["text-title"]}>
                    {CONTENT.TEXT_DATE_REGISTRATION}
                  </Text>
                  <Text className={styles["text-inner"]}>
                    {convertReverseFormat(currentUser.fns_reg_date || "")}
                  </Text>
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
                  <EditIcon />
                  <Text className={styles["button-link"]}>
                    {CONTENT.BUTTON_EDIT}
                  </Text>
                </div>
                <div className={styles["button-heading"]}>
                  <DocumentIcon />
                  <Text className={styles["button-link"]}>
                    {CONTENT.BUTTON_CHANGES_HISTORY}
                  </Text>
                </div>
              </div>
              <Text className={styles["text-inner"]}>
                {currentUser.tax_system && TAX_SYSTEM[currentUser.tax_system]}
                <Text
                  style={{ fontWeight: 600 }}
                  className={styles["text-inner"]}
                >
                  {" " + currentUser.tax_rate + "%"}
                </Text>{" "}
                <InfoCircleOutlined style={{ color: "#6159FF" }} size={14} />
              </Text>
            </div>
            <div className={styles["tax-system-inner"]}>
              <div className={styles["tax-system-heaing-inner"]}>
                <Title
                  className={styles["tax-system-heading"]}
                  style={{ margin: 0 }}
                >
                  {CONTENT.TAX_INSPECTION_HEADING}
                </Title>
                <div className={styles["button-heading"]}>
                  <ArrowCounterIcon />
                  <Text className={styles["button-link"]}>
                    {CONTENT.BUTTON_REFRESH_INN}
                  </Text>
                </div>
              </div>
              <Text className={styles["text-inner"]}>
                {CONTENT.TEXT_CODE_IFNS}
                <Text
                  style={{ fontWeight: 600 }}
                  className={styles["text-inner"]}
                >
                  {" " + currentUser.fns_code}
                </Text>
                {"- " + currentUser.fns_description}
              </Text>
              <Text className={styles["text-inner"]}>
                {CONTENT.TEXT_OKTMO}
                <Text
                  style={{ fontWeight: 600 }}
                  className={styles["text-inner"]}
                >
                  {" " + currentUser.oktmo}
                </Text>
              </Text>
            </div>

            {/* 
          <div className={styles["info-row"]}>
            <div className={styles["info-item"]}>
              <Text className={styles["text-title"]}>
                {CONTENT.TEXT_TAXSYSTEM}
              </Text>
              <Text className={styles["text-inner"]}>{"УСН"}</Text>
            </div>
            <div className={styles["info-item"]}>
              <Text className={styles["text-title"]}>
                {CONTENT.TEXT_DATE_REGISTRATION}
              </Text>
              <Text className={styles["text-inner"]}>{"21.10.2021"}</Text>
            </div>
          </div>
          
          <div className={styles["info-row"]}>
            <div className={styles["info-item"]}>
              <Text className={styles["text-title"]}>
                {CONTENT.TEXT_TAXOBJECT}
              </Text>
              <Text className={styles["text-inner"]}>{"Доходы"}</Text>
            </div>
            <div className={styles["info-item"]}>
              <Text className={styles["text-title"]}>{CONTENT.TEXT_OKTMO}</Text>
              <Text className={styles["text-inner"]}>{"48901221"}</Text>
            </div>
          </div>
          <div className={styles["info-row"]}>
            <div className={styles["info-item"]}>
              <Text className={styles["text-title"]}>
                {CONTENT.TEXT_TAX_RATE}
              </Text>
              <Text className={styles["text-inner"]}>{"4%"}</Text>
            </div>
            <div className={styles["info-item"]}>
              <Text className={styles["text-title"]}>
                {CONTENT.TEXT_CODE_IFNS}
              </Text>
              <Text className={styles["text-inner"]}>{"0550"}</Text>
            </div>
          </div>
          <div className={styles["info-row"]}>
            <div className={styles["info-item"]}>
              <Text className={styles["text-title"]}>
                {CONTENT.TEXT_DATE_BEGIN}
              </Text>
              <Text className={styles["text-inner"]}>{"01.01.2023"}</Text>
            </div>
            <div className={styles["info-item"]}>
              <Text className={styles["text-title"]}>
                {CONTENT.TEXT_DEFAULT_CODE}
              </Text>
            </div>
          </div>
        </div>
        <div className={styles["info-wrapper"]}>
          <Title
            level={3}
            className={styles["heading-text"]}
            style={{ marginTop: 0 }}
          >
            {CONTENT.CONTACT_HEADING}
          </Title>
          <div className={styles["info-row"]}>
            <div className={styles["info-item"]}>
              <Text className={styles["text-title"]}>{CONTENT.TEXT_EMAIL}</Text>
              <Text className={styles["text-inner"]}>{"teat@bk.ru"}</Text>
            </div>
            <div className={styles["info-item"]}>
              <Text className={styles["text-title"]}>{CONTENT.TEXT_PHONE}</Text>
              <Text className={styles["text-inner"]}>{"+7 987 123-00-00"}</Text>
            </div>
              </div>*/}
            <Button className={styles["button-password"]}>
              {CONTENT.BUTTON_CHANGE_PASSWORD}
            </Button>
          </div>
          <div className={styles["right-info"]}>
            <div className={styles["contact-info-inner"]}>
              <div className={styles["tax-system-heaing-inner"]}>
                <Title level={4} style={{ margin: 0 }}>
                  {CONTENT.CONTACT_HEADING}
                </Title>
                <div className={styles["button-heading"]}>
                  <EditIcon />
                  <Text className={styles["button-link"]}>
                    {CONTENT.BUTTON_EDIT}
                  </Text>
                </div>
              </div>
              <div className={styles["info-user-row-item"]}>
                <Text className={styles["text-title"]}>
                  {CONTENT.TEXT_EMAIL}
                </Text>
                <Text className={styles["text-inner"]}>
                  {currentUser.email || "-"}
                </Text>
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
            <div className={styles["additional-info-inner"]}>
              <div className={styles["tax-system-heaing-inner"]}>
                <Title level={4} style={{ margin: 0 }}>
                  {CONTENT.TEXT_ADDITIONAL_INFO}
                </Title>
              </div>
              <div className={styles["info-user-row-item"]}>
                <Text className={styles["text-title"]}>
                  {CONTENT.TEXT_YEAR_BEGIN + " "}
                  <InfoCircleOutlined style={{ color: "#6159FF" }} size={14} />
                </Text>
                <Text className={styles["text-inner"]}>
                  {currentUser.tax_date_begin?.split("-")[0]}
                </Text>
              </div>
              <div className={styles["info-user-row-item"]}>
                <Text className={styles["text-title"]}>
                  {CONTENT.TEXT_DOCUMENTS}
                </Text>
                <Text className={styles["button-link"]}>
                  {CONTENT.LINK_OFERTA}
                </Text>
                <Text className={styles["button-link"]}>
                  {CONTENT.LINK_APPLICATION}
                </Text>
              </div>
              <Button className={styles["off-button"]}>
                <OffDisableIcon />
                {CONTENT.BUTTON_OFF_SERVICE}
              </Button>
            </div>
          </div>
        </div>
      </Content>
    </>
  )
}
