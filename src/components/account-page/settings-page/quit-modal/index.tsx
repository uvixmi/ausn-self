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

export const QuitModal = ({ isOpen, setOpen }: QuitModalProps) => {
  const { Title } = Typography
  const dispatch = useDispatch()

  const [serviceDisabled, setServiceDisabled] = useState(false)

  const navigate = useNavigate()
  const { logout } = useAuth()
  const leaveService = async () => {
    setOpen(false), navigate("/main"), logout(), dispatch(clearData())
    setServiceDisabled(false)
  }

  const isMobile = useMediaQuery("(max-width: 767px)")

  return (
    <>
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
        onCancel={() => {
          setOpen(false)
          serviceDisabled && leaveService()
        }}
        footer={null}
        className={cn(styles["ant-modal"], "modal-payment")}
      >
        <div className={styles["modal-style"]}>
          <div className={styles["modal-inner"]}>
            <div className={styles["operation-inner"]}>
              <Title level={2}>{CONTENT.HEADING_MODAL}</Title>

              <div className={styles["footer-button"]}>
                <Button
                  className={styles["cancel-button"]}
                  onClick={leaveService}
                >
                  {CONTENT.BUTTON_QUIT}
                </Button>
                <Button
                  className={styles["save-button"]}
                  onClick={() => setOpen(false)}
                >
                  {CONTENT.BUTTON_CANCEL}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}
