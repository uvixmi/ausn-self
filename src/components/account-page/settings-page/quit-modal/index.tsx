import { Button, Modal, Typography } from "antd"
import { QuitModalProps } from "./types"
import styles from "./styles.module.scss"
import { useDispatch } from "react-redux"
import { CONTENT } from "./constants"
import cn from "classnames"
import "./styles.scss"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../../../AuthContext"
import { clearData } from "../../../authorization-page/slice"
import { useMediaQuery } from "@react-hook/media-query"
import { ButtonOne } from "../../../../ui-kit/button"
import { clearTasks } from "../../client/tasks/slice"
import { clearSources } from "../../client/sources/slice"

export const QuitModal = ({ isOpen, setOpen }: QuitModalProps) => {
  const { Text } = Typography
  const dispatch = useDispatch()

  const [serviceDisabled, setServiceDisabled] = useState(false)

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
      <Modal
        open={isOpen}
        zIndex={1200}
        style={{
          borderRadius: "0",
          top: !isMobile ? "30%" : undefined,
        }}
        onOk={() => {
          setOpen(false)
          serviceDisabled && leaveService()
        }}
        onCancel={() => {
          setOpen(false)
          serviceDisabled && leaveService()
        }}
        footer={null}
        className={cn(styles["ant-modal"], "modal-settings-quit")}
      >
        <div className={styles["modal-style"]}>
          <div className={styles["modal-inner"]}>
            <div className={styles["operation-inner"]}>
              <Text className={styles["title-text-head"]}>
                {CONTENT.HEADING_MODAL}
              </Text>

              <div className={styles["footer-button"]}>
                <ButtonOne
                  type="secondary"
                  className={styles["cancel-button"]}
                  onClick={leaveService}
                >
                  {CONTENT.BUTTON_QUIT}
                </ButtonOne>
                <ButtonOne
                  className={styles["save-button"]}
                  onClick={() => setOpen(false)}
                >
                  {CONTENT.BUTTON_CANCEL}
                </ButtonOne>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}
