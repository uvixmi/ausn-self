import { CreateTaxPaymentOperation } from "../../../../api/myApi"

export interface ConfirmModalProps {
  isOpen: boolean
  setOpen: (arg: boolean) => void
}

export type PaymentsStore = {
  payments: CreateTaxPaymentOperation[]
}
