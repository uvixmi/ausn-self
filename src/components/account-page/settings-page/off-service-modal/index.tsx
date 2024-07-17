import { Button, Form, Input, Modal, Select, Typography, message } from "antd"
import { OffServiceModalProps } from "./types"
import styles from "./styles.module.scss"
import { useDispatch, useSelector } from "react-redux"
import { CONTENT } from "./constants"
import cn from "classnames"
import "./styles.scss"
import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import { RateReasonType, TaxSystemType, api } from "../../../../api/myApi"
import "dayjs/locale/ru"

import TextArea from "antd/es/input/TextArea"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../../../AuthContext"
import { clearData } from "../../../authorization-page/slice"
import { useMediaQuery } from "@react-hook/media-query"
import { clearTasks } from "../../client/tasks/slice"
import { clearSources } from "../../client/sources/slice"

export const OffServiceModal = ({ isOpen, setOpen }: OffServiceModalProps) => {
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

  const [serviceDisabled, setServiceDisabled] = useState(false)

  const offService = async () => {
    try {
      setServiceDisabled(true)
      await api.users.disableUserUsersDisablePut({ headers })
    } catch (error) {
      failedProcess()
    }
  }
  const clearAll = () => {
    dispatch(clearData())
    dispatch(clearTasks())
    dispatch(clearSources())
  }

  const navigate = useNavigate()
  const { logout } = useAuth()
  const leaveService = async () => {
    setOpen(false), navigate("/main"), logout(), clearAll()
    setServiceDisabled(false)
  }
  const isMobile = useMediaQuery("(max-width: 767px)")

  return (
    <>
      {contextHolder}
      <Modal
        open={isOpen}
        style={{
          borderRadius: "0",
          top: !isMobile ? "30%" : undefined,
        }}
        onOk={() => {
          setOpen(false)
          serviceDisabled && leaveService()
        }}
        mask={false}
        centered
        onCancel={() => {
          setOpen(false)
          serviceDisabled && leaveService()
        }}
        footer={null}
        className={cn(styles["ant-modal"], "modal-settings")}
      >
        <div className={styles["modal-style"]}>
          <div className={styles["modal-inner"]}>
            {!serviceDisabled ? (
              <div className={styles["operation-inner"]}>
                <Title level={2}>{CONTENT.HEADING_MODAL}</Title>
                <div className={styles["input-item"]}>
                  <Text
                    className={cn(
                      styles["text-description"],
                      styles["default-text"]
                    )}
                  >
                    {CONTENT.OFF_DESCRIPTION}
                  </Text>
                </div>
                {/* <div className={styles["input-item"]}>
                <Text
                  className={cn(
                    styles["text-description"],
                    styles["default-text"]
                  )}
                >
                  {CONTENT.TEXT_AREA_TITLE}
                </Text>
                <Form.Item className={styles["form-inn"]}>
                  <TextArea style={{ borderRadius: "4px" }} />
                </Form.Item>
                  </div>*/}
                <Text
                  className={cn(
                    styles["text-description"],
                    styles["default-text"]
                  )}
                >
                  {CONTENT.THANKS_FOR} <Text>&#x2764;&#xfe0f;</Text>
                </Text>

                <div className={styles["footer-button"]}>
                  <Button
                    className={styles["cancel-button"]}
                    onClick={offService}
                  >
                    {CONTENT.BUTTON_CANCEL}
                  </Button>
                  <Button
                    className={styles["save-button"]}
                    onClick={() => setOpen(false)}
                  >
                    {CONTENT.BUTTON_SAVE}
                  </Button>
                </div>
              </div>
            ) : (
              <div className={styles["operation-inner"]}>
                <Title level={2}>{CONTENT.HEADING_DISABLED}</Title>

                <Text
                  className={cn(
                    styles["text-description"],
                    styles["default-text"]
                  )}
                >
                  {CONTENT.TEXT_DISABLED}
                </Text>

                <div className={styles["footer-button"]}>
                  <Button
                    className={styles["save-button"]}
                    onClick={leaveService}
                  >
                    {CONTENT.BUTTON_DISABLED}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  )
}
