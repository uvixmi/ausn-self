import { Button, Modal, Typography, message } from "antd"
import { DeleteOperationModalProps } from "./types"
import styles from "./styles.module.scss"
import { api } from "../../../../api/myApi"
import Cookies from "js-cookie"
import { CONTENT } from "../constants"
import { useEffect } from "react"
import { useMediaQuery } from "@react-hook/media-query"
import { ButtonOne } from "../../../../ui-kit/button"

export const DeleteOperationModal = ({
  isOpen,
  setOpen,
  id,
  setWasDeleted,
}: DeleteOperationModalProps) => {
  const { Title, Text } = Typography
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

  const errorProcess = () => {
    messageApi.open({
      type: "error",
      content: CONTENT.NOTIFICATION_PROCESSING_FAILED,
      style: { textAlign: "right" },
    })
  }

  const deleteOperation = async (id: string) => {
    try {
      await api.operations.deleteOperationOperationsDelete(
        { operation_id: id },
        { headers }
      )
      successProcess()
      setWasDeleted(true)
    } catch (error) {
      errorProcess()
    }
  }

  const isMobile = useMediaQuery("(max-width: 767px)")

  return (
    <>
      {contextHolder}
      <Modal
        open={isOpen}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        footer={null}
        width={isMobile ? 345 : undefined}
        style={{ top: !isMobile ? "30%" : undefined }}
      >
        <div className={styles["modal-wrapper"]}>
          <Title level={3} className={styles["heading-text"]}>
            {"Удалить операцию?"}
          </Title>
          <div className={styles["list-wrapper"]}>
            <Text className={styles["description-text"]}>
              {"Удаление операции может повлиять на расчет налога"}
            </Text>
          </div>
          <div className={styles["buttons-row"]}>
            <ButtonOne
              type="secondary"
              key="back"
              onClick={() => {
                setOpen(false)
              }}
              className={styles["button-item-cancel"]}
            >
              {"Отмена"}
            </ButtonOne>

            <ButtonOne
              type="danger"
              key="delete"
              onClick={() => {
                setOpen(false), id && deleteOperation(id)
              }}
              className={styles["button-item-enter"]}
            >
              {"Удалить"}
            </ButtonOne>
          </div>
        </div>
      </Modal>
    </>
  )
}
