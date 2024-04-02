import { Button, Modal, Radio, Typography } from "antd"
import { ConfirmModalProps } from "./types"
import styles from "./styles.module.scss"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import {
  fetchCurrentUser,
  refreshRole,
  updateInn,
} from "../../authorization-page/slice"
import { AppDispatch, RootState } from "../../main-page/store"
import { useEffect, useState } from "react"

export const ConfirmModal = ({ isOpen, setOpen }: ConfirmModalProps) => {
  const { Title, Text, Link } = Typography

  const dispatch = useDispatch<AppDispatch>()

  const { loaded, loading } = useSelector((state: RootState) => state.user)

  const handleUpdate = () => {
    dispatch(refreshRole())
    dispatch(fetchCurrentUser())
  }
  const [value, setValue] = useState(1)

  const navigate = useNavigate()
  return (
    <Modal
      open={isOpen}
      onOk={() => setOpen(false)}
      onCancel={() => setOpen(false)}
      footer={null}
    >
      <Title level={3}>{"Подтверждение"}</Title>
      <Text>{"Пожалуйста, выберите условие"}</Text>
      <Radio.Group
        onChange={(e) => {
          setValue(e.target.value)
        }}
        value={value}
      >
        <div className={styles["list-radio"]}>
          <Radio value={1} />
          <div className={styles["list-wrapper"]}>
            <Text>
              <Text className={styles["text-bold"]}>{"Подтверждаю"}</Text>
              {", что:"}
            </Text>
            <Text>
              {
                "- не нанимаю физических лиц по трудовым или гражданско-правовым договорам;"
              }
            </Text>
            <Text>{"- не применяю патентую систему налогообложения;"}</Text>
            <Text>{"- не являюсь плательщиком торгового сбора;"}</Text>
            <Text>{"- не имею движений по валютным счетам ИП"}</Text>
          </div>
        </div>
        <div>
          <Radio value={2} />
          <Text className={styles["text-bold"]}>{"Не подтверждаю "}</Text>
          <Text>{"вышеперечисленное"}</Text>
        </div>
      </Radio.Group>
      <div className={styles["buttons-row"]}>
        <Button
          key="back"
          onClick={
            value === 1
              ? () => {
                  handleUpdate()
                }
              : () => {
                  setOpen(false), navigate("/non-target")
                }
          }
          className={styles["button-item-enter"]}
        >
          {"Отправить"}
        </Button>
      </div>
    </Modal>
  )
}
