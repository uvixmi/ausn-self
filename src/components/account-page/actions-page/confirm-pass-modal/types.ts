export interface ConfirmPassModalProps {
  isOpen: boolean
  setOpen: (arg: boolean) => void
  task_code: string
  year: number
  report_code?: string | null
}
