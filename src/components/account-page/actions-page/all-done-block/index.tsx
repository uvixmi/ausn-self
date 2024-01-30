import { Typography } from "antd"
import { AllDoneProps } from "./types"
import { CONTENT } from "./constants"
import { formatDateString } from "../utils"
import styles from "./styles.module.scss"

export const AllDoneBlock = ({ type }: AllDoneProps) => {
  const { Title, Text } = Typography
  const heading = type === "report" ? CONTENT.TITLE_PASSED : CONTENT.TITLE_PAID
  const textOne = CONTENT.TEXT_ONE + formatDateString(undefined)
  const textTwo =
    type === "report" ? CONTENT.TEXT_TWO_DECLARATION : CONTENT.TEXT_TWO_TAXES
  const smile = type === "report" ? <Text>🥳</Text> : <Text>👍</Text>
  return (
    <div className={styles["done-wrapper"]}>
      <Title level={5} style={{ marginTop: 0 }}>
        {heading} {smile}
      </Title>
      <Text>{textOne}</Text>
      <Text>{textTwo}</Text>
    </div>
  )
}
