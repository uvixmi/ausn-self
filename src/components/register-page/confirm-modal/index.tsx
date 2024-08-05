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
import { ButtonOne } from "../../../ui-kit/button"

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
      <div className={styles["list-radio-inner"]}>
        <div className={styles["heading-wrapper"]}>
          <Text className={styles["heading-text"]}>{"Подтверждение"}</Text>
          <Text className={styles["title-confirm"]}>
            {"Пожалуйста, выберите условие"}
          </Text>
        </div>
        <Radio.Group
          onChange={(e) => {
            setValue(e.target.value)
          }}
          value={value}
        >
          <div className={styles["list-radio"]}>
            <Radio value={1} />
            <div className={styles["list-wrapper"]}>
              <Text className={styles["text-style"]}>
                <Text className={styles["text-bold"]}>{"Подтверждаю"}</Text>
                {", что:"}
              </Text>
              <Text className={styles["text-style"]}>
                {
                  "- не нанимаю физических лиц по трудовым или гражданско-правовым договорам;"
                }
              </Text>
              <Text className={styles["text-style"]}>
                {"- не применяю патентую систему налогообложения;"}
              </Text>
              <Text className={styles["text-style"]}>
                {"- не являюсь плательщиком торгового сбора;"}
              </Text>
              <Text className={styles["text-style"]}>
                {"- не имею движений по валютным счетам ИП"}
              </Text>
            </div>
          </div>
          <div style={{ marginTop: "24px" }}>
            <Radio value={2} />
            <Text className={styles["text-bold"]}>{"Не подтверждаю "}</Text>
            <Text className={styles["text-style"]}>{"вышеперечисленное"}</Text>
          </div>
        </Radio.Group>
        <div className={styles["buttons-row"]}>
          <ButtonOne
            key="back"
            className={styles["button-item-enter"]}
            onClick={
              value === 1
                ? () => {
                    handleUpdate()
                  }
                : () => {
                    setOpen(false), navigate("/non-target")
                  }
            }
          >
            {"Отправить"}
          </ButtonOne>
        </div>
      </div>
    </Modal>
  )
}
