import { CreateTaxPaymentOperation } from "../../../../api/myApi"

export interface ConfirmModalProps {
  isOpen: boolean
  setOpen: (arg: boolean) => void
  payAmount?: number
  fetchTasks: () => void
  openAnalysis: () => void
  taskYear: number
}

export type PaymentsStore = {
  payments: CreateTaxPaymentOperation[]
}
