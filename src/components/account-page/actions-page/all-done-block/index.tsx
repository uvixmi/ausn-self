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
      <Text className={styles["done-title"]}>
        {heading} {smile}
      </Text>
      <Text className={styles["done-text"]}>
        {textOne} <Text className={styles["done-text"]}>{textTwo}</Text>
      </Text>
    </div>
  )
}
