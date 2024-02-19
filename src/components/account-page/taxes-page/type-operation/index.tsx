import { TypeOperationProps } from "./types"
import styles from "./styles.module.scss"
import cn from "classnames"
import { Typography } from "antd"
import { TaxesIcon } from "./icons/taxes"
import { ArrowDownIcon } from "./icons/arrow-down"

export const TypeOperation = ({ type }: TypeOperationProps) => {
  const { Text } = Typography
  const text = (() => {
    switch (type) {
      case 1:
        return "Доход"
      case 2:
        return "Не учитывается"
      case 3:
        return "Возврат"
      case 4:
        return "Налоги и взносы"
      default:
        return "Нет"
    }
  })()
  return (
    <div
      className={cn(styles["type-inner"], {
        [styles["type-income"]]: type === 1,
        [styles["type-non"]]: type === 2,
        [styles["type-back"]]: type === 3,
        [styles["type-taxes"]]: type === 4 || type === 5,
      })}
    >
      <TaxesIcon />
      <Text
        className={cn(styles["type-text"], {
          [styles["type-income"]]: type === 1,
          [styles["type-non"]]: type === 2,
          [styles["type-back"]]: type === 3,
          [styles["type-taxes"]]: type === 4 || type === 5,
        })}
      >
        {text}
      </Text>
      <ArrowDownIcon
        className={cn({
          [styles["type-income"]]: type === 1,
          [styles["type-non"]]: type === 2,
          [styles["type-back"]]: type === 3,
          [styles["type-taxes"]]: type === 4 || type === 5,
        })}
      />
    </div>
  )
}
