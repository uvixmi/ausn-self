export interface DeleteOperationModalProps {
  isOpen: boolean
  setOpen: (arg: boolean) => void
  id: string | null
  setWasDeleted: (arg: boolean) => void
}
