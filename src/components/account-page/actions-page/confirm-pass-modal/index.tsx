import { Button, Modal, Typography, message } from "antd"
import Link from "antd/es/typography/Link"
import { ConfirmPassModalProps } from "./types"
import styles from "./styles.module.scss"
import { api } from "../../../../api/myApi"
import Cookies from "js-cookie"
import { CONTENT } from "./constants"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { RootState } from "../../../main-page/store"

export const ConfirmPassModal = ({
  isOpen,
  setOpen,
  setTasks,
  task_code,
  year,
  report_code,
}: ConfirmPassModalProps) => {
  const { Title, Text } = Typography
  const token = Cookies.get("token")
  const headers = {
    Authorization: `Bearer ${token}`,
  }
  const navigate = useNavigate()
  const [messageApi, contextHolder] = message.useMessage()

  const errorTasks = () => {
    messageApi.open({
      type: "error",
      content: CONTENT.NOTIFCATION_TASKS_ERROR,
      style: { marginTop: "10vh", textAlign: "right" },
    })
  }

  const user = useSelector((state: RootState) => state.user)
  const fnsText =
    user.data.fns_code && user.data.fns_description
      ? CONTENT.FIRST_LINE +
        user.data.fns_code +
        "-" +
        user.data.fns_description
      : CONTENT.FIRST_LINE
  const handleSentReport = async (
    task_code: string,
    period_year: number,
    report_code?: string | null
  ) => {
    const data = {
      report_type: task_code === "ZDP" ? 3 : 2,
      period_type:
        task_code === "ZDP"
          ? 0
          : task_code === "UV1"
          ? 1
          : task_code === "UV2"
          ? 2
          : 3,
      period_year: period_year,
      report_code: report_code ? report_code : undefined,
      report_status: 4,
    }
    await api.tasks.updateReportStatusTasksStatusPut(data, { headers })
    try {
      const tasksResponse = await api.tasks.getTasksTasksGet({ headers })
      setTasks(tasksResponse.data)
    } catch (error) {
      errorTasks()
    }
  }

  return (
    <>
      {contextHolder}
      <Modal
        open={isOpen}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        footer={null}
      >
        <div className={styles["modal-wrapper"]}>
          <Title level={3}>{CONTENT.TITLE_PASSED}</Title>
          <div className={styles["list-wrapper"]}>
            <Text className={styles["text-style"]}>{fnsText}</Text>
            <div>
              <Text className={styles["text-style"]}>
                {CONTENT.SECOND_LINE}
              </Text>
              <Link
                className={styles["text-style"]}
                style={{ color: "#6159ff" }}
                onClick={() => navigate("/reports")}
              >
                {CONTENT.LINK_REPORT}
              </Link>
            </div>
          </div>
          <div className={styles["buttons-row"]}>
            <Button
              key="back"
              onClick={() => {
                setOpen(false)
              }}
              className={styles["button-item-cancel"]}
            >
              {CONTENT.BUTTON_CANCEL}
            </Button>

            <Button
              key="back"
              onClick={() => {
                setOpen(false), handleSentReport(task_code, year, report_code)
              }}
              className={styles["button-item-enter"]}
            >
              {CONTENT.BUTTON_CONFIRM}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
