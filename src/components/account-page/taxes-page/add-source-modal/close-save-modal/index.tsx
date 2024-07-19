import { Button, Modal, Typography } from "antd"
import { CloseSaveModalProps } from "./types"
import styles from "./styles.module.scss"
import { CONTENT } from "./constants"
import { ButtonOne } from "../../../../../ui-kit/button"
import "./styles.scss"
import { useMediaQuery } from "@react-hook/media-query"

export const CloseSaveModal = ({
  isOpen,
  setOpen,
  close,
}: CloseSaveModalProps) => {
  const { Text } = Typography

  const isMobile = useMediaQuery("(max-width: 1023px)")

  return (
    <>
      <Modal
        open={isOpen}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        footer={null}
        centered={!isMobile}
        style={{ borderRadius: "4px" }}
        className="modal-source-save"
      >
        <div className={styles["modal-wrapper"]}>
          <Text className={styles["text-heading"]}>{CONTENT.TITLE}</Text>
          <div className={styles["list-wrapper"]}>
            <Text className={styles["text"]}>{CONTENT.FIRST_LINE}</Text>
            <Text className={styles["text"]}>{CONTENT.SECOND_LINE}</Text>
          </div>
          <div className={styles["buttons-row"]}>
            <ButtonOne
              key="close"
              type="secondary"
              onClick={() => {
                setOpen(false)
                close()
              }}
              className={styles["button-item-cancel"]}
            >
              {CONTENT.BUTTON_CLOSE}
            </ButtonOne>

            <ButtonOne
              key="back"
              onClick={() => {
                setOpen(false)
              }}
              className={styles["button-item-back"]}
            >
              {CONTENT.BUTTON_BACK}
            </ButtonOne>
          </div>
        </div>
      </Modal>
    </>
  )
}
