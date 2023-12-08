import { Button, Modal, Typography } from "antd"
import { ConfirmModalProps } from "./types"
import styles from "./styles.module.scss"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { updateInn } from "../../authorization-page/slice"

export const ConfirmModal = ({ isOpen, setOpen }: ConfirmModalProps) => {
  const { Title, Text, Link } = Typography

  const dispatch = useDispatch()

  // Вызываем действие updateInn с новым значением для inn
  const handleUpdateInn = () => {
    dispatch(updateInn("321"))
  }

  const navigate = useNavigate()
  return (
    <Modal
      open={isOpen}
      onOk={() => setOpen(false)}
      onCancel={() => setOpen(false)}
      footer={null}
    >
      <Title level={3}>{"Подтверждение"}</Title>
      <div className={styles["list-wrapper"]}>
        <Text>{"Я подтверждаю, что:"}</Text>
        <Text>
          {
            "- не нанимаю физических лиц по трудовым или гражданско-правовым договорам;"
          }
        </Text>
        <Text>{"- не применяю патентую систему налогообложени;"}</Text>
        <Text>{"- не являюсь плательщиком торгового сбора;"}</Text>
        <Text>{"- не имею движений по валютным счетам ИП"}</Text>
      </div>
      <div className={styles["buttons-row"]}>
        <Button
          key="back"
          onClick={() => {
            setOpen(false), navigate("/non-target")
          }}
          className={styles["button-item-cancel"]}
        >
          {"Отмена"}
        </Button>

        <Button
          key="back"
          onClick={() => {
            setOpen(false), handleUpdateInn(), navigate("/main")
          }}
          className={styles["button-item-enter"]}
        >
          {"Подтвердите"}
        </Button>
      </div>
    </Modal>
  )
}
