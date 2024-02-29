export interface AddSourceModalProps {
  isOpen: boolean
  setOpen: (arg: boolean) => void
}
export interface ErrorResponse {
  error: {
    detail: {
      message: string
    }
  }
}
