import { Button, Modal, Typography } from "antd"
import { CloseSaveModalProps } from "./types"
import styles from "./styles.module.scss"
import { CONTENT } from "./constants"

export const CloseSaveModal = ({
  isOpen,
  setOpen,
  close,
}: CloseSaveModalProps) => {
  const { Title, Text } = Typography

  return (
    <>
      <Modal
        open={isOpen}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        footer={null}
      >
        <Title level={3}>{CONTENT.TITLE}</Title>
        <div className={styles["list-wrapper"]}>
          <Text className={styles["text"]}>{CONTENT.FIRST_LINE}</Text>
          <Text className={styles["text"]}>{CONTENT.SECOND_LINE}</Text>
        </div>
        <div className={styles["buttons-row"]}>
          <Button
            key="close"
            onClick={() => {
              setOpen(false)
              close()
            }}
            className={styles["button-item-cancel"]}
          >
            {CONTENT.BUTTON_CLOSE}
          </Button>

          <Button
            key="back"
            onClick={() => {
              setOpen(false)
            }}
            className={styles["button-item-back"]}
          >
            {CONTENT.BUTTON_BACK}
          </Button>
        </div>
      </Modal>
    </>
  )
}
