export interface ConfirmModalProps {
  isOpen: boolean
  setOpen: (arg: boolean) => void
  payAmount?: number
  setDueAmount: (arg: number | undefined) => void
  defaultAccount?: string | null
  openAnalysis: () => void
}
